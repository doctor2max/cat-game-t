window.Game = window.Game || {};

window.Game.Audio = (function () {
  let ctx = null;
  let sfxMuted = false;
  let musicMuted = false;
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
    savePoint: 'sounds/save-point.wav',
  };

  const rawBuffers = {};
  const decodedBuffers = {};
  const decodingKeys = {};
  const htmlPools = {};
  const htmlPoolIdx = {};
  let audioUnlocked = false;

  // 1. Pre-create a 3-slot reusable HTMLAudio pool per sample (never cloneNode()!)
  Object.keys(SAMPLE_URLS).forEach((key) => {
    const url = SAMPLE_URLS[key];
    const pool = [];
    for (let i = 0; i < 3; i++) {
      const a = new Audio(url);
      a.preload = 'auto';
      a.playsInline = true;
      pool.push(a);
    }
    htmlPools[key] = pool;
    htmlPoolIdx[key] = 0;
  });

  // 2. Immediately fetch raw WAV bytes into memory for zero-latency Web Audio decoding
  function preloadSampleBytes(key) {
    if (rawBuffers[key] || decodedBuffers[key]) return;
    if (typeof fetch !== 'function') return;
    fetch(SAMPLE_URLS[key])
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((buf) => {
        if (!buf) return;
        rawBuffers[key] = buf;
        if (ctx) decodeSampleKey(key);
      })
      .catch(() => {});
  }

  function decodeSampleKey(key) {
    if (!ctx || decodedBuffers[key] || decodingKeys[key] || !rawBuffers[key]) return;
    decodingKeys[key] = true;
    try {
      const copy = rawBuffers[key].slice(0);
      const result = ctx.decodeAudioData(
        copy,
        (audioBuf) => {
          decodedBuffers[key] = audioBuf;
          decodingKeys[key] = false;
        },
        () => {
          decodingKeys[key] = false;
        }
      );
      if (result && typeof result.then === 'function') {
        result
          .then((audioBuf) => {
            decodedBuffers[key] = audioBuf;
            decodingKeys[key] = false;
          })
          .catch(() => {
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

  function playPurrSynth() {
    if (sfxMuted) return;
    const c = ensureCtx();
    if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const gain = c.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(58, now);
    lfo.frequency.setValueAtTime(24, now);
    lfoGain.gain.setValueAtTime(0.08, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.72);
    lfo.stop(now + 0.72);
  }

  function playCheckpoint() {
    playSample('savePoint', 0.85, playPurrSynth);
  }

  function playPurr() {
    playCheckpoint();
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

  // Background music tracks from sounds/ folder (soft, non-intrusive volume)
  const BG_NORMAL_VOL = 0.16;
  const BG_CHASE_VOL = 0.21;
  const cityMusic = new Audio('sounds/Rushofcity.mp3');
  cityMusic.loop = true;
  cityMusic.preload = 'none';
  cityMusic.volume = BG_NORMAL_VOL;

  const parkMusic = new Audio('sounds/Public-Park.mp3');
  parkMusic.loop = true;
  parkMusic.preload = 'none';
  parkMusic.volume = BG_NORMAL_VOL;

  const harborMusic = new Audio('sounds/Seaport.mp3');
  harborMusic.loop = true;
  harborMusic.preload = 'none';
  harborMusic.volume = BG_NORMAL_VOL;

  const rooftopMusic = new Audio('sounds/Building-rooftops.mp3');
  rooftopMusic.loop = true;
  rooftopMusic.preload = 'none';
  rooftopMusic.volume = BG_NORMAL_VOL;

  const subwayMusic = new Audio('sounds/subway.mp3');
  subwayMusic.loop = true;
  subwayMusic.preload = 'none';
  subwayMusic.volume = BG_NORMAL_VOL;

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
      theme === 'subway' || theme === 'museum'
        ? 'subway'
        : theme === 'rooftop' || theme === 'construction' || theme === 'rooftop_neon'
        ? 'rooftop'
        : theme === 'harbor' || theme === 'harbor_storm' || theme === 'bridge'
        ? 'harbor'
        : theme === 'park' || theme === 'greenhouse'
        ? 'park'
        : 'city';
    if (nextKey === activeTrackKey) return;
    bgMusic.pause();
    activeTrackKey = nextKey;
    bgMusic =
      nextKey === 'subway'
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
