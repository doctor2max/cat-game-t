window.Game = window.Game || {};

(function () {
  const canvas = document.getElementById('gameCanvas');
  const LOGICAL_W = 1280;
  const LOGICAL_H = 720;
  const RENDER_SCALE = 0.85; // Crisp Retina look while maintaining locked 60fps on mobile GPUs
  canvas.width = Math.round(LOGICAL_W * RENDER_SCALE);
  canvas.height = Math.round(LOGICAL_H * RENDER_SCALE);
  const ctx = canvas.getContext('2d', { alpha: false });
  try {
    // Disable expensive Canvas 2D Gaussian shadowBlur on mobile GPUs
    Object.defineProperty(ctx, 'shadowBlur', {
      get() { return 0; },
      set() {},
      configurable: true,
    });
  } catch (e) {}

  const Store = window.Game.Store;
  const Audio = window.Game.Audio;
  const Particles = window.Game.Particles;
  const Art = window.Game.Art;
  const EnemiesExt = window.Game.EnemiesExtended;
  const TOTAL_STAGES = Store.TOTAL_STAGES;

  // UI Elements
  const introLayer = document.getElementById('introLayer');
  const introHud = document.getElementById('introHud');
  const introVideo = document.getElementById('introVideo');
  const btnSkipIntro = document.getElementById('btnSkipIntro');

  const gameOverLayer = document.getElementById('gameOverLayer');
  const gameOverVideo = document.getElementById('gameOverVideo');
  const gameOverActions = document.getElementById('gameOverActions');
  const btnGameOverRevive = document.getElementById('btnGameOverRevive');
  const btnGameOverRestart = document.getElementById('btnGameOverRestart');
  const btnGameOverMenu = document.getElementById('btnGameOverMenu');

  const winLayer = document.getElementById('winLayer');
  const winVideo = document.getElementById('winVideo');
  const btnSkipWin = document.getElementById('btnSkipWin');

  const hud = document.getElementById('hud');
  const touchControls = document.getElementById('touchControls');
  const startOverlay = document.getElementById('startOverlay');
  const levelGrid = document.getElementById('levelGrid');
  const btnQuickPlay = document.getElementById('btnQuickPlay');
  const menuCoinsCount = document.getElementById('menuCoinsCount');
  const menuStarsCount = document.getElementById('menuStarsCount');
  const btnMenuCoins = document.getElementById('btnMenuCoins');
  const btnOpenShop = document.getElementById('btnOpenShop');
  const shopBadgeDot = document.getElementById('shopBadgeDot');

  const livesBar = document.getElementById('livesBar');
  const livesCount = document.getElementById('livesCount');
  const shieldBadge = document.getElementById('shieldBadge');
  const treatsCount = document.getElementById('treatsCount');
  const hudCoinsCard = document.getElementById('hudCoinsCard');
  const hudCoinsCount = document.getElementById('hudCoinsCount');
  const stageBadge = document.getElementById('stageBadge');
  const skillNightVision = document.getElementById('skillNightVision');
  const skillMeow = document.getElementById('skillMeow');
  const btnPause = document.getElementById('btnPause');

  const pauseOverlay = document.getElementById('pauseOverlay');
  const pauseStageTag = document.getElementById('pauseStageTag');
  const btnResumeGame = document.getElementById('btnResumeGame');
  const btnPauseRefill = document.getElementById('btnPauseRefill');
  const btnPauseRestart = document.getElementById('btnPauseRestart');
  const btnPauseShop = document.getElementById('btnPauseShop');
  const btnPauseMenu = document.getElementById('btnPauseMenu');
  const btnDimBg = document.getElementById('btnDimBg');
  const btnMusic = document.getElementById('btnMusic');
  const btnAudio = document.getElementById('btnAudio');
  const btnGuide = document.getElementById('btnGuide');
  const guidePanel = document.getElementById('guidePanel');
  const btnCloseGuide = document.getElementById('btnCloseGuide');

  const shopOverlay = document.getElementById('shopOverlay');
  const shopCoinsCount = document.getElementById('shopCoinsCount');
  const shopContent = document.getElementById('shopContent');
  const btnCloseShop = document.getElementById('btnCloseShop');

  const endOverlay = document.getElementById('endOverlay');
  const endBadge = document.getElementById('endBadge');
  const endStarsRow = document.getElementById('endStarsRow');
  const endTitle = document.getElementById('endTitle');
  const endStats = document.getElementById('endStats');
  const btnNextStage = document.getElementById('btnNextStage');
  const btnEndShop = document.getElementById('btnEndShop');
  const btnRestartStage = document.getElementById('btnRestartStage');
  const btnEndMenu = document.getElementById('btnEndMenu');

  const toastBanner = document.getElementById('toastBanner');

  const DIM_BG_KEY = 'theWayHome_dimBg';
  let dimBackground = false;
  try {
    dimBackground = localStorage.getItem(DIM_BG_KEY) === '1';
  } catch (e) {}
  if (btnDimBg) btnDimBg.classList.toggle('active', dimBackground);

  // Ergonomic Touch Control Button Size (92%..118%, default 108%) & Opacity (45%..100%, default 88%)
  const CTRL_SIZE_KEY = 'theWayHome_ctrlSize';
  const CTRL_OPACITY_KEY = 'theWayHome_ctrlOpacity';
  const ctrlSizeSlider = document.getElementById('ctrlSizeSlider');
  const ctrlSizeVal = document.getElementById('ctrlSizeVal');
  const ctrlOpacitySlider = document.getElementById('ctrlOpacitySlider');
  const ctrlOpacityVal = document.getElementById('ctrlOpacityVal');

  let ctrlSizePct = 108;
  let ctrlOpacityPct = 88;
  try {
    const savedSize = parseInt(localStorage.getItem(CTRL_SIZE_KEY), 10);
    if (!isNaN(savedSize) && savedSize >= 92 && savedSize <= 118) ctrlSizePct = savedSize;
    const savedOp = parseInt(localStorage.getItem(CTRL_OPACITY_KEY), 10);
    if (!isNaN(savedOp) && savedOp >= 45 && savedOp <= 100) ctrlOpacityPct = savedOp;
  } catch (e) {}

  function applyTouchControlSettings() {
    if (touchControls) {
      touchControls.style.setProperty('--ctrl-scale', (ctrlSizePct / 100).toFixed(2));
      touchControls.style.setProperty('--ctrl-opacity', (ctrlOpacityPct / 100).toFixed(2));
    }
    if (ctrlSizeSlider) ctrlSizeSlider.value = String(ctrlSizePct);
    if (ctrlSizeVal) ctrlSizeVal.textContent = `${ctrlSizePct}%`;
    if (ctrlOpacitySlider) ctrlOpacitySlider.value = String(ctrlOpacityPct);
    if (ctrlOpacityVal) ctrlOpacityVal.textContent = `${ctrlOpacityPct}%`;
  }
  applyTouchControlSettings();

  if (ctrlSizeSlider) {
    ctrlSizeSlider.addEventListener('input', () => {
      ctrlSizePct = Math.max(92, Math.min(118, parseInt(ctrlSizeSlider.value, 10) || 108));
      applyTouchControlSettings();
      try {
        localStorage.setItem(CTRL_SIZE_KEY, String(ctrlSizePct));
      } catch (e) {}
    });
  }
  if (ctrlOpacitySlider) {
    ctrlOpacitySlider.addEventListener('input', () => {
      ctrlOpacityPct = Math.max(45, Math.min(100, parseInt(ctrlOpacitySlider.value, 10) || 88));
      applyTouchControlSettings();
      try {
        localStorage.setItem(CTRL_OPACITY_KEY, String(ctrlOpacityPct));
      } catch (e) {}
    });
  }

  // Cat Render Mode Toggle: 'sprite' (original PNG sheet) vs 'procedural' (articulated code vector cat)
  const CAT_MODE_KEY = 'theWayHome_catRenderMode';
  const catModeVal = document.getElementById('catModeVal');
  const btnCatModeSprite = document.getElementById('btnCatModeSprite');
  const btnCatModeProc = document.getElementById('btnCatModeProc');
  let catRenderMode = 'sprite';
  try {
    const savedCatMode = localStorage.getItem(CAT_MODE_KEY);
    if (savedCatMode === 'procedural' || savedCatMode === 'sprite') {
      catRenderMode = savedCatMode;
    }
  } catch (e) {}

  function applyCatRenderMode() {
    window.Game.catRenderMode = catRenderMode;
    const isProc = catRenderMode === 'procedural';
    if (btnCatModeSprite) btnCatModeSprite.classList.toggle('active', !isProc);
    if (btnCatModeProc) btnCatModeProc.classList.toggle('active', isProc);
    if (catModeVal) catModeVal.textContent = isProc ? 'رسم برمجي' : 'صورة أصلية';
  }
  applyCatRenderMode();

  function selectCatRenderMode(mode) {
    if (mode !== 'sprite' && mode !== 'procedural') return;
    catRenderMode = mode;
    applyCatRenderMode();
    Audio.playUiClick();
    haptic(8);
    try {
      localStorage.setItem(CAT_MODE_KEY, catRenderMode);
    } catch (e) {}
    showToast(mode === 'procedural' ? 'تم التبديل إلى الرسم البرمجي 🐱✨' : 'تم التبديل إلى الصورة الأصلية 🐱');
  }

  if (btnCatModeSprite) btnCatModeSprite.addEventListener('click', () => selectCatRenderMode('sprite'));
  if (btnCatModeProc) btnCatModeProc.addEventListener('click', () => selectCatRenderMode('procedural'));

  // Subtle mobile haptic helper
  function haptic(ms = 10) {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (e) {}
  }

  let toastTimer = null;
  function showToast(msg) {
    if (!toastBanner) return;
    toastBanner.textContent = msg;
    toastBanner.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastBanner.classList.add('hidden');
    }, 2200);
  }

  let currentStage = 1;
  let level = null;
  let catCtrl = null;
  let running = false;
  let paused = false;
  let playingCanvasIntro = false;
  let canvasIntroTimer = 0;
  let elapsedTime = 0;
  let collectedTreats = 0;
  let stageCoinsEarned = 0;
  let coinCombo = 0;
  let coinComboTimer = 0;
  let shakeTimer = 0;
  let camX = 0;
  let camY = 0;
  let lastTime = 0;
  let shopReturnTarget = 'menu'; // 'menu' | 'pause' | 'end'
  let activeShopTab = 'upgrades';

  const input = {
    left: false,
    right: false,
    down: false,
    shift: false,
    jumpHeld: false,
    jumpPressed: false,
  };

  function createLevelByNumber(num) {
    const fn = window.Game['createLevel' + num];
    if (typeof fn === 'function') return fn();
    return window.Game.createLevel1();
  }

  function hasShopNotification() {
    if (Store.canClaimDailyBonus()) return true;
    const coins = Store.getCoins();
    for (const u of Store.UPGRADES) {
      const cost = Store.getUpgradeCost(u.id);
      if (cost !== null && coins >= cost) return true;
    }
    return false;
  }

  function syncCoinDisplays(animateHud = false) {
    const coins = Store.getCoins();
    if (menuCoinsCount) menuCoinsCount.textContent = String(coins);
    if (hudCoinsCount) hudCoinsCount.textContent = String(coins);
    if (shopCoinsCount) shopCoinsCount.textContent = String(coins);
    if (menuStarsCount) menuStarsCount.textContent = `${Store.getTotalStars()}/${TOTAL_STAGES * 3}`;
    if (shopBadgeDot) shopBadgeDot.classList.toggle('hidden', !hasShopNotification());
    if (animateHud && hudCoinsCard) {
      hudCoinsCard.classList.remove('pop');
      void hudCoinsCard.offsetWidth;
      hudCoinsCard.classList.add('pop');
      setTimeout(() => hudCoinsCard.classList.remove('pop'), 180);
    }
  }

  // Render pure iPhone-style numbered square tiles (Numbers ONLY — no names or images)
  function renderLevelGrid() {
    if (!levelGrid) return;
    levelGrid.innerHTML = '';
    const maxUnlocked = Store.getMaxUnlockedStage();
    let nextPlayStage = maxUnlocked;
    for (let s = 1; s <= maxUnlocked; s++) {
      if (!Store.isStageCleared(s)) {
        nextPlayStage = s;
        break;
      }
    }

    for (let s = 1; s <= TOTAL_STAGES; s++) {
      const locked = s > maxUnlocked;
      const cleared = Store.isStageCleared(s);
      const isCurrent = s === nextPlayStage && !cleared;
      const stars = Store.getStageStars(s);

      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className =
        'level-tile ' +
        (locked ? 'locked' : isCurrent ? 'current' : cleared ? 'completed' : 'unlocked');
      tile.setAttribute('aria-label', `المرحلة ${s}`);

      const numSpan = document.createElement('span');
      numSpan.className = 'level-tile-num';
      numSpan.textContent = String(s);
      tile.appendChild(numSpan);

      if (locked) {
        const lockSpan = document.createElement('span');
        lockSpan.className = 'tile-lock-icon';
        lockSpan.textContent = '🔒';
        tile.appendChild(lockSpan);
      } else {
        const starsWrap = document.createElement('div');
        starsWrap.className = 'level-tile-stars';
        for (let i = 1; i <= 3; i++) {
          const st = document.createElement('span');
          st.className = 'tile-star' + (i <= stars ? ' earned' : '');
          st.textContent = '★';
          starsWrap.appendChild(st);
        }
        tile.appendChild(starsWrap);
      }

      tile.addEventListener('click', () => {
        Audio.ensureCtx();
        if (locked) {
          haptic(18);
          showToast('أكمل المرحلة السابقة أو افتحها من المتجر 🛒');
          return;
        }
        Audio.playUiClick();
        haptic(10);
        startStageFromMenu(s);
      });

      levelGrid.appendChild(tile);
    }

    if (btnQuickPlay) {
      btnQuickPlay.textContent = `العب المرحلة ${nextPlayStage} ▶`;
      btnQuickPlay.dataset.targetStage = String(nextPlayStage);
    }
    syncCoinDisplays();
  }

  function startStageFromMenu(stageNum) {
    startOverlay.classList.add('hidden');
    initLevel(stageNum);
    if (stageNum === 1 && !Store.isStageCleared(1)) {
      startIntroSequence();
    } else {
      enterGameplay();
    }
  }

  // Universal Checkpoint Safe Zone Enforcement (guarantees 100% of checkpoints in Stages 1-15 remain completely hazard-free!)
  function isInCheckpointSafeZone(lv, x, y, w = 48, h = 40) {
    if (!lv || !lv.checkpoints) return null;
    const cx = x + w / 2;
    const bottomY = y + h;
    for (const cp of lv.checkpoints) {
      const cpCx = cp.x + 18;
      const cpBottom = cp.y + 32;
      if (Math.abs(bottomY - cpBottom) < 75 && Math.abs(cx - cpCx) < 96) {
        return cp;
      }
    }
    return null;
  }

  function enforceCheckpointSafeZones(lv) {
    if (!lv || !lv.checkpoints) return;
    const patrolLists = [
      lv.dogs, lv.hedgehogs, lv.crabs, lv.rats, lv.raccoons, lv.porcupines,
      lv.security_bots, lv.foxes, lv.clockwork_beetles, lv.skunks,
      lv.badgers, lv.bridge_rovers, lv.dobermans, lv.rival_cats, lv.hover_saws,
      lv.crows, lv.pigeons, lv.seagulls, lv.bats, lv.owls, lv.pelicans, lv.hawks, lv.drones, lv.bees,
    ];
    for (const list of patrolLists) {
      if (!list) continue;
      for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i];
        if (e.minX === undefined || e.maxX === undefined) continue;
        const ew = e.w || 48;
        const eh = e.h || 40;
        const baseEy = e.baseY !== undefined ? e.baseY : e.y;
        const maxSwoop = e.amp || e.dip || 0;
        for (const cp of lv.checkpoints) {
          const cpCx = cp.x + 18;
          const cpBottom = cp.y + 32;
          const lowBottom = baseEy + maxSwoop + eh;
          const highTop = baseEy - maxSwoop;
          if (lowBottom < cp.y - 68 || highTop > cpBottom + 48) continue;
          const safeLeft = cpCx - 98 - ew;
          const safeRight = cpCx + 98;
          if (e.maxX > safeLeft && e.minX < safeRight) {
            const leftRoom = safeLeft - e.minX;
            const rightRoom = e.maxX - safeRight;
            if (rightRoom >= leftRoom) {
              e.minX = Math.max(e.minX, safeRight);
            } else {
              e.maxX = Math.min(e.maxX, safeLeft);
            }
            // If remaining patrol span is too narrow (< 45px), remove the enemy so it never glitches/vibrates!
            if (e.maxX - e.minX < 45) {
              list.splice(i, 1);
              break;
            }
            if (e.x < e.minX) e.x = e.minX;
            if (e.x > e.maxX) e.x = e.maxX;
          }
        }
      }
    }
  }

  function initLevel(stageNum) {
    if (typeof stageNum === 'number') currentStage = stageNum;
    level = createLevelByNumber(currentStage);
    enforceCheckpointSafeZones(level);
    Store.ensureLevelCoins(level, currentStage);
    stageBadge.textContent = String(currentStage);
    if (pauseStageTag) pauseStageTag.textContent = `المرحلة ${currentStage}`;
    Audio.setMusicTrack(level.theme);

    catCtrl = window.Game.Cat(level.startX, level.startY);
    catCtrl.applyUpgrades(Store.getBonuses(), false);

    Particles.clear();
    elapsedTime = 0;
    collectedTreats = 0;
    stageCoinsEarned = 0;
    coinCombo = 0;
    coinComboTimer = 0;
    shakeTimer = 0;
    paused = false;
    camX = 0;
    camY = 0;

    // Reset touch button visuals
    const nvBtn = document.querySelector('.touch-skill[data-action="nightvision"]');
    if (nvBtn) nvBtn.classList.remove('active');
    const meowBtn = document.querySelector('.touch-skill[data-action="meow"]');
    if (meowBtn) meowBtn.classList.remove('cooldown');

    hudState.lives = -1;
    hudState.maxLives = -1;
    hudState.treats = -1;
    hudState.nv = null;
    hudState.meowCd = null;
    hudState.shield = null;
    updateHUD();
    syncCoinDisplays();
  }

  const hudState = { lives: -1, maxLives: -1, treats: -1, nv: null, meowCd: null, shield: null };
  let lifeSegs = [];

  function updateHUD() {
    if (!catCtrl) return;
    const c = catCtrl.cat;
    if (hudState.maxLives !== c.maxLives) {
      hudState.maxLives = c.maxLives;
      livesBar.innerHTML = '';
      lifeSegs = [];
      for (let i = 0; i < c.maxLives; i++) {
        const seg = document.createElement('div');
        seg.className = 'life-seg';
        livesBar.appendChild(seg);
        lifeSegs.push(seg);
      }
      hudState.lives = -1;
    }
    if (hudState.lives !== c.lives) {
      hudState.lives = c.lives;
      livesCount.textContent = `${c.lives}/${c.maxLives}`;
      for (let i = 0; i < lifeSegs.length; i++) {
        lifeSegs[i].classList.toggle('active', i < c.lives);
      }
    }
    if (hudState.shield !== c.shieldActive) {
      hudState.shield = c.shieldActive;
      if (shieldBadge) shieldBadge.classList.toggle('hidden', !c.shieldActive);
    }
    if (hudState.treats !== collectedTreats) {
      hudState.treats = collectedTreats;
      treatsCount.textContent = `${collectedTreats}/3`;
    }
    if (hudState.nv !== c.nightVision) {
      hudState.nv = c.nightVision;
      if (skillNightVision) skillNightVision.classList.toggle('active', c.nightVision);
      const nvBtn = document.querySelector('.touch-skill[data-action="nightvision"]');
      if (nvBtn) nvBtn.classList.toggle('active', c.nightVision);
    }
    const isMeowCd = c.meowCooldown > 0;
    if (hudState.meowCd !== isMeowCd) {
      hudState.meowCd = isMeowCd;
      if (skillMeow) skillMeow.classList.toggle('cooldown', isMeowCd);
      const meowBtn = document.querySelector('.touch-skill[data-action="meow"]');
      if (meowBtn) meowBtn.classList.toggle('cooldown', isMeowCd);
    }
  }

  function clearAllInputs() {
    input.left = false;
    input.right = false;
    input.down = false;
    input.shift = false;
    input.jumpHeld = false;
    input.jumpPressed = false;
    if (touchControls) {
      touchControls.querySelectorAll('.touch-btn.pressed').forEach((b) => b.classList.remove('pressed'));
    }
  }

  // =========================================================================
  // PAUSE SYSTEM
  // =========================================================================
  function openPauseMenu() {
    if (!running || paused) return;
    paused = true;
    running = false;
    clearAllInputs();
    Audio.setChaseMode(false);
    Audio.pauseMusic();
    Audio.playUiClick();
    if (touchControls) touchControls.classList.add('hidden');
    if (pauseStageTag) pauseStageTag.textContent = `المرحلة ${currentStage}`;

    // Show life refill option if missing lives
    if (btnPauseRefill && catCtrl) {
      const needsLives = catCtrl.cat.lives < catCtrl.cat.maxLives;
      btnPauseRefill.classList.toggle('hidden', !needsLives);
      btnPauseRefill.disabled = Store.getCoins() < Store.LIFE_REFILL_COST;
    }

    syncToggleButtons();
    pauseOverlay.classList.remove('hidden');
  }

  function resumeFromPause() {
    if (!paused) return;
    paused = false;
    pauseOverlay.classList.add('hidden');
    if (guidePanel) guidePanel.classList.add('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    Audio.playUiClick();
    Audio.resumeMusic();
    lastTime = 0;
    running = true;
  }

  function syncToggleButtons() {
    if (btnDimBg) btnDimBg.classList.toggle('active', dimBackground);
    if (btnMusic) btnMusic.classList.toggle('muted', Audio.isMusicMuted());
    if (btnAudio) {
      const muted = Audio.isSfxMuted();
      btnAudio.classList.toggle('muted', muted);
      const icon = btnAudio.querySelector('span');
      if (icon) icon.textContent = muted ? '🔇' : '🔊';
    }
  }

  // Auto-pause if mobile app / tab is backgrounded
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running && !paused) {
      openPauseMenu();
    }
  });

  // =========================================================================
  // iOS SHOP SYSTEM
  // =========================================================================
  function openShop(from) {
    shopReturnTarget = from;
    Audio.playUiClick();
    if (from === 'menu') startOverlay.classList.add('hidden');
    if (from === 'pause') pauseOverlay.classList.add('hidden');
    if (from === 'end') endOverlay.classList.add('hidden');
    renderShopContent();
    shopOverlay.classList.remove('hidden');
  }

  function closeShop() {
    Audio.playUiClick();
    shopOverlay.classList.add('hidden');
    // Live-apply any purchased upgrades/skins if mid-game!
    if (catCtrl) {
      catCtrl.applyUpgrades(Store.getBonuses(), true);
      updateHUD();
    }
    if (shopReturnTarget === 'menu') {
      renderLevelGrid();
      startOverlay.classList.remove('hidden');
    } else if (shopReturnTarget === 'pause') {
      if (btnPauseRefill && catCtrl) {
        btnPauseRefill.classList.toggle('hidden', catCtrl.cat.lives >= catCtrl.cat.maxLives);
        btnPauseRefill.disabled = Store.getCoins() < Store.LIFE_REFILL_COST;
      }
      pauseOverlay.classList.remove('hidden');
    } else if (shopReturnTarget === 'end') {
      endOverlay.classList.remove('hidden');
    }
  }

  function renderShopContent() {
    if (!shopContent) return;
    syncCoinDisplays();
    shopContent.innerHTML = '';

    document.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-shop-tab') === activeShopTab);
    });

    const coins = Store.getCoins();

    if (activeShopTab === 'upgrades') {
      for (const u of Store.UPGRADES) {
        const lv = Store.getUpgradeLevel(u.id);
        const cost = Store.getUpgradeCost(u.id);
        const isMax = cost === null;

        const card = document.createElement('div');
        card.className = 'shop-item-card';

        let pipsHtml = '';
        for (let i = 0; i < u.maxLevel; i++) {
          pipsHtml += `<span class="lv-pip ${i < lv ? 'filled' : ''}"></span>`;
        }

        card.innerHTML = `
          <div class="shop-item-main">
            <div class="shop-item-icon">${u.icon}</div>
            <div class="shop-item-info">
              <div class="shop-item-title">${u.name}</div>
              <div class="shop-item-desc">${u.desc}</div>
              <div class="shop-level-pips">
                ${pipsHtml}
                <span class="lv-effect-tag">${u.effectLabels[lv]}</span>
              </div>
            </div>
          </div>
          <button class="ios-btn ${isMax ? 'shop-buy-btn maxed' : 'ios-btn-gold shop-buy-btn'}" type="button" ${isMax || coins < cost ? 'disabled' : ''}>
            ${isMax ? '✓ مكتمل' : `${cost} <span class="gold-coin-icon">★</span>`}
          </button>
        `;

        const buyBtn = card.querySelector('button');
        if (!isMax) {
          buyBtn.addEventListener('click', () => {
            const res = Store.buyUpgrade(u.id);
            if (res.ok) {
              Audio.playPurchase();
              haptic(16);
              if (catCtrl) {
                catCtrl.applyUpgrades(Store.getBonuses(), true);
                updateHUD();
              }
              showToast(`تم تطوير ${u.name} إلى المستوى ${res.level}! ⚡`);
              renderShopContent();
            }
          });
        }
        shopContent.appendChild(card);
      }
    } else if (activeShopTab === 'skins') {
      const grid = document.createElement('div');
      grid.className = 'shop-grid';
      const equipped = Store.getEquippedSkin();

      for (const s of Store.SKINS) {
        const owned = Store.isSkinOwned(s.id);
        const isEquipped = equipped === s.id;

        const card = document.createElement('div');
        card.className = 'shop-item-card skin-card' + (isEquipped ? ' equipped' : '');
        card.innerHTML = `
          <div class="shop-item-main">
            <div class="shop-item-icon" style="border: 1px solid ${s.accent}66;">${s.icon}</div>
            <div class="shop-item-info">
              <div class="shop-item-title">${s.name}</div>
              <div class="shop-item-desc">${s.perk}</div>
            </div>
          </div>
          <button class="ios-btn ${isEquipped ? 'shop-buy-btn maxed' : owned ? 'ios-btn-glass shop-buy-btn' : 'ios-btn-gold shop-buy-btn'}" type="button" ${!owned && coins < s.cost ? 'disabled' : ''}>
            ${isEquipped ? '✓ مُجهّز' : owned ? 'تجهيز' : `فتح • ${s.cost} <span class="gold-coin-icon">★</span>`}
          </button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          if (isEquipped) return;
          const res = Store.buyOrEquipSkin(s.id);
          if (res.ok) {
            Audio.playPurchase();
            haptic(14);
            if (catCtrl) catCtrl.applyUpgrades(Store.getBonuses(), true);
            showToast(res.action === 'bought' ? `تم فتح ${s.name}! ✨` : `تم تجهيز ${s.name}`);
            renderShopContent();
          }
        });
        grid.appendChild(card);
      }
      shopContent.appendChild(grid);
    } else {
      // Boosts & Tickets Tab
      const dailyAvailable = Store.canClaimDailyBonus();
      const dailyCard = document.createElement('div');
      dailyCard.className = 'shop-item-card';
      dailyCard.innerHTML = `
        <div class="shop-item-main">
          <div class="shop-item-icon">🎁</div>
          <div class="shop-item-info">
            <div class="shop-item-title">هدية اليوم المجانية</div>
            <div class="shop-item-desc">احصل على ${Store.DAILY_BONUS_AMOUNT} عملة ذهبية مجانية كل يوم</div>
          </div>
        </div>
        <button class="ios-btn ${dailyAvailable ? 'ios-btn-gold' : 'maxed'} shop-buy-btn" type="button" ${!dailyAvailable ? 'disabled' : ''}>
          ${dailyAvailable ? `+${Store.DAILY_BONUS_AMOUNT} <span class="gold-coin-icon">★</span>` : '✓ تم الاستلام'}
        </button>
      `;
      dailyCard.querySelector('button').addEventListener('click', () => {
        const res = Store.claimDailyBonus();
        if (res.ok) {
          Audio.playPurchase();
          haptic(18);
          showToast(`تمت إضافة +${res.amount} عملة ذهبية! 🎁`);
          renderShopContent();
        }
      });
      shopContent.appendChild(dailyCard);

      const nextLocked = Store.getMaxUnlockedStage() + 1;
      const allUnlocked = Store.getMaxUnlockedStage() >= TOTAL_STAGES;
      const unlockCard = document.createElement('div');
      unlockCard.className = 'shop-item-card';
      unlockCard.innerHTML = `
        <div class="shop-item-main">
          <div class="shop-item-icon">🔓</div>
          <div class="shop-item-info">
            <div class="shop-item-title">${allUnlocked ? 'جميع المراحل مفتوحة!' : `فتح المرحلة ${nextLocked} فوراً`}</div>
            <div class="shop-item-desc">تذكرة فتح المرحلة التالية مباشرة بدون انتظار</div>
          </div>
        </div>
        <button class="ios-btn ${allUnlocked ? 'maxed' : 'ios-btn-gold'} shop-buy-btn" type="button" ${allUnlocked || coins < Store.UNLOCK_STAGE_COST ? 'disabled' : ''}>
          ${allUnlocked ? '✓ مفتوحة' : `${Store.UNLOCK_STAGE_COST} <span class="gold-coin-icon">★</span>`}
        </button>
      `;
      unlockCard.querySelector('button').addEventListener('click', () => {
        const res = Store.unlockNextStageWithCoins();
        if (res.ok) {
          Audio.playPurchase();
          haptic(20);
          showToast(`تم فتح المرحلة ${res.unlockedStage}! 🔓`);
          renderShopContent();
        }
      });
      shopContent.appendChild(unlockCard);

      if (catCtrl && paused) {
        const full = catCtrl.cat.lives >= catCtrl.cat.maxLives;
        const refillCard = document.createElement('div');
        refillCard.className = 'shop-item-card';
        refillCard.innerHTML = `
          <div class="shop-item-main">
            <div class="shop-item-icon">❤️</div>
            <div class="shop-item-info">
              <div class="shop-item-title">جرعة استعادة الأرواح</div>
              <div class="shop-item-desc">تملأ جميع أرواح مشمشة والدرع فوراً في المرحلة الحالية</div>
            </div>
          </div>
          <button class="ios-btn ${full ? 'maxed' : 'ios-btn-gold'} shop-buy-btn" type="button" ${full || coins < Store.LIFE_REFILL_COST ? 'disabled' : ''}>
            ${full ? '✓ ممتلئة' : `${Store.LIFE_REFILL_COST} 🪙`}
          </button>
        `;
        refillCard.querySelector('button').addEventListener('click', () => {
          if (Store.spendCoins(Store.LIFE_REFILL_COST)) {
            catCtrl.cat.lives = catCtrl.cat.maxLives;
            if (catCtrl.cat.shieldEnabled) catCtrl.cat.shieldActive = true;
            Audio.playPurchase();
            haptic(16);
            updateHUD();
            showToast('تمت استعادة جميع الأرواح! ❤️');
            renderShopContent();
          }
        });
        shopContent.appendChild(refillCard);
      }
    }
  }

  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      Audio.playUiClick();
      activeShopTab = btn.getAttribute('data-shop-tab');
      renderShopContent();
    });
  });

  // =========================================================================
  // INTRO & GAMEPLAY ENTRY
  // =========================================================================
  function enterGameplay() {
    playingCanvasIntro = false;
    paused = false;
    introLayer.classList.add('hidden');
    if (introHud) introHud.classList.add('hidden');
    introVideo.pause();
    hud.classList.remove('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    Audio.startMusic();
    lastTime = 0;
    running = true;
    Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, `المرحلة ${currentStage}`, '#7dd3fc');
  }

  function startIntroSequence() {
    startOverlay.classList.add('hidden');
    if (introHud) introHud.classList.remove('hidden');
    introVideo.src = 'videos/intro.mp4';
    introLayer.classList.remove('hidden');

    introVideo.onerror = () => {
      introLayer.classList.add('hidden');
      playingCanvasIntro = true;
      canvasIntroTimer = 0;
    };
    introVideo.onended = () => {
      enterGameplay();
    };
    introVideo.play().catch(() => {
      introLayer.classList.add('hidden');
      playingCanvasIntro = true;
      canvasIntroTimer = 0;
    });
  }

  btnSkipIntro.addEventListener('click', enterGameplay);

  // =========================================================================
  // SKILLS & ENEMIES
  // =========================================================================
  function triggerMeow() {
    if (!catCtrl || !running) return;
    const c = catCtrl.cat;
    if (c.meowCooldown > 0) return;

    const bonuses = Store.getBonuses();
    c.meowCooldown = bonuses.meowCooldown;
    Audio.playMeow();
    haptic(12);
    const mx = c.x + c.w / 2;
    const my = c.y + c.h / 2;
    const range = Math.max(280, bonuses.meowRange || 280);
    Particles.spawnMeowRing(mx, my);
    Particles.spawnPopup(mx, c.y - 16, 'مواء!', '#ffd60a');

    // Repel & push back nearby dogs away from Mashmasha!
    for (const dog of level.dogs) {
      const dogCx = dog.x + dog.w / 2;
      const dogCy = dog.y + dog.h / 2;
      if (Math.hypot(mx - dogCx, my - dogCy) < range) {
        const awayDir = dogCx >= mx ? 1 : -1;
        dog.state = 'repelled';
        dog.facing = awayDir;
        dog.repelDir = awayDir;
        dog.stateTimer = 2.6;
        Particles.spawnPopup(dogCx, dog.y - 14, '💨 ابتعد!', '#7dd3fc');
      }
    }

    // Repel all standard ground & flying enemies (hedgehogs, crabs, rats, raccoons, crows, seagulls, falcons, bats, drones)
    const repelList = (list, isFly = false) => {
      if (!list) return;
      for (const e of list) {
        const ex = e.x + (e.w || 40) / 2;
        const ey = e.y + (e.h || 32) / 2;
        if (Math.hypot(mx - ex, my - ey) < range) {
          const awayDir = ex >= mx ? 1 : -1;
          e.repelTimer = 2.4;
          e.repelDir = awayDir;
          e.facing = awayDir;
          if (isFly) e.repelLift = -75;
          Particles.spawnPopup(ex, e.y - 12, '💨', '#7dd3fc');
        }
      }
    };
    repelList(level.hedgehogs, false);
    repelList(level.crabs, false);
    repelList(level.rats, false);
    repelList(level.raccoons, false);
    repelList(level.crows, true);
    repelList(level.seagulls, true);
    repelList(level.falcons, true);
    repelList(level.bats, true);
    repelList(level.drones, true);

    // Repel all extended Stage 9-15 enemies as well!
    if (EnemiesExt && EnemiesExt.applyMeowRepel) {
      EnemiesExt.applyMeowRepel(level, mx, my, range, Particles);
    }

    updateHUD();
  }

  function onCatHit(reason, isFall = false) {
    if (!isFall && catCtrl && isInCheckpointSafeZone(level, catCtrl.cat.x, catCtrl.cat.y, catCtrl.cat.w, catCtrl.cat.h)) {
      return;
    }
    if (catCtrl.takeDamage(reason, isFall)) {
      shakeTimer = 0.22;
      haptic(28);
      updateHUD();
    }
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

      if (dog.state === 'repelled') {
        dog.stateTimer -= dt;
        const dir = dog.repelDir || 1;
        dog.facing = dir;
        dog.x = Math.max(dog.minX, Math.min(dog.maxX, dog.x + dir * 215 * dt));
        if (dog.stateTimer <= 0) dog.state = 'patrol';
      } else if (dog.state === 'distracted') {
        dog.stateTimer -= dt;
        const diff = dog.distractX - dogCx;
        if (Math.abs(diff) > 12) {
          dog.facing = diff > 0 ? 1 : -1;
          dog.x += dog.facing * 85 * dt;
        }
        if (dog.stateTimer <= 0) dog.state = 'patrol';
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
        dog.state !== 'repelled' &&
        !isInCheckpointSafeZone(level, c.x, c.y, c.w, c.h) &&
        c.x + 6 < dog.x + dog.w - 6 &&
        c.x + c.w - 6 > dog.x + 6 &&
        c.y + 6 < dog.y + dog.h &&
        c.y + c.h > dog.y + 6
      ) {
        onCatHit('عضّة كلب! -1 ❤️');
      }
    }

    return anyChasing;
  }

  function updatePatrolEnemies(list, dt, hitMsg, pad = 5) {
    if (!list) return;
    const c = catCtrl.cat;
    for (const e of list) {
      if (e.repelTimer > 0) {
        e.repelTimer -= dt;
        const dir = e.repelDir || 1;
        e.facing = dir;
        e.x = Math.max(e.minX, Math.min(e.maxX, e.x + dir * Math.max(195, Math.abs(e.vx) * 2.1) * dt));
        continue;
      }
      e.x += e.facing * Math.abs(e.vx) * dt;
      if (e.x <= e.minX) {
        e.x = e.minX;
        e.facing = 1;
      } else if (e.x >= e.maxX) {
        e.x = e.maxX;
        e.facing = -1;
      }
      if (
        c.x + 6 < e.x + e.w - pad &&
        c.x + c.w - 6 > e.x + pad &&
        c.y + 6 < e.y + e.h &&
        c.y + c.h > e.y + pad
      ) {
        onCatHit(hitMsg);
      }
    }
  }

  function updateFlyingEnemies(list, dt, timeSec, hitMsg) {
    if (!list) return;
    const c = catCtrl.cat;
    for (const f of list) {
      if (f.repelTimer > 0) {
        f.repelTimer -= dt;
        const dir = f.repelDir || 1;
        f.facing = dir;
        f.x = Math.max(f.minX, Math.min(f.maxX, f.x + dir * Math.max(210, Math.abs(f.vx) * 2.0) * dt));
        const lift = (f.repelLift || -75) * Math.min(1, f.repelTimer / 0.8);
        f.y = f.baseY + lift + Math.sin(timeSec * 8) * 6;
        continue;
      }
      f.x += f.facing * Math.abs(f.vx) * dt;
      if (f.x <= f.minX) {
        f.x = f.minX;
        f.facing = 1;
      } else if (f.x >= f.maxX) {
        f.x = f.maxX;
        f.facing = -1;
      }
      f.y = f.baseY + Math.sin(timeSec * (f.freq || 2.5) + f.minX * 0.01) * (f.amp || 18);
      if (
        c.x + 8 < f.x + f.w - 6 &&
        c.x + c.w - 8 > f.x + 6 &&
        c.y + 6 < f.y + f.h - 4 &&
        c.y + c.h > f.y + 6
      ) {
        onCatHit(hitMsg);
      }
    }
  }

  function updateRats(dt) {
    if (!level.rats) return;
    const c = catCtrl.cat;
    for (const rat of level.rats) {
      if (rat.repelTimer > 0) {
        rat.repelTimer -= dt;
        const dir = rat.repelDir || 1;
        rat.facing = dir;
        rat.x = Math.max(rat.minX, Math.min(rat.maxX, rat.x + dir * 215 * dt));
        continue;
      }
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
        onCatHit('عضّة جرذ! -1 ❤️');
      }
    }
  }

  function updatePlatformHazards(dt, timeSec) {
    if (!level.platforms) return;
    const c = catCtrl.cat;
    for (const p of level.platforms) {
      if (p.type === 'phase_platform') {
        const cycle = (timeSec + (p.phase || 0)) % 7.0;
        p.phaseSolid = cycle < 5.4;
      } else if (p.type === 'steam_vent' || p.type === 'fountain_jet') {
        const cycle = (timeSec + (p.phase || 0)) % 3.6;
        if (cycle >= 0.8 && cycle <= 3.0) {
          if (c.x + c.w > p.x - 8 && c.x < p.x + p.w + 8 && c.y + c.h <= p.y + 12 && c.y + c.h >= p.y - 220) {
            c.vy = Math.max(-540, Math.min(c.vy, -370) - 920 * dt);
            c.onGround = false;
          }
        }
      } else if (p.type === 'third_rail') {
        const cycle = (timeSec + (p.phase || 0)) % 3.4;
        if (cycle >= 1.9 && cycle <= 3.1) {
          if (c.x + 6 < p.x + p.w - 4 && c.x + c.w - 6 > p.x + 4 && c.y + c.h >= p.y - 8 && c.y <= p.y + p.h) {
            onCatHit('صعقة كهربائية! -1 ❤️');
          }
        }
      } else if (p.type === 'welding_spark' || p.type === 'laser_grid') {
        const cycle = (timeSec + (p.phase || 0)) % 3.2;
        if (cycle >= 1.7 && cycle <= 2.9) {
          if (c.x + 6 < p.x + p.w - 4 && c.x + c.w - 6 > p.x + 4 && c.y + c.h >= p.y - 18 && c.y <= p.y + p.h) {
            onCatHit(p.type === 'laser_grid' ? 'شعاع ليزر! -1 ❤️' : 'شرارة لحام! -1 ❤️');
          }
        }
      }
    }
  }

  function updateInteractions(dt) {
    const c = catCtrl.cat;
    const bonuses = Store.getBonuses();
    const catCx = c.x + c.w / 2;
    const catCy = c.y + c.h / 2;

    if (coinComboTimer > 0) {
      coinComboTimer -= dt;
      if (coinComboTimer <= 0) coinCombo = 0;
    }

    // Water hazards
    for (const p of level.puddles) {
      if (c.x + 8 < p.x + p.w && c.x + c.w - 8 > p.x && c.y + c.h > p.y && c.y < p.y + p.h) {
        Audio.playSplash();
        Particles.spawnSplash(catCx, p.y);
        onCatHit('ماء عميق! -1 ❤️', true);
      }
    }

    // Abyss fall
    if (c.y > level.height + 60) {
      onCatHit('سقوط! -1 ❤️', true);
    }

    // Checkpoints
    for (const cp of level.checkpoints) {
      if (!cp.activated && Math.abs(c.x - cp.x) < 42 && Math.abs(c.y - cp.y) < 48) {
        cp.activated = true;
        c.checkpointX = cp.x;
        c.checkpointY = cp.y - 10;
        if (Audio.playCheckpoint) Audio.playCheckpoint();
        else Audio.playPurr();
        haptic(12);
        Particles.spawnHeart(cp.x + 18, cp.y - 16);
        Particles.spawnPopup(cp.x + 18, cp.y - 38, 'نقطة حفظ ✓', '#86efac');
      }
    }

    // Spinning Gold Coins (+ Coin Magnet pull!)
    if (level.coins) {
      for (const coin of level.coins) {
        if (coin.collected) continue;
        if (coin.hiddenInDay && !c.nightVision) continue;
        const dx = catCx - coin.x;
        const dy = catCy - coin.y;
        const dist = Math.hypot(dx, dy);

        if (bonuses.magnetRadius > 0 && dist < bonuses.magnetRadius && dist > 1) {
          const pull = Math.min(dist, 460 * dt);
          coin.x += (dx / dist) * pull;
          coin.y += (dy / dist) * pull;
        }

        if (dist < 31) {
          coin.collected = true;
          const gained = Math.max(1, Math.round((coin.value || 1) * bonuses.coinMult));
          stageCoinsEarned += gained;
          Store.addCoins(gained);
          Audio.playCoin(coinCombo);
          coinCombo = Math.min(8, coinCombo + 1);
          coinComboTimer = 1.35;
          Particles.spawnCoinSparkle(coin.x, coin.y);
          Particles.spawnPopup(coin.x, coin.y - 14, `+${gained} 🪙`, '#fde047');
          syncCoinDisplays(true);
        }
      }
    }

    // Collectible Fish Treats (+15 Bonus Coins!)
    for (const t of level.treats) {
      if (t.collected) continue;
      if (t.hiddenInDay && !c.nightVision) continue;
      const dx = catCx - t.x;
      const dy = catCy - t.y;
      const dist = Math.hypot(dx, dy);
      if (bonuses.magnetRadius > 0 && dist < bonuses.magnetRadius * 0.7 && dist > 1) {
        const pull = Math.min(dist, 340 * dt);
        t.x += (dx / dist) * pull;
        t.y += (dy / dist) * pull;
      }
      if (dist < 33) {
        t.collected = true;
        collectedTreats++;
        const fishCoinBonus = Math.round(15 * bonuses.coinMult);
        stageCoinsEarned += fishCoinBonus;
        Store.addCoins(fishCoinBonus);
        Audio.playTreat();
        haptic(14);
        Particles.spawnCoinSparkle(t.x, t.y);
        Particles.spawnPopup(t.x, t.y - 16, `+1 🐟 +${fishCoinBonus}🪙`, '#ffd60a');
        updateHUD();
        syncCoinDisplays(true);
      }
    }

    if (c.lives <= 0) {
      finishStage(false);
      return;
    }

    // Goal Gate
    const g = level.goal;
    if (c.x + c.w > g.x && c.x < g.x + g.w && c.y + c.h > g.y && c.y < g.y + g.h) {
      finishStage(true);
    }
  }

  // =========================================================================
  // STAGE COMPLETE & GAME OVER
  // =========================================================================
  function showVictoryOverlay(reward) {
    endOverlay.classList.remove('hidden');
    const isFinal = currentStage === TOTAL_STAGES;
    btnNextStage.classList.toggle('hidden', isFinal);
    if (!isFinal) {
      btnNextStage.textContent = `المرحلة ${currentStage + 1} ▶`;
    }
    endBadge.textContent = isFinal
      ? `المرحلة ${TOTAL_STAGES} • نهاية الرحلة`
      : `المرحلة ${currentStage} مكتملة`;
    endTitle.textContent = isFinal ? 'عادت مشمشة إلى المنزل! 🏠🏆' : 'مرحلة رائعة! 🎉';

    // Animate 3 golden stars
    if (endStarsRow) {
      const stars = endStarsRow.querySelectorAll('.end-star');
      stars.forEach((st, idx) => {
        st.classList.remove('earned');
        if (idx < reward.stars) {
          setTimeout(() => st.classList.add('earned'), 160 + idx * 180);
        }
      });
    }

    const totalRunCoins = stageCoinsEarned + reward.totalBonus;
    endStats.innerHTML =
      `الوقت: <strong>${elapsedTime.toFixed(1)} ث</strong> • ` +
      `الأرواح: <strong>${catCtrl.cat.lives}/${catCtrl.cat.maxLives} ❤️</strong> • ` +
      `الأسماك: <strong>${collectedTreats}/3 🐟</strong><br/>` +
      `<span class="end-coin-highlight">+${totalRunCoins} 🪙 (${stageCoinsEarned} جُمعت + ${reward.totalBonus} مكافأة)</span>`;
    syncCoinDisplays();
  }

  function finishStage(won) {
    running = false;
    paused = false;
    clearAllInputs();
    if (touchControls) touchControls.classList.add('hidden');
    Audio.setChaseMode(false);

    if (won) {
      Audio.playStageClear();
      haptic(25);
      const reward = Store.recordStageClear(currentStage, collectedTreats);
      renderLevelGrid();

      if (currentStage === TOTAL_STAGES) {
        // Grand Finale Stage 15 plays Win1.mp4 -> Win2.mp4!
        endOverlay.classList.add('hidden');
        hud.classList.add('hidden');

        const showFinalSummary = () => {
          winVideo.pause();
          winLayer.classList.add('hidden');
          showVictoryOverlay(reward);
        };

        const winPlaylist = ['videos/Win1.mp4', 'videos/Win2.mp4'];
        let winIdx = 0;
        const playNextWinClip = () => {
          if (winIdx >= winPlaylist.length) {
            showFinalSummary();
            return;
          }
          winVideo.src = winPlaylist[winIdx++];
          winLayer.classList.remove('hidden');
          winVideo.play().catch(showFinalSummary);
        };

        winVideo.onended = playNextWinClip;
        winVideo.onerror = showFinalSummary;
        if (btnSkipWin) btnSkipWin.onclick = showFinalSummary;
        playNextWinClip();
      } else {
        showVictoryOverlay(reward);
      }
      return;
    }

    // Lost all lives -> Game Over Video + Revive option
    endOverlay.classList.add('hidden');
    hud.classList.add('hidden');
    gameOverActions.classList.add('hidden');
    gameOverLayer.classList.remove('hidden');

    if (btnGameOverRevive) {
      const canRevive = Store.getCoins() >= Store.LIFE_REFILL_COST;
      btnGameOverRevive.disabled = !canRevive;
      btnGameOverRevive.textContent = `❤️ متابعة (${Store.LIFE_REFILL_COST} 🪙)`;
    }

    const showFallbackOverlay = () => {
      gameOverLayer.classList.add('hidden');
      endOverlay.classList.remove('hidden');
      btnNextStage.classList.add('hidden');
      if (endStarsRow) {
        endStarsRow.querySelectorAll('.end-star').forEach((s) => s.classList.remove('earned'));
      }
      endBadge.textContent = 'انتهت الأرواح';
      endTitle.textContent = 'حاول مرة أخرى! 🐱';
      endStats.innerHTML = 'استخدم <strong>المواء</strong> لتشتيت الكلاب وطوّر قدراتك من <strong>المتجر 🛒</strong>.';
    };

    if (gameOverVideo._btnTimer) clearTimeout(gameOverVideo._btnTimer);
    gameOverVideo._btnTimer = setTimeout(() => {
      if (!gameOverLayer.classList.contains('hidden')) {
        gameOverActions.classList.remove('hidden');
      }
    }, 1500);

    gameOverVideo.onended = () => {
      gameOverVideo.pause();
      gameOverActions.classList.remove('hidden');
    };
    gameOverVideo.onerror = showFallbackOverlay;
    gameOverVideo.currentTime = 0;
    gameOverVideo.play().catch(showFallbackOverlay);
  }

  function reviveAtCheckpoint() {
    if (!Store.spendCoins(Store.LIFE_REFILL_COST)) {
      showToast('عملات غير كافية! 🪙');
      return;
    }
    Audio.playPurchase();
    haptic(20);
    if (gameOverVideo._btnTimer) clearTimeout(gameOverVideo._btnTimer);
    gameOverVideo.pause();
    gameOverLayer.classList.add('hidden');
    gameOverActions.classList.add('hidden');
    endOverlay.classList.add('hidden');
    hud.classList.remove('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    clearAllInputs();
    catCtrl.refillLives();
    updateHUD();
    syncCoinDisplays();
    Particles.spawnShieldBurst(catCtrl.cat.x + catCtrl.cat.w / 2, catCtrl.cat.y + catCtrl.cat.h / 2);
    Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, '❤️ عودة للحياة!', '#86efac');
    lastTime = 0;
    running = true;
  }

  // =========================================================================
  // CANVAS INTRO & RENDERING
  // =========================================================================
  function drawCanvasIntro(t) {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
    sky.addColorStop(0, '#2a1d42');
    sky.addColorStop(0.55, '#7e3b56');
    sky.addColorStop(1, '#f39856');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    ctx.fillStyle = '#4c2c2b';
    ctx.fillRect(420, 60, 440, 660);
    ctx.fillStyle = '#2d1c1e';
    ctx.fillRect(460, 120, 120, 140);
    ctx.fillStyle = 'rgba(255, 220, 130, 0.7)';
    ctx.fillRect(475, 135, 90, 110);

    const progress = Math.min(1, t / 4.2);
    const fallY = progress < 0.3 ? 190 : 190 + Math.pow((progress - 0.3) / 0.7, 1.5) * 390;
    const fallX = 530 + Math.sin(t * 6) * (progress > 0.3 ? 18 : 0);

    ctx.fillStyle = '#8b5e34';
    ctx.fillRect(495, 575, 85, 65);

    catCtrl.cat.x = fallX;
    catCtrl.cat.y = fallY;
    catCtrl.cat.vy = progress > 0.3 ? 500 : 0;
    catCtrl.cat.onGround = false;
    catCtrl.draw(ctx, 0, 0);

    if (t > 3.5) {
      ctx.fillStyle = 'rgba(10, 14, 24, 0.72)';
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE WAY HOME • 7 LIVES', LOGICAL_W / 2, 310);
      ctx.fillStyle = '#ffd60a';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('Dr. MAX MOUSA', LOGICAL_W / 2, 368);
    }
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
    const theme = level.theme;
    if (theme === 'museum') {
      Art.drawMuseumSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawMuseumMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'bridge') {
      Art.drawBridgeSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawBridgeMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'oldtown') {
      Art.drawOldTownSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawOldTownMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'harbor_storm') {
      Art.drawHarborStormSkyAndSea(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawHarborStormMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'greenhouse') {
      Art.drawGreenhouseSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawGreenhouseMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'rooftop_neon') {
      Art.drawNeonRooftopSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawNeonRooftopMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'homeward') {
      Art.drawHomewardSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawHomewardMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'construction') {
      Art.drawConstructionSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawConstructionMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'subway') {
      Art.drawSubwaySkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawSubwayMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'rooftop') {
      Art.drawRooftopSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawRooftopMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'harbor') {
      Art.drawHarborSkyAndSea(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawHarborMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'park') {
      Art.drawParkSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawParkMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else {
      Art.drawSkyAndFarCity(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      if (theme === 'market') {
        Art.drawMarketMidgroundBuildings(ctx, camX, LOGICAL_W, LOGICAL_H, time);
        Art.drawMarketFestoonLanterns(ctx, camX, LOGICAL_W, time);
      } else {
        Art.drawMidgroundCityBuildings(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      }
    }

    Art.drawStreetlamps(ctx, level.lamps, camX, time);

    // Lightweight floating dust motes
    ctx.fillStyle = 'rgba(255, 226, 170, 0.25)';
    for (let i = 0; i < 10; i++) {
      const dx = (i * 197 + time * 18) % LOGICAL_W;
      const dy = (i * 89 + Math.sin(time + i) * 25) % 600;
      ctx.fillRect(dx, dy, 3, 3);
    }

    if (dimBackground) {
      ctx.fillStyle = 'rgba(6, 9, 18, 0.65)';
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    }
  }

  function drawLevel(time, viewW) {
    const nv = catCtrl.cat.nightVision;
    const cullW = viewW || LOGICAL_W;

    for (const p of level.platforms) {
      if (p.hiddenInDay && !nv) continue;
      if (p.bounceAnim && p.bounceAnim > 0) p.bounceAnim = Math.max(0, p.bounceAnim - 0.08);
      const px = p.x - camX;
      const py = p.y - camY + (p.type !== 'flower_bounce' && p.bounceAnim ? Math.sin(p.bounceAnim * Math.PI) * 6 : 0);
      if (px + p.w < -40 || px > cullW + 40) continue;
      Art.drawPlatform(ctx, p, px, py, nv, time);
    }

    if (currentStage === 1) {
      Art.drawStartCardboardScene(ctx, camX, camY);
    }

    for (const p of level.puddles) {
      const px = p.x - camX;
      if (px + p.w < -40 || px > cullW + 40) continue;
      Art.drawPuddle(ctx, px, p.y - camY, p.w, p.h, time, level.theme === 'harbor' || level.theme === 'harbor_storm');
    }

    for (const cp of level.checkpoints) {
      const cx = cp.x - camX;
      if (cx < -100 || cx > cullW + 100) continue;
      Art.drawCheckpoint(ctx, cp, cx, cp.y - camY, time);
    }

    // Spinning Gold Coins
    if (level.coins && Art.drawCoin) {
      for (const coin of level.coins) {
        if (coin.collected) continue;
        if (coin.hiddenInDay && !nv) continue;
        const cx = coin.x - camX;
        if (cx < -30 || cx > cullW + 30) continue;
        Art.drawCoin(ctx, cx, coin.y - camY, time, coin.phase || 0, coin.value || 1);
      }
    }

    // Fish Treats
    for (const t of level.treats) {
      if (t.collected) continue;
      if (t.hiddenInDay && !nv) continue;
      const tx = t.x - camX;
      if (tx < -40 || tx > cullW + 40) continue;
      const ty = t.y - camY + Math.sin(time * 4 + t.x) * 5;
      ctx.fillStyle = 'rgba(255, 211, 110, 0.25)';
      ctx.beginPath();
      ctx.arc(tx, ty, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐟', tx, ty + 8);
    }

    for (const dog of level.dogs) {
      const dx = dog.x - camX;
      if (dx < -100 || dx > cullW + 100) continue;
      Art.drawDog(ctx, dog, dx, dog.y - camY, nv, time);
    }
    if (level.hedgehogs) {
      for (const hog of level.hedgehogs) {
        const hx = hog.x - camX;
        if (hx < -80 || hx > cullW + 80) continue;
        Art.drawHedgehog(ctx, hog, hx, hog.y - camY, time);
      }
    }
    if (level.crows) {
      for (const crow of level.crows) {
        const cx = crow.x - camX;
        if (cx < -80 || cx > cullW + 80) continue;
        Art.drawCrow(ctx, crow, cx, crow.y - camY, time);
      }
    }
    if (level.crabs) {
      for (const crab of level.crabs) {
        const cx = crab.x - camX;
        if (cx < -80 || cx > cullW + 80) continue;
        Art.drawCrab(ctx, crab, cx, crab.y - camY, time);
      }
    }
    if (level.seagulls) {
      for (const gull of level.seagulls) {
        const gx = gull.x - camX;
        if (gx < -80 || gx > cullW + 80) continue;
        Art.drawSeagull(ctx, gull, gx, gull.y - camY, time);
      }
    }
    if (level.rats) {
      for (const rat of level.rats) {
        const rx = rat.x - camX;
        if (rx < -80 || rx > cullW + 80) continue;
        Art.drawRat(ctx, rat, rx, rat.y - camY, time);
      }
    }
    if (level.raccoons) {
      for (const rac of level.raccoons) {
        const rx = rac.x - camX;
        if (rx < -80 || rx > cullW + 80) continue;
        Art.drawRaccoon(ctx, rac, rx, rac.y - camY, time);
      }
    }
    if (level.falcons) {
      for (const falcon of level.falcons) {
        const fx = falcon.x - camX;
        if (fx < -80 || fx > cullW + 80) continue;
        Art.drawFalcon(ctx, falcon, fx, falcon.y - camY, time);
      }
    }
    if (level.bats) {
      for (const bat of level.bats) {
        const bx = bat.x - camX;
        if (bx < -80 || bx > cullW + 80) continue;
        Art.drawBat(ctx, bat, bx, bat.y - camY, time);
      }
    }
    if (level.drones) {
      for (const drone of level.drones) {
        const dx = drone.x - camX;
        if (dx < -80 || dx > cullW + 80) continue;
        Art.drawDrone(ctx, drone, dx, drone.y - camY, time);
      }
    }

    if (EnemiesExt) {
      EnemiesExt.drawAll(ctx, level, camX, camY, time, cullW, nv);
    }

    const g = level.goal;
    Art.drawMarketGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
  }

  function drawNightVisionOverlay() {
    if (!catCtrl.cat.nightVision) return;
    ctx.fillStyle = 'rgba(20, 95, 58, 0.22)';
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
  }

  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min(0.033, (timestamp - lastTime) / 1000);
    lastTime = timestamp;
    const timeSec = timestamp / 1000;

    if (playingCanvasIntro) {
      canvasIntroTimer += dt;
      ctx.save();
      ctx.scale(RENDER_SCALE, RENDER_SCALE);
      drawCanvasIntro(canvasIntroTimer);
      ctx.restore();
      if (canvasIntroTimer > 5.2) {
        catCtrl.cat.x = level.startX;
        catCtrl.cat.y = level.startY;
        catCtrl.cat.vy = 0;
        enterGameplay();
      }
      requestAnimationFrame(loop);
      return;
    }

    const viewZoom = 1.3;
    const viewW = LOGICAL_W / viewZoom;
    const viewH = LOGICAL_H / viewZoom;

    if (running && !paused) {
      elapsedTime += dt;
      if (shakeTimer > 0) shakeTimer = Math.max(0, shakeTimer - dt);

      updateMovingPlatforms(timeSec);
      catCtrl.update(dt, input, level);
      input.jumpPressed = false;
      const dogChasing = updateDogs(dt);
      updatePatrolEnemies(level.hedgehogs, dt, 'أشواك القنفذ! -1 ❤️', 4);
      updateFlyingEnemies(level.crows, dt, timeSec, 'هجوم غراب! -1 ❤️');
      updatePatrolEnemies(level.crabs, dt, 'كماشة سرطان! -1 ❤️', 4);
      updateFlyingEnemies(level.seagulls, dt, timeSec, 'هجوم نورس! -1 ❤️');
      updateRats(dt);
      updatePatrolEnemies(level.raccoons, dt, 'هجوم راكون! -1 ❤️', 5);
      updateFlyingEnemies(level.falcons, dt, timeSec, 'انقضاض بومة! -1 ❤️');
      updateFlyingEnemies(level.bats, dt, timeSec, 'خفاش النفق! -1 ❤️');
      updateFlyingEnemies(level.drones, dt, timeSec, 'طائرة مراقبة! -1 ❤️');
      const extChasing = EnemiesExt ? EnemiesExt.updateAll(level, catCtrl, dt, timeSec, onCatHit, Audio, Particles) : false;
      Audio.setChaseMode(!!(dogChasing || extChasing));
      updatePlatformHazards(dt, timeSec);
      updateInteractions(dt);
      Particles.update(dt);

      const lookAhead = catCtrl.cat.facing * 42;
      const targetCamX = Math.max(
        0,
        Math.min(level.width - viewW, catCtrl.cat.x + lookAhead - viewW * 0.38)
      );
      const normalTargetCamY = Math.max(
        0,
        Math.min(level.height - viewH, catCtrl.cat.y - viewH * 0.58)
      );
      // Smooth Look-Down Camera when sneaking/crouching ("تسلل") while on elevated platforms!
      const lookingDown = catCtrl.cat.crouching && catCtrl.cat.onGround;
      const targetCamY = lookingDown
        ? Math.min(level.height - viewH, Math.max(normalTargetCamY, catCtrl.cat.y - 66))
        : normalTargetCamY;
      camX += (targetCamX - camX) * Math.min(1, dt * 7.5);
      camY += (targetCamY - camY) * Math.min(1, dt * (lookingDown ? 5.6 : 7.5));
      updateHUD();
    }

    const shakeX = shakeTimer > 0 ? (Math.random() - 0.5) * 8 : 0;
    const shakeY = shakeTimer > 0 ? (Math.random() - 0.5) * 6 : 0;

    ctx.save();
    ctx.scale(RENDER_SCALE, RENDER_SCALE);
    drawBackground(timeSec);
    ctx.save();
    ctx.scale(viewZoom, viewZoom);
    ctx.translate(shakeX, shakeY);
    drawLevel(timeSec, viewW);
    catCtrl.draw(ctx, camX, camY);
    Particles.draw(ctx, camX, camY);
    ctx.restore();
    drawNightVisionOverlay();
    ctx.restore();

    requestAnimationFrame(loop);
  }

  // =========================================================================
  // NAVIGATION & INPUT LISTENERS
  // =========================================================================
  function restartCurrentStage() {
    Audio.playUiClick();
    paused = false;
    pauseOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    if (gameOverVideo._btnTimer) clearTimeout(gameOverVideo._btnTimer);
    gameOverVideo.pause();
    gameOverLayer.classList.add('hidden');
    gameOverActions.classList.add('hidden');
    if (winVideo) winVideo.pause();
    if (winLayer) winLayer.classList.add('hidden');
    hud.classList.remove('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    clearAllInputs();
    initLevel(currentStage);
    Audio.resumeMusic();
    lastTime = 0;
    running = true;
  }

  function returnToMainMenu() {
    Audio.playUiClick();
    running = false;
    paused = false;
    playingCanvasIntro = false;
    clearAllInputs();
    Audio.setChaseMode(false);
    Audio.pauseMusic();
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
    if (pauseOverlay) pauseOverlay.classList.add('hidden');
    if (shopOverlay) shopOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    hud.classList.add('hidden');
    if (touchControls) touchControls.classList.add('hidden');
    renderLevelGrid();
    startOverlay.classList.remove('hidden');
  }

  function toggleNightVision() {
    if (!catCtrl || !running) return;
    catCtrl.cat.nightVision = !catCtrl.cat.nightVision;
    Audio.playNightVision(catCtrl.cat.nightVision);
    haptic(10);
    updateHUD();
  }

  // Keyboard Controls
  window.addEventListener('keydown', (e) => {
    if (playingCanvasIntro && (e.code === 'Space' || e.code === 'Enter')) {
      catCtrl.cat.x = level.startX;
      catCtrl.cat.y = level.startY;
      catCtrl.cat.vy = 0;
      enterGameplay();
      return;
    }

    if (e.code === 'Escape' || e.code === 'KeyP') {
      if (!shopOverlay.classList.contains('hidden')) {
        closeShop();
        return;
      }
      if (guidePanel && !guidePanel.classList.contains('hidden')) {
        guidePanel.classList.add('hidden');
        return;
      }
      if (running) openPauseMenu();
      else if (paused) resumeFromPause();
      return;
    }

    if (!running || paused) return;

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = true;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.shift = true;

    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      if (!input.jumpHeld) input.jumpPressed = true;
      input.jumpHeld = true;
      e.preventDefault();
    }

    if (e.code === 'KeyE' || e.code === 'KeyN') toggleNightVision();
    if (e.code === 'KeyQ' || e.code === 'KeyF') triggerMeow();
    if (e.code === 'KeyR') restartCurrentStage();
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.shift = false;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') input.jumpHeld = false;
  });

  // Multi-Touch Pointer Controls (Smooth thumb-slide + Haptics)
  if (touchControls) {
    const activeHoldPointers = new Map();
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

    const dirLeftBtn = touchControls.querySelector('.touch-btn[data-action="left"]');
    const dirRightBtn = touchControls.querySelector('.touch-btn[data-action="right"]');

    touchControls.querySelectorAll('.touch-btn').forEach((btn) => {
      const action = btn.getAttribute('data-action');
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        Audio.ensureCtx();
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
        haptic(8);
        try { btn.setPointerCapture(e.pointerId); } catch (err) {}
        if (action === 'jump' && !input.jumpHeld) input.jumpPressed = true;
        activeHoldPointers.set(e.pointerId, { action, btn });
        btn.classList.add('pressed');
        syncHeld();
      });

      if (action === 'left' || action === 'right') {
        btn.addEventListener('pointermove', (e) => {
          const entry = activeHoldPointers.get(e.pointerId);
          if (!entry) return;
          const target = document.elementFromPoint(e.clientX, e.clientY);
          const hoveredBtn = target ? target.closest('.touch-btn[data-action="left"], .touch-btn[data-action="right"]') : null;
          if (hoveredBtn && hoveredBtn !== entry.btn) {
            entry.btn.classList.remove('pressed');
            entry.action = hoveredBtn.getAttribute('data-action');
            entry.btn = hoveredBtn;
            hoveredBtn.classList.add('pressed');
            haptic(6);
            syncHeld();
          }
        });
      }

      const releasePointer = (e) => {
        btn.classList.remove('pressed');
        if (dirLeftBtn) dirLeftBtn.classList.remove('pressed');
        if (dirRightBtn) dirRightBtn.classList.remove('pressed');
        if (activeHoldPointers.has(e.pointerId)) {
          activeHoldPointers.delete(e.pointerId);
          for (const item of activeHoldPointers.values()) {
            if (item.btn) item.btn.classList.add('pressed');
          }
          syncHeld();
        }
      };
      btn.addEventListener('pointerup', releasePointer);
      btn.addEventListener('pointercancel', releasePointer);
    });
  }

  // Button Wiring
  if (btnQuickPlay) {
    btnQuickPlay.addEventListener('click', () => {
      Audio.ensureCtx();
      Audio.playUiClick();
      haptic(12);
      const target = parseInt(btnQuickPlay.dataset.targetStage, 10) || Store.getMaxUnlockedStage();
      startStageFromMenu(target);
    });
  }

  if (btnOpenShop) btnOpenShop.addEventListener('click', () => openShop('menu'));
  if (btnMenuCoins) btnMenuCoins.addEventListener('click', () => openShop('menu'));
  if (btnPauseShop) btnPauseShop.addEventListener('click', () => openShop('pause'));
  if (btnEndShop) btnEndShop.addEventListener('click', () => openShop('end'));
  if (btnCloseShop) btnCloseShop.addEventListener('click', closeShop);

  if (btnPause) btnPause.addEventListener('click', openPauseMenu);
  if (btnResumeGame) btnResumeGame.addEventListener('click', resumeFromPause);
  if (btnPauseRestart) btnPauseRestart.addEventListener('click', restartCurrentStage);
  if (btnPauseMenu) btnPauseMenu.addEventListener('click', returnToMainMenu);

  if (btnPauseRefill) {
    btnPauseRefill.addEventListener('click', () => {
      if (!catCtrl || catCtrl.cat.lives >= catCtrl.cat.maxLives) return;
      if (Store.spendCoins(Store.LIFE_REFILL_COST)) {
        catCtrl.cat.lives = catCtrl.cat.maxLives;
        if (catCtrl.cat.shieldEnabled) catCtrl.cat.shieldActive = true;
        Audio.playPurchase();
        haptic(16);
        updateHUD();
        syncCoinDisplays();
        btnPauseRefill.classList.add('hidden');
        showToast('تمت استعادة كل الأرواح! ❤️');
      } else {
        showToast('عملات غير كافية! 🪙');
      }
    });
  }

  if (btnNextStage) {
    btnNextStage.addEventListener('click', () => {
      Audio.playUiClick();
      endOverlay.classList.add('hidden');
      if (touchControls) touchControls.classList.remove('hidden');
      clearAllInputs();
      const nextStage = Math.min(TOTAL_STAGES, currentStage + 1);
      initLevel(nextStage);
      Audio.resumeMusic();
      lastTime = 0;
      running = true;
      Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, `المرحلة ${nextStage}`, '#ffd60a');
    });
  }

  if (btnRestartStage) btnRestartStage.addEventListener('click', restartCurrentStage);
  if (btnGameOverRestart) btnGameOverRestart.addEventListener('click', restartCurrentStage);
  if (btnGameOverRevive) btnGameOverRevive.addEventListener('click', reviveAtCheckpoint);
  if (btnGameOverMenu) btnGameOverMenu.addEventListener('click', returnToMainMenu);
  if (btnEndMenu) btnEndMenu.addEventListener('click', returnToMainMenu);

  if (skillNightVision) skillNightVision.addEventListener('click', toggleNightVision);
  if (skillMeow) skillMeow.addEventListener('click', triggerMeow);

  if (btnDimBg) {
    btnDimBg.addEventListener('click', () => {
      Audio.playUiClick();
      dimBackground = !dimBackground;
      try { localStorage.setItem(DIM_BG_KEY, dimBackground ? '1' : '0'); } catch (e) {}
      syncToggleButtons();
    });
  }

  if (btnMusic) {
    btnMusic.addEventListener('click', () => {
      Audio.toggleMusicMute();
      Audio.playUiClick();
      syncToggleButtons();
    });
  }

  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      Audio.toggleSfxMute();
      syncToggleButtons();
    });
  }

  if (btnGuide) {
    btnGuide.addEventListener('click', () => {
      Audio.playUiClick();
      guidePanel.classList.remove('hidden');
    });
  }
  if (btnCloseGuide) {
    btnCloseGuide.addEventListener('click', () => {
      Audio.playUiClick();
      guidePanel.classList.add('hidden');
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

  // Boot
  renderLevelGrid();
  initLevel(1);
  requestAnimationFrame(loop);
})();
