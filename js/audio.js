window.Game = window.Game || {};

window.Game.Audio = (function () {
  let ctx = null;
  let sfxMuted = false;
  let musicMuted = true;
  let musicTimer = null;
  let chaseMode = false;
  let stepIndex = 0;

  function ensureCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    decodePendingSamples();
    return ctx;
  }

  function playTone(freqStart, freqEnd, duration, type = 'sine', gainVal = 0.15) {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playNoise(duration, filterFreq = 800, gainVal = 0.12) {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const bufferSize = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;

    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;

    const gain = c.createGain();
    const now = c.currentTime;
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    noise.start(now);
  }

  // =========================================================================
  // BULLETPROOF REAL WAV SAMPLE ENGINE (Web Audio AudioBuffer + Pre-Unlocked Pool)
  // Eliminates cloneNode() autoplay rejections so real WAVs NEVER drop to synth beeps!
  // =========================================================================
  const SAMPLE_URLS = {
    cat: 'sounds/Cat.wav',
    catDamage: 'sounds/cat-damage.wav',
    dog: 'sounds/Dog.wav',
    lion: 'sounds/Lion.wav',
    savePoint: 'sounds/save-point.wav',
  };

  const rawBuffers = {};
  const decodedBuffers = {};
  const decodingKeys = {};
  const htmlPools = {};
  const htmlPoolIdx = {};
  let audioUnlocked = false;

  // 1. Lightweight 1-slot lazy HTMLAudio fallback per sample (preload='none' — zero duplicate RAM when Web Audio is active!)
  Object.keys(SAMPLE_URLS).forEach((key) => {
    const url = SAMPLE_URLS[key];
    const a = new Audio(url);
    a.preload = 'none';
    a.playsInline = true;
    htmlPools[key] = [a];
    htmlPoolIdx[key] = 0;
  });

  function releaseDuplicateMediaForKey(key) {
    delete rawBuffers[key];
    if (htmlPools[key]) {
      htmlPools[key].forEach((clip) => {
        try {
          clip.pause();
          clip.removeAttribute('src');
          if (typeof clip.load === 'function') clip.load();
        } catch (e) {}
      });
      delete htmlPools[key];
    }
  }

  // 2. Immediately fetch raw WAV bytes into memory for zero-latency Web Audio decoding
  function preloadSampleBytes(key) {
    if (rawBuffers[key] || decodedBuffers[key]) return;
    if (typeof fetch !== 'function') return;
    fetch(SAMPLE_URLS[key])
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((buf) => {
        if (!buf) return;
        if (decodedBuffers[key]) return;
        rawBuffers[key] = buf;
        if (ctx) decodeSampleKey(key);
      })
      .catch(() => {});
  }

  function decodeSampleKey(key) {
    if (!ctx || decodedBuffers[key] || decodingKeys[key] || !rawBuffers[key]) return;
    decodingKeys[key] = true;
    try {
      const bufToDecode = rawBuffers[key];
      const onDecoded = (audioBuf) => {
        decodedBuffers[key] = audioBuf;
        decodingKeys[key] = false;
        releaseDuplicateMediaForKey(key);
      };
      const result = ctx.decodeAudioData(
        bufToDecode.slice(0),
        onDecoded,
        () => {
          decodingKeys[key] = false;
        }
      );
      if (result && typeof result.then === 'function') {
        result.then(onDecoded).catch(() => {
          decodingKeys[key] = false;
        });
      }
    } catch (e) {
      decodingKeys[key] = false;
    }
  }

  function decodePendingSamples() {
    if (!ctx) return;
    Object.keys(SAMPLE_URLS).forEach((key) => {
      if (rawBuffers[key] && !decodedBuffers[key]) {
        decodeSampleKey(key);
      } else if (!rawBuffers[key] && !decodedBuffers[key]) {
        preloadSampleBytes(key);
      }
    });
  }

  // Kick off background WAV fetches right away
  Object.keys(SAMPLE_URLS).forEach(preloadSampleBytes);

  // Unlock AudioContext + silently warm up HTMLAudio pools on the very first user gesture
  function unlockAllAudio() {
    if (audioUnlocked) {
      ensureCtx();
      return;
    }
    audioUnlocked = true;
    ensureCtx();
    Object.keys(htmlPools).forEach((key) => {
      htmlPools[key].forEach((clip) => {
        try {
          if (clip.readyState === 0) clip.load();
          const prevMuted = clip.muted;
          clip.muted = true;
          const p = clip.play();
          if (p && typeof p.then === 'function') {
            p.then(() => {
              clip.pause();
              clip.currentTime = 0;
              clip.muted = prevMuted;
            }).catch(() => {
              clip.muted = prevMuted;
            });
          } else {
            clip.pause();
            clip.currentTime = 0;
            clip.muted = prevMuted;
          }
        } catch (e) {}
      });
    });
  }

  ['pointerdown', 'touchstart', 'keydown', 'click'].forEach((evName) => {
    window.addEventListener(evName, unlockAllAudio, { capture: true, passive: true });
  });

  function playWebAudioBuffer(c, buffer, volume) {
    const startBuffer = () => {
      try {
        const src = c.createBufferSource();
        const gain = c.createGain();
        src.buffer = buffer;
        gain.gain.setValueAtTime(volume, c.currentTime);
        src.connect(gain);
        gain.connect(c.destination);
        src.start(0);
      } catch (e) {}
    };
    if (c.state === 'suspended') {
      c.resume().then(startBuffer).catch(startBuffer);
    } else {
      startBuffer();
    }
  }

  function playSample(key, volume = 0.78, fallbackFn) {
    if (sfxMuted) return;
    const c = ensureCtx();

    // Primary path: decoded Web Audio AudioBuffer (100% reliable, instant, zero autoplay blocks!)
    if (c && decodedBuffers[key]) {
      playWebAudioBuffer(c, decodedBuffers[key], volume);
      return;
    }

    // Trigger decoding if raw bytes already arrived
    if (c && rawBuffers[key]) {
      decodeSampleKey(key);
    }

    // Secondary path: pre-created, pre-unlocked reusable HTMLAudio pool (compatible with file://)
    const pool = htmlPools[key];
    if (pool && pool.length) {
      const idx = htmlPoolIdx[key] % pool.length;
      htmlPoolIdx[key] = (idx + 1) % pool.length;
      const clip = pool[idx];
      try {
        clip.pause();
        clip.currentTime = 0;
        clip.muted = false;
        clip.volume = Math.max(0, Math.min(1, volume));
        const p = clip.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            // If AudioBuffer finished decoding in the meantime, prefer it over synth!
            if (c && decodedBuffers[key]) {
              playWebAudioBuffer(c, decodedBuffers[key], volume);
            } else if (fallbackFn && clip.error) {
              fallbackFn();
            }
          });
        }
        return;
      } catch (e) {}
    }

    if (fallbackFn) fallbackFn();
  }

  function playMeowSynth() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.11);
    osc.frequency.exponentialRampToValueAtTime(430, now + 0.38);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1900, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.42);
  }

  function playMeow() {
    playSample('cat', 0.80, playMeowSynth);
  }

  function playJump() {
    playTone(260, 520, 0.12, 'sine', 0.11);
  }

  function playWallScratch() {
    playNoise(0.08, 2200, 0.09);
  }

  function playSplash() {
    playNoise(0.32, 950, 0.22);
    playTone(320, 120, 0.2, 'sine', 0.12);
  }

  function playBarkSynth() {
    if (sfxMuted) return;
    playTone(210, 95, 0.13, 'sawtooth', 0.18);
    setTimeout(() => playTone(240, 105, 0.14, 'sawtooth', 0.16), 130);
  }

  function playBark() {
    playSample('dog', 0.78, playBarkSynth);
  }

  function playLionRoarSynth() {
    if (sfxMuted) return;
    playTone(135, 58, 0.55, 'sawtooth', 0.22);
    playNoise(0.48, 320, 0.14);
  }

  function playLionRoar() {
    playSample('lion', 0.88, playLionRoarSynth);
  }

  function playScorpionSnap() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    for (let k = 0; k < 3; k++) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1450 + k * 280, t + k * 0.045);
      osc.frequency.exponentialRampToValueAtTime(520, t + k * 0.045 + 0.04);
      gain.gain.setValueAtTime(0.08, t + k * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, t + k * 0.045 + 0.045);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t + k * 0.045); osc.stop(t + k * 0.045 + 0.05);
    }
  }

  function playSnakeHiss() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const bufSize = Math.floor(c.sampleRate * 0.28);
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.55));
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.setValueAtTime(3400, t); filt.Q.setValueAtTime(2.6, t);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    src.connect(filt); filt.connect(gain); gain.connect(c.destination);
    src.start(t); src.stop(t + 0.29);
  }

  function playFalconCry() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1780, t);
    osc.frequency.exponentialRampToValueAtTime(1120, t + 0.22);
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.setValueAtTime(1600, t); filt.Q.setValueAtTime(3.0, t);
    gain.gain.setValueAtTime(0.085, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(filt); filt.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.25);
  }

  function playSandWhoosh() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const bufSize = Math.floor(c.sampleRate * 0.22);
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.setValueAtTime(680, t);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    src.connect(filt); filt.connect(gain); gain.connect(c.destination);
    src.start(t); src.stop(t + 0.23);
  }

  function playBambooClack() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(340, t + 0.09);
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.12);
  }

  function playTanukiPop() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(210, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(310, t + 0.15);
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.17);
  }

  function playCrowCaw() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.linearRampToValueAtTime(490, t + 0.16);
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.setValueAtTime(1100, t); filt.Q.setValueAtTime(3.2, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(filt); filt.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.19);
  }

  function playVeniceBell() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    for (const [freq, vol] of [[392, 0.085], [784, 0.04], [1174, 0.02]]) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.65);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t); osc.stop(t + 0.66);
    }
  }

  function playBridgeCrank() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    // Crisp iron ratchet clack + warm brass gear chime
    for (let i = 0; i < 3; i++) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340 + i * 110, t + i * 0.065);
      osc.frequency.exponentialRampToValueAtTime(210 + i * 70, t + i * 0.065 + 0.055);
      gain.gain.setValueAtTime(0.085, t + i * 0.065);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.065 + 0.06);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t + i * 0.065); osc.stop(t + i * 0.065 + 0.065);
    }
  }

  function playWaterLock() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.14);
    gain.gain.setValueAtTime(0.11, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.17);
  }

  function playTrainWhistle() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    for (const freq of [440, 554.37, 659.25]) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.96, t + 0.42);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.055, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.44);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t); osc.stop(t + 0.45);
    }
  }

  function playSteamHiss() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.24), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter(); filt.type = 'highpass'; filt.frequency.setValueAtTime(1600, t);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.11, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    src.connect(filt); filt.connect(gain); gain.connect(c.destination);
    src.start(t);
  }

  function playRailSwitch() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.09);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.12);
  }

  function playRailBell() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1180, t);
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.35);
  }

  function playCuckooChime() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    // Classic Swiss Black-Forest/Alpine two-note cuckoo call (E5 -> C5)
    const notes = [[659.25, 0, 0.14], [523.25, 0.17, 0.20]];
    for (const [f, dt0, dur] of notes) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f * 1.04, t + dt0);
      osc.frequency.exponentialRampToValueAtTime(f, t + dt0 + 0.03);
      gain.gain.setValueAtTime(0.001, t + dt0);
      gain.gain.linearRampToValueAtTime(0.16, t + dt0 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dt0 + dur);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t + dt0); osc.stop(t + dt0 + dur + 0.02);
    }
  }

  function playAlphornNote() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    // Warm resonant wooden Swiss Alphorn harmonic chord (F3 + C4 + F4)
    for (const [freq, vol] of [[174.61, 0.11], [261.63, 0.07], [349.23, 0.045]]) {
      const osc = c.createOscillator();
      const filt = c.createBiquadFilter();
      const gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      filt.type = 'lowpass'; filt.frequency.setValueAtTime(720, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.62);
      osc.connect(filt); filt.connect(gain); gain.connect(c.destination);
      osc.start(t); osc.stop(t + 0.65);
    }
  }

  function playMarmotWhistle() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    // Crisp high Alpine marmot warning chirp
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2150, t);
    osc.frequency.exponentialRampToValueAtTime(2680, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(1920, t + 0.18);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.11, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.19);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.20);
  }

  function playCowbell() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    // Warm bronze Alpine Treichel cowbell clang
    for (const [freq, vol] of [[560, 0.08], [845, 0.045]]) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t); osc.stop(t + 0.34);
    }
  }

  function playCowMoo(pitchScale = 1.0) {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const startMoo = () => {
      try {
        const t = c.currentTime;
        const dur = 1.06;
        const f0 = 122 * pitchScale;

        // Glottal vocal cord source + warm sub-octave chest resonance
        const oscMain = c.createOscillator();
        const oscSub = c.createOscillator();
        oscMain.type = 'sawtooth';
        oscSub.type = 'triangle';

        // Natural bovine pitch contour: closed-mouth "Mmm" -> warm arched "Ooooo" -> gentle fall "uh"
        oscMain.frequency.setValueAtTime(f0 * 0.92, t);
        oscMain.frequency.linearRampToValueAtTime(f0 * 1.19, t + 0.24);
        oscMain.frequency.setValueAtTime(f0 * 1.17, t + 0.56);
        oscMain.frequency.exponentialRampToValueAtTime(f0 * 0.88, t + dur);

        oscSub.frequency.setValueAtTime(f0 * 0.46, t);
        oscSub.frequency.linearRampToValueAtTime(f0 * 0.595, t + 0.24);
        oscSub.frequency.exponentialRampToValueAtTime(f0 * 0.44, t + dur);

        // Subtle natural vocal vibrato (4.8 Hz)
        const vib = c.createOscillator();
        const vibGain = c.createGain();
        vib.type = 'sine';
        vib.frequency.setValueAtTime(4.8, t);
        vibGain.gain.setValueAtTime(0.5, t);
        vibGain.gain.linearRampToValueAtTime(3.2, t + 0.35);
        vibGain.gain.linearRampToValueAtTime(1.2, t + dur);
        vib.connect(vibGain);
        vibGain.connect(oscMain.frequency);

        const srcMix = c.createGain();
        const subMix = c.createGain();
        srcMix.gain.setValueAtTime(0.85, t);
        subMix.gain.setValueAtTime(0.45, t);
        oscMain.connect(srcMix);
        oscSub.connect(subMix);

        // Parallel bovine vocal-tract formant filters (F1 chest/pharynx + F2 oral "oo" vowel) + warm lowpass
        const f1 = c.createBiquadFilter();
        f1.type = 'bandpass';
        f1.Q.setValueAtTime(3.8, t);
        f1.frequency.setValueAtTime(235 * pitchScale, t);
        f1.frequency.linearRampToValueAtTime(365 * pitchScale, t + 0.26);
        f1.frequency.linearRampToValueAtTime(285 * pitchScale, t + dur);

        const f2 = c.createBiquadFilter();
        f2.type = 'bandpass';
        f2.Q.setValueAtTime(4.6, t);
        f2.frequency.setValueAtTime(510 * pitchScale, t);
        f2.frequency.linearRampToValueAtTime(760 * pitchScale, t + 0.28);
        f2.frequency.linearRampToValueAtTime(590 * pitchScale, t + dur);

        const warmLp = c.createBiquadFilter();
        warmLp.type = 'lowpass';
        warmLp.frequency.setValueAtTime(1280, t);

        const masterGain = c.createGain();
        masterGain.gain.setValueAtTime(0.001, t);
        masterGain.gain.linearRampToValueAtTime(0.18, t + 0.14);
        masterGain.gain.setValueAtTime(0.22, t + 0.52);
        masterGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        srcMix.connect(f1);
        srcMix.connect(f2);
        subMix.connect(f1);
        f1.connect(warmLp);
        f2.connect(warmLp);
        warmLp.connect(masterGain);
        masterGain.connect(c.destination);

        oscMain.start(t);
        oscSub.start(t);
        vib.start(t);
        oscMain.stop(t + dur + 0.04);
        oscSub.stop(t + dur + 0.04);
        vib.stop(t + dur + 0.04);

        // Soft accompanying Swiss pasture Treichel bell clink as the cow lifts its head
        for (const [bf, bv] of [[554, 0.036], [832, 0.020]]) {
          const bOsc = c.createOscillator();
          const bGain = c.createGain();
          bOsc.type = 'triangle';
          bOsc.frequency.setValueAtTime(bf * pitchScale, t + 0.08);
          bGain.gain.setValueAtTime(bv, t + 0.08);
          bGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.38);
          bOsc.connect(bGain);
          bGain.connect(c.destination);
          bOsc.start(t + 0.08);
          bOsc.stop(t + 0.40);
        }
      } catch (e) {}
    };
    if (c.state === 'suspended') {
      c.resume().then(startMoo).catch(startMoo);
    } else {
      startMoo();
    }
  }

  function playStoneThud() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(115, t);
    osc.frequency.exponentialRampToValueAtTime(34, t + 0.22);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.25);
    playNoise(0.14, 240, 0.16);
  }

  let lastPurrAt = 0;
  function playPurrSynth() {
    if (sfxMuted) return;
    playTone(520, 690, 0.11, 'sine', 0.055);
    setTimeout(() => playTone(620, 820, 0.13, 'sine', 0.05), 85);
  }

  function playCheckpoint() {
    playSample('savePoint', 0.85, playPurrSynth);
  }

  function playPurr() {
    if (sfxMuted) return;
    const nowMs = Date.now();
    if (nowMs - lastPurrAt < 1400) return;
    lastPurrAt = nowMs;
    playPurrSynth();
  }

  function playTreat() {
    playTone(587, 880, 0.1, 'sine', 0.13);
    setTimeout(() => playTone(880, 1175, 0.16, 'sine', 0.14), 85);
  }

  function playHurtSynth() {
    playTone(680, 260, 0.25, 'sawtooth', 0.15);
  }

  function playHurt() {
    playSample('catDamage', 0.85, playHurtSynth);
  }

  function playNightVision(on) {
    if (on) {
      playTone(420, 860, 0.18, 'sine', 0.1);
    } else {
      playTone(760, 380, 0.14, 'sine', 0.08);
    }
  }

  function playCoin(combo = 0) {
    const semitone = Math.min(8, combo);
    const base = 987.77 * Math.pow(2, semitone / 12);
    playTone(base, base * 1.335, 0.09, 'sine', 0.11);
    setTimeout(() => playTone(base * 1.335, base * 1.5, 0.13, 'triangle', 0.09), 55);
  }

  function playPurchase() {
    playTone(523.25, 659.25, 0.09, 'sine', 0.12);
    setTimeout(() => playTone(659.25, 783.99, 0.1, 'sine', 0.12), 70);
    setTimeout(() => playTone(783.99, 1046.5, 0.18, 'triangle', 0.13), 140);
  }

  function playUiClick() {
    playTone(620, 460, 0.045, 'sine', 0.06);
  }

  function playShieldBreak() {
    playTone(920, 340, 0.22, 'triangle', 0.14);
    playNoise(0.14, 1800, 0.09);
  }

  function playStageClear() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      setTimeout(() => playTone(n, n * 1.02, 0.18, 'triangle', 0.12), i * 85);
    });
  }

  // Background music tracks from music/ folder (soft, non-intrusive volume)
  const BG_NORMAL_VOL = 0.16;
  const BG_CHASE_VOL = 0.21;
  const cityMusic = new Audio('music/Rushofcity.mp3');
  cityMusic.loop = true;
  cityMusic.preload = 'none';
  cityMusic.volume = BG_NORMAL_VOL;

  const parkMusic = new Audio('music/Public-Park.mp3');
  parkMusic.loop = true;
  parkMusic.preload = 'none';
  parkMusic.volume = BG_NORMAL_VOL;

  const harborMusic = new Audio('music/Seaport.mp3');
  harborMusic.loop = true;
  harborMusic.preload = 'none';
  harborMusic.volume = BG_NORMAL_VOL;

  const rooftopMusic = new Audio('music/Building-rooftops.mp3');
  rooftopMusic.loop = true;
  rooftopMusic.preload = 'none';
  rooftopMusic.volume = BG_NORMAL_VOL;

  const subwayMusic = new Audio('music/subway.mp3');
  subwayMusic.loop = true;
  subwayMusic.preload = 'none';
  subwayMusic.volume = BG_NORMAL_VOL;

  const desertMusic = new Audio("music/Egypt's Desert.mp3");
  desertMusic.loop = true;
  desertMusic.preload = 'none';
  desertMusic.volume = BG_NORMAL_VOL;

  const japanMusic = new Audio('music/japan-classic.mp3');
  japanMusic.loop = true;
  japanMusic.preload = 'none';
  japanMusic.volume = BG_NORMAL_VOL;

  let activeTrackKey = 'city';
  let bgMusic = cityMusic;
  let bgMusicStarted = false;

  // Fallback walking-bass synth loop (used only if MP3 fails)
  const jazzNotes = [110, 130.81, 146.83, 164.81, 146.83, 130.81, 98, 123.47];
  const chaseNotes = [146.83, 174.61, 196, 220, 196, 174.61, 164.81, 146.83];

  function tickMusic() {
    if (!musicMuted && ctx && ctx.state === 'running') {
      const notes = chaseMode ? chaseNotes : jazzNotes;
      const freq = notes[stepIndex % notes.length];
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(chaseMode ? 0.065 : 0.045, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (chaseMode ? 0.16 : 0.28));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      stepIndex++;
    }
    const interval = chaseMode ? 190 : 380;
    musicTimer = setTimeout(tickMusic, interval);
  }

  function setMusicTrack(theme) {
    const nextKey =
      theme === 'japan'
        ? 'japan'
        : theme === 'desert' || theme === 'marrakech' || theme === 'maya' || theme === 'greece'
        ? 'desert'
        : theme === 'subway' || theme === 'museum' || theme === 'steam_train'
        ? 'subway'
        : theme === 'rooftop' || theme === 'construction' || theme === 'rooftop_neon' || theme === 'paris' || theme === 'airport'
        ? 'rooftop'
        : theme === 'harbor' || theme === 'harbor_storm' || theme === 'bridge' || theme === 'venice'
        ? 'harbor'
        : theme === 'park' || theme === 'greenhouse' || theme === 'istanbul' || theme === 'swiss'
        ? 'park'
        : 'city';
    if (nextKey === activeTrackKey) return;
    bgMusic.pause();
    activeTrackKey = nextKey;
    bgMusic =
      nextKey === 'japan'
        ? japanMusic
        : nextKey === 'desert'
        ? desertMusic
        : nextKey === 'subway'
        ? subwayMusic
        : nextKey === 'rooftop'
        ? rooftopMusic
        : nextKey === 'harbor'
        ? harborMusic
        : nextKey === 'park'
        ? parkMusic
        : cityMusic;
    bgMusic.currentTime = 0;
    bgMusic.muted = musicMuted;
    bgMusic.volume = chaseMode ? BG_CHASE_VOL : BG_NORMAL_VOL;
    if (bgMusicStarted && !musicMuted) {
      bgMusic.play().catch(() => {
        if (!musicTimer) tickMusic();
      });
    }
  }

  function startMusic() {
    ensureCtx();
    if (bgMusicStarted) {
      if (bgMusic.paused && !musicMuted) {
        bgMusic.play().catch(() => {});
      }
      return;
    }
    bgMusicStarted = true;
    bgMusic.muted = musicMuted;
    bgMusic.volume = chaseMode ? BG_CHASE_VOL : BG_NORMAL_VOL;
    const p = bgMusic.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        if (!musicTimer) tickMusic();
      });
    }
  }

  function pauseMusic() {
    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
    }
  }

  function resumeMusic() {
    if (bgMusicStarted && !musicMuted && bgMusic && bgMusic.paused) {
      bgMusic.play().catch(() => {});
    }
  }

  function setChaseMode(active) {
    chaseMode = active;
    bgMusic.volume = active ? BG_CHASE_VOL : BG_NORMAL_VOL;
  }

  function toggleSfxMute() {
    sfxMuted = !sfxMuted;
    return sfxMuted;
  }

  function toggleMusicMute() {
    musicMuted = !musicMuted;
    bgMusic.muted = musicMuted;
    if (!musicMuted && bgMusicStarted && bgMusic.paused) {
      bgMusic.play().catch(() => {});
    }
    return musicMuted;
  }

  function isSfxMuted() {
    return sfxMuted;
  }

  function isMusicMuted() {
    return musicMuted;
  }

  return {
    ensureCtx,
    playMeow,
    playJump,
    playWallScratch,
    playSplash,
    playBark,
    playLionRoar,
    playScorpionSnap,
    playSnakeHiss,
    playFalconCry,
    playSandWhoosh,
    playBambooClack,
    playTanukiPop,
    playCrowCaw,
    playStoneThud,
    playTrainWhistle,
    playSteamHiss,
    playRailSwitch,
    playRailBell,
    playVeniceBell,
    playWaterLock,
    playBridgeCrank,
    playCuckooChime,
    playAlphornNote,
    playMarmotWhistle,
    playCowbell,
    playCowMoo,
    playPurr,
    playCheckpoint,
    playTreat,
    playHurt,
    playNightVision,
    playCoin,
    playPurchase,
    playUiClick,
    playShieldBreak,
    playStageClear,
    setMusicTrack,
    startMusic,
    pauseMusic,
    resumeMusic,
    setChaseMode,
    toggleMute: toggleSfxMute,
    toggleSfxMute,
    toggleMusicMute,
    isSfxMuted,
    isMusicMuted,
  };
})();
