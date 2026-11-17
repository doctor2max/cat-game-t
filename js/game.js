window.Game = window.Game || {};

(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const Audio = window.Game.Audio;
  const Particles = window.Game.Particles;
  const Art = window.Game.Art;

  // UI Elements
  const introLayer = document.getElementById('introLayer');
  const introHud = document.getElementById('introHud');
  const introVideo = document.getElementById('introVideo');
  const btnSkipIntro = document.getElementById('btnSkipIntro');

  const gameOverLayer = document.getElementById('gameOverLayer');
  const gameOverVideo = document.getElementById('gameOverVideo');
  const gameOverActions = document.getElementById('gameOverActions');
  const btnGameOverRestart = document.getElementById('btnGameOverRestart');

  const winLayer = document.getElementById('winLayer');
  const winVideo = document.getElementById('winVideo');
  const btnSkipWin = document.getElementById('btnSkipWin');

  const hud = document.getElementById('hud');
  const controlsBar = document.getElementById('controlsBar');
  const startOverlay = document.getElementById('startOverlay');
  const endOverlay = document.getElementById('endOverlay');
  const endBadge = document.getElementById('endBadge');
  const endTitle = document.getElementById('endTitle');
  const endStats = document.getElementById('endStats');

  const livesBar = document.getElementById('livesBar');
  const livesCount = document.getElementById('livesCount');
  const treatsCount = document.getElementById('treatsCount');
  const skillNightVision = document.getElementById('skillNightVision');
  const skillMeow = document.getElementById('skillMeow');

  const stageBadge = document.getElementById('stageBadge');
  const btnGuide = document.getElementById('btnGuide');
  const btnCloseGuide = document.getElementById('btnCloseGuide');
  const btnMainMenu = document.getElementById('btnMainMenu');
  const btnGameOverMenu = document.getElementById('btnGameOverMenu');
  const btnEndMenu = document.getElementById('btnEndMenu');
  const exitConfirmOverlay = document.getElementById('exitConfirmOverlay');
  const btnConfirmExit = document.getElementById('btnConfirmExit');
  const btnCancelExit = document.getElementById('btnCancelExit');
  const btnDimBg = document.getElementById('btnDimBg');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnMusic = document.getElementById('btnMusic');
  const btnAudio = document.getElementById('btnAudio');
  const touchControls = document.getElementById('touchControls');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnStartStage2 = document.getElementById('btnStartStage2');
  const btnStartStage3 = document.getElementById('btnStartStage3');
  const btnStartStage4 = document.getElementById('btnStartStage4');
  const btnStartStage5 = document.getElementById('btnStartStage5');
  const btnStartStage6 = document.getElementById('btnStartStage6');
  const btnStartStage7 = document.getElementById('btnStartStage7');
  const btnStartStage8 = document.getElementById('btnStartStage8');
  const btnNextStage = document.getElementById('btnNextStage');
  const btnRestartStage = document.getElementById('btnRestartStage');

  const STORAGE_KEY = 'theWayHome_maxUnlockedStage';
  const DIM_BG_KEY = 'theWayHome_dimBg';
  let dimBackground = false;
  try {
    dimBackground = localStorage.getItem(DIM_BG_KEY) === '1';
  } catch (e) {}
  if (btnDimBg) btnDimBg.classList.toggle('active', dimBackground);

  let maxUnlockedStage = 1;
  try {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!isNaN(saved) && saved >= 1 && saved <= 8) maxUnlockedStage = saved;
  } catch (e) {}

  const stageButtons = [
    null,
    btnStartGame,
    btnStartStage2,
    btnStartStage3,
    btnStartStage4,
    btnStartStage5,
    btnStartStage6,
    btnStartStage7,
    btnStartStage8,
  ];
  const stageBaseLabels = stageButtons.map((b) => (b ? b.textContent : ''));

  function syncStageButtons() {
    for (let s = 2; s <= 8; s++) {
      const btn = stageButtons[s];
      if (!btn) continue;
      const locked = s > maxUnlockedStage;
      btn.disabled = locked;
      btn.classList.toggle('locked', locked);
      btn.textContent = locked ? `🔒 ${stageBaseLabels[s]}` : stageBaseLabels[s];
    }
  }

  let currentStage = 1;
  let level = null;
  let catCtrl = null;
  let running = false;
  let playingCanvasIntro = false;
  let canvasIntroTimer = 0;
  let elapsedTime = 0;
  let collectedTreats = 0;
  let camX = 0;
  let camY = 0;
  let lastTime = 0;

  const input = {
    left: false,
    right: false,
    down: false,
    shift: false,
    jumpHeld: false,
    jumpPressed: false,
  };

  function initLevel(stageNum) {
    if (typeof stageNum === 'number') currentStage = stageNum;
    level =
      currentStage === 8
        ? window.Game.createLevel8()
        : currentStage === 7
        ? window.Game.createLevel7()
        : currentStage === 6
        ? window.Game.createLevel6()
        : currentStage === 5
        ? window.Game.createLevel5()
        : currentStage === 4
        ? window.Game.createLevel4()
        : currentStage === 3
        ? window.Game.createLevel3()
        : currentStage === 2
        ? window.Game.createLevel2()
        : window.Game.createLevel1();
    const shortStageTitles = {
      1: 'المرحلة 1: الأزقة',
      2: 'المرحلة 2: السوق',
      3: 'المرحلة 3: الحديقة',
      4: 'المرحلة 4: أعماق الحديقة',
      5: 'المرحلة 5: الميناء',
      6: 'المرحلة 6: الأسطح',
      7: 'المرحلة 7: المترو',
      8: 'المرحلة 8: الورشة',
    };
    stageBadge.textContent = shortStageTitles[currentStage] || `المرحلة ${currentStage}`;
    Audio.setMusicTrack(level.theme);
    catCtrl = window.Game.Cat(level.startX, level.startY);
    Particles.clear();
    elapsedTime = 0;
    collectedTreats = 0;
    camX = 0;
    camY = 0;
    updateHUD();
  }

  function updateHUD() {
    if (!catCtrl) return;
    const c = catCtrl.cat;
    livesCount.textContent = `${c.lives}/${c.maxLives}`;
    livesBar.innerHTML = '';
    for (let i = 0; i < c.maxLives; i++) {
      const seg = document.createElement('div');
      seg.className = 'life-seg' + (i < c.lives ? ' active' : '');
      livesBar.appendChild(seg);
    }
    treatsCount.textContent = `${collectedTreats}/3`;
    skillNightVision.classList.toggle('active', c.nightVision);
    skillMeow.classList.toggle('cooldown', c.meowCooldown > 0);
  }

  function clearAllInputs() {
    input.left = false;
    input.right = false;
    input.down = false;
    input.shift = false;
    input.jumpHeld = false;
    input.jumpPressed = false;
  }

  // Official Intro Video Flow (uses intro.mp4 directly)
  function enterGameplay() {
    playingCanvasIntro = false;
    introLayer.classList.add('hidden');
    if (introHud) introHud.classList.add('hidden');
    introVideo.pause();
    hud.classList.remove('hidden');
    if (controlsBar) controlsBar.classList.remove('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    Audio.startMusic();
    running = true;
    Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, 'LIVES: 6/7', '#6ce5ff');
  }

  function startIntroSequence() {
    startOverlay.classList.add('hidden');
    if (introHud) introHud.classList.remove('hidden');
    const candidates = ['videos/intro.mp4'];

    let idx = 0;
    function tryNextSource() {
      if (idx >= candidates.length) {
        introLayer.classList.add('hidden');
        playingCanvasIntro = true;
        canvasIntroTimer = 0;
        return;
      }
      introVideo.src = candidates[idx++];
      introLayer.classList.remove('hidden');
      introVideo.play().catch(() => {
        tryNextSource();
      });
    }

    introVideo.onerror = () => {
      tryNextSource();
    };
    introVideo.onended = () => {
      enterGameplay();
    };

    tryNextSource();
  }

  btnSkipIntro.addEventListener('click', enterGameplay);

  function triggerMeow() {
    if (!catCtrl || !running) return;
    const c = catCtrl.cat;
    if (c.meowCooldown > 0) return;

    c.meowCooldown = 2.4;
    Audio.playMeow();
    const mx = c.x + c.w / 2;
    const my = c.y + c.h / 2;
    Particles.spawnMeowRing(mx, my);
    Particles.spawnPopup(mx, c.y - 16, 'Meow!', '#ffd36e');

    for (const dog of level.dogs) {
      const dx = mx - (dog.x + dog.w / 2);
      const dy = my - (dog.y + dog.h / 2);
      if (Math.hypot(dx, dy) < 360) {
        dog.state = 'distracted';
        dog.distractX = Math.max(dog.minX, Math.min(dog.maxX, mx));
        dog.stateTimer = 3.2;
        Particles.spawnPopup(dog.x + dog.w / 2, dog.y - 14, '❓', '#6ce5ff');
      }
    }
    updateHUD();
  }

  function updateDogs(dt) {
    const c = catCtrl.cat;
    const catCx = c.x + c.w / 2;
    const catCy = c.y + c.h / 2;
    let anyChasing = false;

    for (const dog of level.dogs) {
      const dogCx = dog.x + dog.w / 2;
      const dogCy = dog.y + dog.h / 2;
      const dist = Math.hypot(catCx - dogCx, catCy - dogCy);
      const sightRange = c.crouching ? 135 : 225;
      const sameHeight = Math.abs(catCy - dogCy) < 85;
      const facingCat = (catCx - dogCx) * dog.facing > -20;

      if (dog.state === 'distracted') {
        dog.stateTimer -= dt;
        const diff = dog.distractX - dogCx;
        if (Math.abs(diff) > 12) {
          dog.facing = diff > 0 ? 1 : -1;
          dog.x += dog.facing * 85 * dt;
        }
        if (dog.stateTimer <= 0) {
          dog.state = 'patrol';
        }
      } else if (dist < sightRange && sameHeight && facingCat && c.invulnTimer <= 0) {
        if (dog.state !== 'alert') {
          dog.state = 'alert';
          Audio.playBark();
          Particles.spawnPopup(dogCx, dog.y - 14, '❗ WOOF!', '#ff6b8b');
        }
        anyChasing = true;
        const dxToCat = catCx - dogCx;
        if (Math.abs(dxToCat) > 14) {
          dog.facing = dxToCat > 0 ? 1 : -1;
          dog.x += dog.facing * 175 * dt;
          dog.x = Math.max(dog.minX, Math.min(dog.maxX, dog.x));
        }
      } else {
        dog.state = 'patrol';
        dog.x += dog.facing * Math.abs(dog.vx) * dt;
        if (dog.x <= dog.minX) {
          dog.x = dog.minX;
          dog.facing = 1;
        } else if (dog.x >= dog.maxX) {
          dog.x = dog.maxX;
          dog.facing = -1;
        }
      }

      if (
        c.x + 6 < dog.x + dog.w - 6 &&
        c.x + c.w - 6 > dog.x + 6 &&
        c.y + 6 < dog.y + dog.h &&
        c.y + c.h > dog.y + 6
      ) {
        if (catCtrl.takeDamage('عضّة كلب! -1 ❤️')) {
          updateHUD();
        }
      }
    }

    Audio.setChaseMode(anyChasing);
  }

  function updateHedgehogs(dt) {
    if (!level.hedgehogs) return;
    const c = catCtrl.cat;
    for (const hog of level.hedgehogs) {
      hog.x += hog.facing * Math.abs(hog.vx) * dt;
      if (hog.x <= hog.minX) {
        hog.x = hog.minX;
        hog.facing = 1;
      } else if (hog.x >= hog.maxX) {
        hog.x = hog.maxX;
        hog.facing = -1;
      }
      if (
        c.x + 6 < hog.x + hog.w - 4 &&
        c.x + c.w - 6 > hog.x + 4 &&
        c.y + 6 < hog.y + hog.h &&
        c.y + c.h > hog.y + 4
      ) {
        if (catCtrl.takeDamage('أشواك القنفذ! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateCrows(dt, timeSec) {
    if (!level.crows) return;
    const c = catCtrl.cat;
    for (const crow of level.crows) {
      crow.x += crow.facing * Math.abs(crow.vx) * dt;
      if (crow.x <= crow.minX) {
        crow.x = crow.minX;
        crow.facing = 1;
      } else if (crow.x >= crow.maxX) {
        crow.x = crow.maxX;
        crow.facing = -1;
      }
      crow.y = crow.baseY + Math.sin(timeSec * crow.freq + crow.minX * 0.01) * crow.amp;
      if (
        c.x + 8 < crow.x + crow.w - 6 &&
        c.x + c.w - 8 > crow.x + 6 &&
        c.y + 6 < crow.y + crow.h - 4 &&
        c.y + c.h > crow.y + 6
      ) {
        if (catCtrl.takeDamage('هجوم غراب! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateCrabs(dt) {
    if (!level.crabs) return;
    const c = catCtrl.cat;
    for (const crab of level.crabs) {
      crab.x += crab.facing * Math.abs(crab.vx) * dt;
      if (crab.x <= crab.minX) {
        crab.x = crab.minX;
        crab.facing = 1;
      } else if (crab.x >= crab.maxX) {
        crab.x = crab.maxX;
        crab.facing = -1;
      }
      if (
        c.x + 6 < crab.x + crab.w - 4 &&
        c.x + c.w - 6 > crab.x + 4 &&
        c.y + 6 < crab.y + crab.h &&
        c.y + c.h > crab.y + 4
      ) {
        if (catCtrl.takeDamage('كماشة سرطان! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateSeagulls(dt, timeSec) {
    if (!level.seagulls) return;
    const c = catCtrl.cat;
    for (const gull of level.seagulls) {
      gull.x += gull.facing * Math.abs(gull.vx) * dt;
      if (gull.x <= gull.minX) {
        gull.x = gull.minX;
        gull.facing = 1;
      } else if (gull.x >= gull.maxX) {
        gull.x = gull.maxX;
        gull.facing = -1;
      }
      gull.y = gull.baseY + Math.sin(timeSec * gull.freq + gull.minX * 0.01) * gull.amp;
      if (
        c.x + 8 < gull.x + gull.w - 6 &&
        c.x + c.w - 8 > gull.x + 6 &&
        c.y + 6 < gull.y + gull.h - 4 &&
        c.y + c.h > gull.y + 6
      ) {
        if (catCtrl.takeDamage('هجوم نورس! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateRats(dt) {
    if (!level.rats) return;
    const c = catCtrl.cat;
    for (const rat of level.rats) {
      const sameHeight = Math.abs(c.y + c.h - (rat.y + rat.h)) < 45;
      const near = Math.abs(c.x - rat.x) < 180;
      const speedMult = sameHeight && near ? 1.45 : 1;
      rat.x += rat.facing * Math.abs(rat.vx) * speedMult * dt;
      if (rat.x <= rat.minX) {
        rat.x = rat.minX;
        rat.facing = 1;
      } else if (rat.x >= rat.maxX) {
        rat.x = rat.maxX;
        rat.facing = -1;
      }
      if (
        c.x + 6 < rat.x + rat.w - 4 &&
        c.x + c.w - 6 > rat.x + 4 &&
        c.y + 6 < rat.y + rat.h &&
        c.y + c.h > rat.y + 4
      ) {
        if (catCtrl.takeDamage('عضّة جرذ! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateRaccoons(dt) {
    if (!level.raccoons) return;
    const c = catCtrl.cat;
    for (const rac of level.raccoons) {
      rac.x += rac.facing * Math.abs(rac.vx) * dt;
      if (rac.x <= rac.minX) {
        rac.x = rac.minX;
        rac.facing = 1;
      } else if (rac.x >= rac.maxX) {
        rac.x = rac.maxX;
        rac.facing = -1;
      }
      if (
        c.x + 6 < rac.x + rac.w - 5 &&
        c.x + c.w - 6 > rac.x + 5 &&
        c.y + 6 < rac.y + rac.h &&
        c.y + c.h > rac.y + 5
      ) {
        if (catCtrl.takeDamage('هجوم راكون! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateFalcons(dt, timeSec) {
    if (!level.falcons) return;
    const c = catCtrl.cat;
    for (const falcon of level.falcons) {
      falcon.x += falcon.facing * Math.abs(falcon.vx) * dt;
      if (falcon.x <= falcon.minX) {
        falcon.x = falcon.minX;
        falcon.facing = 1;
      } else if (falcon.x >= falcon.maxX) {
        falcon.x = falcon.maxX;
        falcon.facing = -1;
      }
      falcon.y = falcon.baseY + Math.sin(timeSec * falcon.freq + falcon.minX * 0.01) * falcon.amp;
      if (
        c.x + 8 < falcon.x + falcon.w - 6 &&
        c.x + c.w - 8 > falcon.x + 6 &&
        c.y + 6 < falcon.y + falcon.h - 4 &&
        c.y + c.h > falcon.y + 6
      ) {
        if (catCtrl.takeDamage('انقضاض بومة! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateBats(dt, timeSec) {
    if (!level.bats) return;
    const c = catCtrl.cat;
    for (const bat of level.bats) {
      bat.x += bat.facing * Math.abs(bat.vx) * dt;
      if (bat.x <= bat.minX) {
        bat.x = bat.minX;
        bat.facing = 1;
      } else if (bat.x >= bat.maxX) {
        bat.x = bat.maxX;
        bat.facing = -1;
      }
      bat.y = bat.baseY + Math.sin(timeSec * bat.freq + bat.minX * 0.01) * bat.amp;
      if (
        c.x + 8 < bat.x + bat.w - 6 &&
        c.x + c.w - 8 > bat.x + 6 &&
        c.y + 6 < bat.y + bat.h - 4 &&
        c.y + c.h > bat.y + 6
      ) {
        if (catCtrl.takeDamage('خفاش النفق! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateDrones(dt, timeSec) {
    if (!level.drones) return;
    const c = catCtrl.cat;
    for (const d of level.drones) {
      d.x += d.facing * Math.abs(d.vx) * dt;
      if (d.x <= d.minX) {
        d.x = d.minX;
        d.facing = 1;
      } else if (d.x >= d.maxX) {
        d.x = d.maxX;
        d.facing = -1;
      }
      d.y = d.baseY + Math.sin(timeSec * (d.freq || 2.5) + d.minX * 0.01) * (d.amp || 14);
      if (
        c.x + 8 < d.x + d.w - 6 &&
        c.x + c.w - 8 > d.x + 6 &&
        c.y + 6 < d.y + d.h - 4 &&
        c.y + c.h > d.y + 6
      ) {
        if (catCtrl.takeDamage('طائرة المراقبة! -1 ❤️')) {
          updateHUD();
        }
      }
    }
  }

  function updateSteamVents(dt, timeSec) {
    if (!level.platforms) return;
    const c = catCtrl.cat;
    for (const p of level.platforms) {
      if (p.type === 'steam_vent') {
        const cycle = (timeSec + (p.phase || 0)) % 3.6;
        if (cycle >= 1.1 && cycle <= 2.9) {
          if (c.x + c.w > p.x - 6 && c.x < p.x + p.w + 6 && c.y + c.h <= p.y + 10 && c.y + c.h >= p.y - 210) {
            c.vy = Math.max(-520, Math.min(c.vy, -360) - 900 * dt);
            c.onGround = false;
          }
        }
      } else if (p.type === 'third_rail') {
        const cycle = (timeSec + (p.phase || 0)) % 3.4;
        if (cycle >= 1.9 && cycle <= 3.1) {
          if (
            c.x + 6 < p.x + p.w - 4 &&
            c.x + c.w - 6 > p.x + 4 &&
            c.y + c.h >= p.y - 8 &&
            c.y <= p.y + p.h
          ) {
            if (catCtrl.takeDamage('صعقة القطار الكهربائي! -1 ❤️')) {
              updateHUD();
            }
          }
        }
      } else if (p.type === 'welding_spark') {
        const cycle = (timeSec + (p.phase || 0)) % 3.2;
        if (cycle >= 1.7 && cycle <= 2.9) {
          if (
            c.x + 6 < p.x + p.w - 4 &&
            c.x + c.w - 6 > p.x + 4 &&
            c.y + c.h >= p.y - 16 &&
            c.y <= p.y + p.h
          ) {
            if (catCtrl.takeDamage('شرارة لحام كهربائية! -1 ❤️')) {
              updateHUD();
            }
          }
        }
      }
    }
  }

  function updateInteractions() {
    const c = catCtrl.cat;

    for (const p of level.puddles) {
      if (
        c.x + 8 < p.x + p.w &&
        c.x + c.w - 8 > p.x &&
        c.y + c.h > p.y &&
        c.y < p.y + p.h
      ) {
        Audio.playSplash();
        Particles.spawnSplash(c.x + c.w / 2, p.y);
        if (catCtrl.takeDamage('ماء عميق! -1 ❤️')) {
          updateHUD();
        }
      }
    }

    if (c.y > level.height + 60) {
      if (catCtrl.takeDamage('سقوط! -1 ❤️')) {
        updateHUD();
      }
    }

    for (const cp of level.checkpoints) {
      if (!cp.activated && Math.abs(c.x - cp.x) < 42 && Math.abs(c.y - cp.y) < 48) {
        cp.activated = true;
        c.checkpointX = cp.x;
        c.checkpointY = cp.y - 10;
        Audio.playPurr();
        Particles.spawnHeart(cp.x + 18, cp.y - 16);
        Particles.spawnPopup(cp.x + 18, cp.y - 38, 'نقطة حفظ ✓', '#8cffc7');
      }
    }

    for (const t of level.treats) {
      if (t.collected) continue;
      if (t.hiddenInDay && !c.nightVision) continue;
      if (Math.hypot(c.x + c.w / 2 - t.x, c.y + c.h / 2 - t.y) < 32) {
        t.collected = true;
        collectedTreats++;
        Audio.playTreat();
        Particles.spawnPopup(t.x, t.y - 14, '+1 🐟', '#ffd36e');
        updateHUD();
      }
    }

    if (c.lives <= 0) {
      finishStage(false);
      return;
    }

    const g = level.goal;
    if (
      c.x + c.w > g.x &&
      c.x < g.x + g.w &&
      c.y + c.h > g.y &&
      c.y < g.y + g.h
    ) {
      finishStage(true);
    }
  }

  function finishStage(won) {
    running = false;
    clearAllInputs();
    if (touchControls) touchControls.classList.add('hidden');
    Audio.setChaseMode(false);
    if (won && currentStage >= maxUnlockedStage && currentStage < 8) {
      maxUnlockedStage = currentStage + 1;
      try {
        localStorage.setItem(STORAGE_KEY, String(maxUnlockedStage));
      } catch (e) {}
      syncStageButtons();
    }
    endOverlay.classList.remove('hidden');
    if (won && currentStage === 1) {
      btnNextStage.classList.remove('hidden');
      btnNextStage.textContent = 'الانتقال إلى المرحلة 2 ▶';
      endBadge.textContent = 'STAGE 1 COMPLETE • المرحلة الأولى مكتملة';
      endTitle.textContent = 'وصلتِ إلى بوابة السوق! 🎉';
      endStats.innerHTML =
        `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
        `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
        `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
    } else if (won && currentStage === 2) {
      btnNextStage.classList.remove('hidden');
      btnNextStage.textContent = 'الانتقال إلى المرحلة 3 ▶';
      endBadge.textContent = 'STAGE 2 COMPLETE • المرحلة الثانية مكتملة';
      endTitle.textContent = 'عبرتِ السوق الشعبي إلى الحديقة! 🏆';
      endStats.innerHTML =
        `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
        `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
        `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
    } else if (won && currentStage === 3) {
      btnNextStage.classList.remove('hidden');
      btnNextStage.textContent = 'الانتقال إلى المرحلة 4 ▶';
      endBadge.textContent = 'STAGE 3 COMPLETE • الحديقة العامة مكتملة';
      endTitle.textContent = 'عبرتِ الحديقة الأولى! 🌳✨';
      endStats.innerHTML =
        `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
        `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
        `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
    } else if (won && currentStage === 4) {
      btnNextStage.classList.remove('hidden');
      btnNextStage.textContent = 'الانتقال إلى المرحلة 5 ▶';
      endBadge.textContent = 'STAGE 4 COMPLETE • أعماق الحديقة مكتملة';
      endTitle.textContent = 'وصلتِ إلى الميناء الليلي! ⚓✨';
      endStats.innerHTML =
        `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
        `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
        `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
    } else if (won && currentStage === 5) {
      btnNextStage.classList.remove('hidden');
      btnNextStage.textContent = 'الانتقال إلى المرحلة 6 ▶';
      endBadge.textContent = 'STAGE 5 COMPLETE • الميناء الليلي مكتمل';
      endTitle.textContent = 'عبرتِ الميناء نحو ناطحات السحاب! ⚓✨';
      endStats.innerHTML =
        `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
        `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
        `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
    } else if (won && currentStage === 6) {
      btnNextStage.classList.remove('hidden');
      btnNextStage.textContent = 'الانتقال إلى المرحلة 7 ▶';
      endBadge.textContent = 'STAGE 6 COMPLETE • أسطح المباني الشاهقة مكتملة';
      endTitle.textContent = 'هبطتِ نحو محطة القطارات والأنفاق! 🏙️✨';
      endStats.innerHTML =
        `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
        `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
        `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
    } else if (won && currentStage === 7) {
      btnNextStage.classList.remove('hidden');
      btnNextStage.textContent = 'الانتقال إلى المرحلة 8 ▶';
      endBadge.textContent = 'STAGE 7 COMPLETE • محطة الأنفاق مكتملة';
      endTitle.textContent = 'خرجتِ من المحطة نحو الورشة الأخيرة! 🚇✨';
      endStats.innerHTML =
        `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
        `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
        `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
    } else if (won && currentStage === 8) {
      // Play Win1.mp4 followed sequentially by Win2.mp4, then show Final Victory Overlay
      endOverlay.classList.add('hidden');
      hud.classList.add('hidden');
      if (controlsBar) controlsBar.classList.add('hidden');

      const showVictorySummary = () => {
        winVideo.pause();
        winLayer.classList.add('hidden');
        endOverlay.classList.remove('hidden');
        btnNextStage.classList.add('hidden');
        endBadge.textContent = 'STAGE 8 COMPLETE • نهاية رحلة العودة';
        endTitle.textContent = 'وصلتِ إلى شرفة المنزل وأكملتِ الرحلة! 🏠🏆';
        endStats.innerHTML =
          `الوقت: <strong>${elapsedTime.toFixed(1)} ثانية</strong> • ` +
          `الأرواح المتبقية: <strong>${catCtrl.cat.lives}/7</strong> • ` +
          `الأسماك المجمّعة: <strong>${collectedTreats}/3 🐟</strong>`;
      };

      const winPlaylist = ['videos/Win1.mp4', 'videos/Win2.mp4'];
      let winIdx = 0;
      const playNextWinClip = () => {
        if (winIdx >= winPlaylist.length) {
          showVictorySummary();
          return;
        }
        winVideo.src = winPlaylist[winIdx++];
        winLayer.classList.remove('hidden');
        winVideo.play().catch(showVictorySummary);
      };

      winVideo.onended = playNextWinClip;
      winVideo.onerror = showVictorySummary;
      if (btnSkipWin) btnSkipWin.onclick = showVictorySummary;
      playNextWinClip();
    } else {
      // Play game-over.mp4 and keep its last frame frozen as background with Restart button
      endOverlay.classList.add('hidden');
      hud.classList.add('hidden');
      if (controlsBar) controlsBar.classList.add('hidden');
      gameOverActions.classList.add('hidden');
      gameOverLayer.classList.remove('hidden');

      const showFallbackOverlay = () => {
        gameOverLayer.classList.add('hidden');
        endOverlay.classList.remove('hidden');
        btnNextStage.classList.add('hidden');
        endBadge.textContent = 'OUT OF LIVES';
        endTitle.textContent = 'نفدت أرواح مشمشة!';
        endStats.textContent = 'لا بأس، جرّب استخدام المواء (Q) لتشتيت الكلاب والرؤية الليلية (E) للمسارات الآمنة.';
      };

      if (gameOverVideo._btnTimer) clearTimeout(gameOverVideo._btnTimer);
      gameOverVideo._btnTimer = setTimeout(() => {
        if (!gameOverLayer.classList.contains('hidden')) {
          gameOverActions.classList.remove('hidden');
        }
      }, 1800);

      gameOverVideo.onended = () => {
        gameOverVideo.pause();
        gameOverActions.classList.remove('hidden');
      };
      gameOverVideo.onerror = showFallbackOverlay;
      gameOverVideo.currentTime = 0;
      gameOverVideo.play().catch(showFallbackOverlay);
    }
  }

  function drawCanvasIntro(t) {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#2a1d42');
    sky.addColorStop(0.55, '#7e3b56');
    sky.addColorStop(1, '#f39856');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#4c2c2b';
    ctx.fillRect(420, 60, 440, 660);
    ctx.fillStyle = '#2d1c1e';
    ctx.fillRect(460, 120, 120, 140);
    ctx.fillStyle = 'rgba(255, 220, 130, 0.7)';
    ctx.fillRect(475, 135, 90, 110);

    ctx.strokeStyle = '#181a24';
    ctx.lineWidth = 4;
    ctx.strokeRect(430, 220, 190, 50);

    const progress = Math.min(1, t / 4.2);
    const fallY = progress < 0.3 ? 190 : 190 + Math.pow((progress - 0.3) / 0.7, 1.5) * 390;
    const fallX = 530 + Math.sin(t * 6) * (progress > 0.3 ? 18 : 0);

    if (progress < 0.35) {
      ctx.font = '26px sans-serif';
      ctx.fillText('🦋', 590 + Math.sin(t * 7) * 12, 165 + Math.cos(t * 5) * 8);
    }

    ctx.fillStyle = '#8b5e34';
    ctx.fillRect(495, 575, 85, 65);

    catCtrl.cat.x = fallX;
    catCtrl.cat.y = fallY;
    catCtrl.cat.vy = progress > 0.3 ? 500 : 0;
    catCtrl.cat.onGround = false;
    catCtrl.draw(ctx, 0, 0);

    if (t > 3.5) {
      ctx.fillStyle = 'rgba(10, 14, 24, 0.72)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6ce5ff';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LIVES METER: 6/7', canvas.width / 2, 290);
      ctx.fillStyle = '#ffd36e';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText('Dr. MAX MOUSA', canvas.width / 2, 355);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px sans-serif';
      ctx.fillText('THE WAY HOME: 7 LIVES', canvas.width / 2, 400);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('اضغط Space للتخطي ⏭', canvas.width - 24, canvas.height - 22);
  }

  function updateMovingPlatforms(timeSec) {
    const c = catCtrl.cat;
    for (const p of level.platforms) {
      if (!p.moving) continue;
      const nextX = p.moveRange ? p.baseX + Math.sin(timeSec * p.moveSpeed) * p.moveRange : p.x;
      const nextY = p.swing
        ? p.baseY + (1 - Math.cos(timeSec * p.moveSpeed)) * 22
        : p.moveYRange
        ? p.baseY + Math.sin(timeSec * p.moveSpeed) * p.moveYRange
        : p.y;
      p.dx = nextX - p.x;
      p.dy = nextY - p.y;
      const carrying =
        c.onGround &&
        c.x + c.w > p.x + 4 &&
        c.x < p.x + p.w - 4 &&
        Math.abs(c.y + c.h - p.y) <= 8;
      p.x = nextX;
      p.y = nextY;
      if (carrying) {
        c.x += p.dx;
        c.y += p.dy;
      }
    }
  }

  function drawBackground(time) {
    if (level.theme === 'construction') {
      Art.drawConstructionSkyAndHorizon(ctx, camX, canvas.width, canvas.height, time);
      Art.drawConstructionMidground(ctx, camX, canvas.width, canvas.height, time);
    } else if (level.theme === 'subway') {
      Art.drawSubwaySkyAndHorizon(ctx, camX, canvas.width, canvas.height, time);
      Art.drawSubwayMidground(ctx, camX, canvas.width, canvas.height, time);
    } else if (level.theme === 'rooftop') {
      Art.drawRooftopSkyAndHorizon(ctx, camX, canvas.width, canvas.height, time);
      Art.drawRooftopMidground(ctx, camX, canvas.width, canvas.height, time);
    } else if (level.theme === 'harbor') {
      Art.drawHarborSkyAndSea(ctx, camX, canvas.width, canvas.height, time);
      Art.drawHarborMidground(ctx, camX, canvas.width, canvas.height, time);
    } else if (level.theme === 'park') {
      Art.drawParkSkyAndHorizon(ctx, camX, canvas.width, canvas.height, time);
      Art.drawParkMidground(ctx, camX, canvas.width, canvas.height, time);
    } else {
      Art.drawSkyAndFarCity(ctx, camX, canvas.width, canvas.height, time);
      if (level.theme === 'market') {
        Art.drawMarketMidgroundBuildings(ctx, camX, canvas.width, canvas.height, time);
        Art.drawMarketFestoonLanterns(ctx, camX, canvas.width, time);
      } else {
        Art.drawMidgroundCityBuildings(ctx, camX, canvas.width, canvas.height, time);
      }
    }
    Art.drawStreetlamps(ctx, level.lamps, camX, time);

    // Floating dust motes
    ctx.fillStyle = 'rgba(255, 226, 170, 0.28)';
    for (let i = 0; i < 24; i++) {
      const dx = (i * 197 + time * 18) % canvas.width;
      const dy = (i * 89 + Math.sin(time + i) * 25) % 600;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    if (dimBackground) {
      ctx.save();
      ctx.fillStyle = 'rgba(6, 9, 18, 0.68)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }

  function drawLevel(time) {
    const nv = catCtrl.cat.nightVision;

    for (const p of level.platforms) {
      if (p.hiddenInDay && !nv) continue;
      if (p.bounceAnim && p.bounceAnim > 0) p.bounceAnim = Math.max(0, p.bounceAnim - 0.08);
      const px = p.x - camX;
      const py = p.y - camY + (p.bounceAnim ? Math.sin(p.bounceAnim * Math.PI) * 6 : 0);
      if (px + p.w < -40 || px > canvas.width + 40) continue;
      Art.drawPlatform(ctx, p, px, py, nv, time);
    }

    // Crashed cardboard box scene only at Stage 1 start
    if (currentStage === 1) {
      Art.drawStartCardboardScene(ctx, camX, camY);
    }

    // Deep water puddles with shimmer
    for (const p of level.puddles) {
      Art.drawPuddle(ctx, p.x - camX, p.y - camY, p.w, p.h, time, level.theme === 'harbor');
    }

    // Checkpoints (Cozy Cat Houses)
    for (const cp of level.checkpoints) {
      Art.drawCheckpoint(ctx, cp, cp.x - camX, cp.y - camY, time);
    }

    // Treats (Fish) with golden glow
    for (const t of level.treats) {
      if (t.collected) continue;
      if (t.hiddenInDay && !nv) continue;
      const tx = t.x - camX;
      const ty = t.y - camY + Math.sin(time * 4 + t.x) * 5;
      const glow = ctx.createRadialGradient(tx, ty, 2, tx, ty, 22);
      glow.addColorStop(0, 'rgba(255, 211, 110, 0.45)');
      glow.addColorStop(1, 'rgba(255, 211, 110, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(tx, ty, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐟', tx, ty + 8);
    }

    // Stray Dogs
    for (const dog of level.dogs) {
      const dx = dog.x - camX;
      const dy = dog.y - camY;
      if (dx < -100 || dx > canvas.width + 100) continue;
      Art.drawDog(ctx, dog, dx, dy, nv, time);
    }

    // Spiky Hedgehogs
    if (level.hedgehogs) {
      for (const hog of level.hedgehogs) {
        const hx = hog.x - camX;
        const hy = hog.y - camY;
        if (hx < -80 || hx > canvas.width + 80) continue;
        Art.drawHedgehog(ctx, hog, hx, hy, time);
      }
    }

    // Swooping Night Crows
    if (level.crows) {
      for (const crow of level.crows) {
        const cx = crow.x - camX;
        const cy = crow.y - camY;
        if (cx < -80 || cx > canvas.width + 80) continue;
        Art.drawCrow(ctx, crow, cx, cy, time);
      }
    }

    // Harbor Crabs
    if (level.crabs) {
      for (const crab of level.crabs) {
        const cx = crab.x - camX;
        const cy = crab.y - camY;
        if (cx < -80 || cx > canvas.width + 80) continue;
        Art.drawCrab(ctx, crab, cx, cy, time);
      }
    }

    // Swooping Seagulls
    if (level.seagulls) {
      for (const gull of level.seagulls) {
        const gx = gull.x - camX;
        const gy = gull.y - camY;
        if (gx < -80 || gx > canvas.width + 80) continue;
        Art.drawSeagull(ctx, gull, gx, gy, time);
      }
    }

    // Fast Harbor & Rooftop Rats
    if (level.rats) {
      for (const rat of level.rats) {
        const rx = rat.x - camX;
        const ry = rat.y - camY;
        if (rx < -80 || rx > canvas.width + 80) continue;
        Art.drawRat(ctx, rat, rx, ry, time);
      }
    }

    // Rooftop Raccoons
    if (level.raccoons) {
      for (const rac of level.raccoons) {
        const rx = rac.x - camX;
        const ry = rac.y - camY;
        if (rx < -80 || rx > canvas.width + 80) continue;
        Art.drawRaccoon(ctx, rac, rx, ry, time);
      }
    }

    // Rooftop Peregrine Falcons / Night Owls
    if (level.falcons) {
      for (const falcon of level.falcons) {
        const fx = falcon.x - camX;
        const fy = falcon.y - camY;
        if (fx < -80 || fx > canvas.width + 80) continue;
        Art.drawFalcon(ctx, falcon, fx, fy, time);
      }
    }

    // Subway Tunnel Bats
    if (level.bats) {
      for (const bat of level.bats) {
        const bx = bat.x - camX;
        const by = bat.y - camY;
        if (bx < -80 || bx > canvas.width + 80) continue;
        Art.drawBat(ctx, bat, bx, by, time);
      }
    }

    // Construction Site Security Drones
    if (level.drones) {
      for (const drone of level.drones) {
        const dx = drone.x - camX;
        const dy = drone.y - camY;
        if (dx < -80 || dx > canvas.width + 80) continue;
        Art.drawDrone(ctx, drone, dx, dy, time);
      }
    }

    // Exit Gate
    const g = level.goal;
    Art.drawMarketGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
  }

  function drawNightVisionOverlay() {
    if (!catCtrl.cat.nightVision) return;
    ctx.save();
    ctx.fillStyle = 'rgba(20, 95, 58, 0.22)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(74, 242, 161, 0.04)';
    for (let y = 0; y < canvas.height; y += 6) {
      ctx.fillRect(0, y, canvas.width, 2);
    }
    ctx.restore();
  }

  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min(0.033, (timestamp - lastTime) / 1000);
    lastTime = timestamp;
    const timeSec = timestamp / 1000;

    if (playingCanvasIntro) {
      canvasIntroTimer += dt;
      drawCanvasIntro(canvasIntroTimer);
      if (canvasIntroTimer > 5.5) {
        catCtrl.cat.x = level.startX;
        catCtrl.cat.y = level.startY;
        catCtrl.cat.vy = 0;
        enterGameplay();
      }
      requestAnimationFrame(loop);
      return;
    }

    if (running) {
      elapsedTime += dt;
      updateMovingPlatforms(timeSec);
      catCtrl.update(dt, input, level);
      input.jumpPressed = false;
      updateDogs(dt);
      updateHedgehogs(dt);
      updateCrows(dt, timeSec);
      updateCrabs(dt);
      updateSeagulls(dt, timeSec);
      updateRats(dt);
      updateRaccoons(dt);
      updateFalcons(dt, timeSec);
      updateBats(dt, timeSec);
      updateDrones(dt, timeSec);
      updateSteamVents(dt, timeSec);
      updateInteractions();
      Particles.update(dt);

      const targetCamX = Math.max(
        0,
        Math.min(level.width - canvas.width, catCtrl.cat.x - canvas.width * 0.38)
      );
      camX += (targetCamX - camX) * Math.min(1, dt * 7);
      updateHUD();
    }

    drawBackground(timeSec);
    drawLevel(timeSec);
    catCtrl.draw(ctx, camX, camY);
    Particles.draw(ctx, camX, camY);
    drawNightVisionOverlay();

    requestAnimationFrame(loop);
  }

  // Input listeners
  window.addEventListener('keydown', (e) => {
    if (playingCanvasIntro && (e.code === 'Space' || e.code === 'Enter')) {
      catCtrl.cat.x = level.startX;
      catCtrl.cat.y = level.startY;
      catCtrl.cat.vy = 0;
      enterGameplay();
      return;
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = true;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.shift = true;

    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      if (!input.jumpHeld) input.jumpPressed = true;
      input.jumpHeld = true;
      e.preventDefault();
    }

    if (e.code === 'KeyE' || e.code === 'KeyN') {
      if (catCtrl && running) {
        catCtrl.cat.nightVision = !catCtrl.cat.nightVision;
        Audio.playNightVision(catCtrl.cat.nightVision);
        updateHUD();
      }
    }

    if (e.code === 'KeyQ' || e.code === 'KeyF') {
      triggerMeow();
    }

    if (e.code === 'KeyR' && running) {
      initLevel();
    }

    if (e.code === 'Tab') {
      e.preventDefault();
      guidePanel.classList.toggle('hidden');
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.shift = false;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') input.jumpHeld = false;
  });

  btnStartGame.addEventListener('click', () => {
    initLevel(1);
    startIntroSequence();
  });

  for (let s = 2; s <= 8; s++) {
    const btn = stageButtons[s];
    if (!btn) continue;
    btn.addEventListener('click', () => {
      if (s > maxUnlockedStage) return;
      startOverlay.classList.add('hidden');
      initLevel(s);
      enterGameplay();
    });
  }

  btnNextStage.addEventListener('click', () => {
    endOverlay.classList.add('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    clearAllInputs();
    const nextStage = currentStage < 8 ? currentStage + 1 : 8;
    initLevel(nextStage);
    running = true;
    const msg =
      nextStage === 2
        ? 'المرحلة 2: السوق 🏮'
        : nextStage === 3
        ? 'المرحلة 3: الحديقة 🌳'
        : nextStage === 4
        ? 'المرحلة 4: أعماق الحديقة 🌲'
        : nextStage === 5
        ? 'المرحلة 5: الميناء ⚓'
        : nextStage === 6
        ? 'المرحلة 6: الأسطح 🏙️'
        : nextStage === 7
        ? 'المرحلة 7: محطة الأنفاق 🚇'
        : 'المرحلة 8: الورشة (النهاية) 🏗️';
    Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, msg, '#ffd36e');
  });

  function restartCurrentStage() {
    endOverlay.classList.add('hidden');
    gameOverVideo.pause();
    gameOverLayer.classList.add('hidden');
    gameOverActions.classList.add('hidden');
    if (winVideo) winVideo.pause();
    if (winLayer) winLayer.classList.add('hidden');
    hud.classList.remove('hidden');
    if (controlsBar) controlsBar.classList.remove('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    clearAllInputs();
    initLevel(currentStage);
    running = true;
  }

  function returnToMainMenu() {
    running = false;
    playingCanvasIntro = false;
    clearAllInputs();
    Audio.setChaseMode(false);
    if (introVideo) introVideo.pause();
    if (introLayer) introLayer.classList.add('hidden');
    if (introHud) introHud.classList.add('hidden');
    if (gameOverVideo) {
      if (gameOverVideo._btnTimer) clearTimeout(gameOverVideo._btnTimer);
      gameOverVideo.pause();
    }
    if (gameOverLayer) gameOverLayer.classList.add('hidden');
    if (gameOverActions) gameOverActions.classList.add('hidden');
    if (winVideo) winVideo.pause();
    if (winLayer) winLayer.classList.add('hidden');
    if (guidePanel) guidePanel.classList.add('hidden');
    if (exitConfirmOverlay) exitConfirmOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    hud.classList.add('hidden');
    if (controlsBar) controlsBar.classList.add('hidden');
    if (touchControls) touchControls.classList.add('hidden');
    syncStageButtons();
    startOverlay.classList.remove('hidden');
  }

  function openExitConfirm() {
    if (!running || !exitConfirmOverlay) return;
    running = false;
    clearAllInputs();
    if (touchControls) touchControls.classList.add('hidden');
    Audio.setChaseMode(false);
    exitConfirmOverlay.classList.remove('hidden');
  }

  function cancelExitConfirm() {
    if (!exitConfirmOverlay) return;
    exitConfirmOverlay.classList.add('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    running = true;
  }

  function toggleNightVision() {
    if (!catCtrl || !running) return;
    catCtrl.cat.nightVision = !catCtrl.cat.nightVision;
    Audio.playNightVision(catCtrl.cat.nightVision);
    const nvBtn = document.querySelector('.touch-skill[data-action="nightvision"]');
    if (nvBtn) nvBtn.classList.toggle('active', catCtrl.cat.nightVision);
    updateHUD();
  }

  // Multi-Touch Pointer Controls
  if (touchControls) {
    const activeHoldPointers = new Map(); // pointerId -> { action, btn }
    const syncHeld = () => {
      let l = false, r = false, d = false, j = false;
      for (const item of activeHoldPointers.values()) {
        if (item.action === 'left') l = true;
        if (item.action === 'right') r = true;
        if (item.action === 'down') d = true;
        if (item.action === 'jump') j = true;
      }
      input.left = l;
      input.right = r;
      input.down = d;
      input.jumpHeld = j;
    };

    touchControls.querySelectorAll('.touch-btn').forEach((btn) => {
      const action = btn.getAttribute('data-action');
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();Audio.ensureCtx();
        if (action === 'meow') {
          btn.classList.add('pressed');
          triggerMeow();
          return;
        }
        if (action === 'nightvision') {
          btn.classList.add('pressed');
          toggleNightVision();
          return;
        }
        try { btn.setPointerCapture(e.pointerId); } catch (err) {}
        if (action === 'jump' && !input.jumpHeld) input.jumpPressed = true;
        activeHoldPointers.set(e.pointerId, { action, btn });
        btn.classList.add('pressed');
        syncHeld();
      });
      const releasePointer = (e) => {
        btn.classList.remove('pressed');
        if (activeHoldPointers.has(e.pointerId)) {
          activeHoldPointers.delete(e.pointerId);
          syncHeld();
        }
      };
      btn.addEventListener('pointerup', releasePointer);
      btn.addEventListener('pointercancel', releasePointer);
    });
  }

  if (skillNightVision) skillNightVision.addEventListener('click', toggleNightVision);
  if (skillMeow) skillMeow.addEventListener('click', triggerMeow);
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      const el = document.documentElement;
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  canvas.addEventListener('pointerdown', () => {
    if (playingCanvasIntro) {
      catCtrl.cat.x = level.startX;
      catCtrl.cat.y = level.startY;
      catCtrl.cat.vy = 0;
      enterGameplay();
    }
  });

  if (btnMainMenu) btnMainMenu.addEventListener('click', openExitConfirm);
  if (btnConfirmExit) btnConfirmExit.addEventListener('click', returnToMainMenu);
  if (btnCancelExit) btnCancelExit.addEventListener('click', cancelExitConfirm);
  if (btnGameOverMenu) btnGameOverMenu.addEventListener('click', returnToMainMenu);
  if (btnEndMenu) btnEndMenu.addEventListener('click', returnToMainMenu);

  btnRestartStage.addEventListener('click', restartCurrentStage);
  btnGameOverRestart.addEventListener('click', restartCurrentStage);

  function toggleDimBackground() {
    dimBackground = !dimBackground;
    try {
      localStorage.setItem(DIM_BG_KEY, dimBackground ? '1' : '0');
    } catch (e) {}
    if (btnDimBg) btnDimBg.classList.toggle('active', dimBackground);
  }

  if (btnDimBg) btnDimBg.addEventListener('click', toggleDimBackground);

  btnGuide.addEventListener('click', () => guidePanel.classList.toggle('hidden'));
  btnCloseGuide.addEventListener('click', () => guidePanel.classList.add('hidden'));

  btnMusic.addEventListener('click', () => {
    const isMusicMuted = Audio.toggleMusicMute();
    btnMusic.classList.toggle('muted', isMusicMuted);
  });

  btnAudio.addEventListener('click', () => {
    const isSfxMuted = Audio.toggleSfxMute();
    btnAudio.textContent = isSfxMuted ? '🔇' : '🔊';
    btnAudio.classList.toggle('muted', isSfxMuted);
  });

  syncStageButtons();
  initLevel();
  requestAnimationFrame(loop);
})();
