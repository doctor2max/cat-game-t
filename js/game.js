window.Game = window.Game || {};

(function () {
  const canvas = document.getElementById('gameCanvas');
  const LOGICAL_W = 1280;
  const LOGICAL_H = 720;
  const DEVICE_DPR = Math.min(window.devicePixelRatio || 1, 2);
  const RENDER_SCALE = Math.min(1.5, Math.max(1.15, DEVICE_DPR * 0.75)); // High-clarity Retina canvas while keeping smooth 60fps
  canvas.width = Math.round(LOGICAL_W * RENDER_SCALE);
  canvas.height = Math.round(LOGICAL_H * RENDER_SCALE);
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
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
  const I18n = window.Game.I18n;
  const t = (key, vars) => (I18n ? I18n.t(key, vars) : key);
  const TOTAL_STAGES = Store.TOTAL_STAGES;
  const STORY1_END = 15;

  // UI Elements
  const introLayer = document.getElementById('introLayer');
  const introHud = document.getElementById('introHud');
  const introVideo = document.getElementById('introVideo');
  const introCaption = document.getElementById('introCaption');
  const btnSkipIntro = document.getElementById('btnSkipIntro');

  const gameOverLayer = document.getElementById('gameOverLayer');
  const gameOverVideo = document.getElementById('gameOverVideo');
  const gameOverCaption = document.getElementById('gameOverCaption');
  const gameOverActions = document.getElementById('gameOverActions');
  const btnGameOverRevive = document.getElementById('btnGameOverRevive');
  const btnGameOverRestart = document.getElementById('btnGameOverRestart');
  const btnGameOverMenu = document.getElementById('btnGameOverMenu');

  const winLayer = document.getElementById('winLayer');
  const winVideo = document.getElementById('winVideo');
  const winCaption = document.getElementById('winCaption');
  const btnSkipWin = document.getElementById('btnSkipWin');
  const btnMenuLang = document.getElementById('btnMenuLang');
  const btnPauseLang = document.getElementById('btnPauseLang');

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
  const btnHudMusic = document.getElementById('btnHudMusic');
  const hudMusicIcon = document.getElementById('hudMusicIcon');
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

  // Always render Mashmasha using the pure programmatic articulated vector renderer
  window.Game.catRenderMode = 'procedural';

  // Video Caption Synchronization Helper (for Intro, Game Over, Win1, Win2)
  let activeWinClipKey = 'win1';
  function updateVideoCaption(videoEl, captionEl, videoKey) {
    if (!captionEl || !videoEl || !I18n) return;
    const text = I18n.getVideoCaption(videoKey, videoEl.currentTime || 0);
    if (text) {
      captionEl.textContent = text;
      captionEl.classList.remove('hidden');
    } else {
      captionEl.classList.add('hidden');
    }
  }
  let activeIntroCaptionKey = 'intro';
  if (introVideo) {
    introVideo.addEventListener('timeupdate', () => updateVideoCaption(introVideo, introCaption, activeIntroCaptionKey));
    introVideo.addEventListener('loadeddata', () => updateVideoCaption(introVideo, introCaption, activeIntroCaptionKey));
    introVideo.addEventListener('play', () => updateVideoCaption(introVideo, introCaption, activeIntroCaptionKey));
  }
  if (gameOverVideo) {
    gameOverVideo.addEventListener('timeupdate', () => updateVideoCaption(gameOverVideo, gameOverCaption, 'gameover'));
    gameOverVideo.addEventListener('loadeddata', () => updateVideoCaption(gameOverVideo, gameOverCaption, 'gameover'));
    gameOverVideo.addEventListener('play', () => updateVideoCaption(gameOverVideo, gameOverCaption, 'gameover'));
  }
  if (winVideo) {
    winVideo.addEventListener('timeupdate', () => updateVideoCaption(winVideo, winCaption, activeWinClipKey));
    winVideo.addEventListener('loadeddata', () => updateVideoCaption(winVideo, winCaption, activeWinClipKey));
    winVideo.addEventListener('play', () => updateVideoCaption(winVideo, winCaption, activeWinClipKey));
  }
  if (winLayer && winVideo) {
    winLayer.addEventListener('pointerdown', (e) => {
      if (e.target === btnSkipWin) return;
      if (winVideo.muted) winVideo.muted = false;
      if (winVideo.paused && !winLayer.classList.contains('hidden')) {
        winVideo.play().catch(() => {});
      }
    });
  }
  if (gameOverLayer && gameOverVideo) {
    gameOverLayer.addEventListener('pointerdown', () => {
      if (gameOverVideo.muted) gameOverVideo.muted = false;
    });
  }

  function refreshAllLocalizedUI() {
    if (I18n) I18n.applyDom();
    if (pauseStageTag) pauseStageTag.textContent = t('stage_n', { n: currentStage });
    if (btnPauseRefill) {
      btnPauseRefill.textContent = t('pause_refill', { cost: Store.LIFE_REFILL_COST });
    }
    if (btnGameOverRevive) {
      btnGameOverRevive.textContent = t('gameover_revive', { cost: Store.LIFE_REFILL_COST });
    }
    renderLevelGrid();
    if (shopOverlay && !shopOverlay.classList.contains('hidden')) {
      renderShopContent();
    }
  }

  function toggleLanguage() {
    if (!I18n) return;
    const next = I18n.isEn() ? 'ar' : 'en';
    I18n.setLang(next);
    Audio.ensureCtx();
    Audio.playUiClick();
    haptic(8);
    refreshAllLocalizedUI();
    showToast(t('toast_lang_switched'));
  }

  if (btnMenuLang) btnMenuLang.addEventListener('click', toggleLanguage);
  if (btnPauseLang) btnPauseLang.addEventListener('click', toggleLanguage);

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
    const visibleStages = Store.getVisibleStages ? Store.getVisibleStages() : TOTAL_STAGES;
    if (menuCoinsCount) menuCoinsCount.textContent = String(coins);
    if (hudCoinsCount) hudCoinsCount.textContent = String(coins);
    if (shopCoinsCount) shopCoinsCount.textContent = String(coins);
    if (menuStarsCount) menuStarsCount.textContent = `${Store.getTotalStars()}/${visibleStages * 3}`;
    const brandSub = document.querySelector('.brand-sub');
    if (brandSub) {
      const isEn = I18n && I18n.getLang && I18n.getLang() === 'en';
      brandSub.textContent = isEn
        ? `Seven Lives • ${visibleStages} Stages`
        : `سبعة أرواح • ${visibleStages} مرحلة`;
    }
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

    const visibleStages = Store.getVisibleStages ? Store.getVisibleStages() : TOTAL_STAGES;
    for (let s = 1; s <= visibleStages; s++) {
      if (s === 1 || s === STORY1_END + 1) {
        const hdr = document.createElement('div');
        hdr.className = 'level-chapter-header' + (s > STORY1_END ? ' chapter-2' : '');
        hdr.textContent = s === 1 ? t('chapter_1_title') : t('chapter_2_title');
        levelGrid.appendChild(hdr);
      }
      const locked = s > maxUnlocked;
      const cleared = Store.isStageCleared(s);
      const isCurrent = s === nextPlayStage && !cleared;
      const stars = Store.getStageStars(s);

      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className =
        'level-tile ' +
        (locked ? 'locked' : isCurrent ? 'current' : cleared ? 'completed' : 'unlocked');
      tile.setAttribute('aria-label', t('stage_n', { n: s }));

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
          showToast(t('toast_stage_locked'));
          return;
        }
        Audio.playUiClick();
        haptic(10);
        startStageFromMenu(s);
      });

      levelGrid.appendChild(tile);
    }

    if (btnQuickPlay) {
      btnQuickPlay.textContent = t('menu_quick_play', { n: nextPlayStage });
      btnQuickPlay.dataset.targetStage = String(nextPlayStage);
    }
    syncCoinDisplays();
  }

  function startStageFromMenu(stageNum) {
    const visibleStages = Store.getVisibleStages ? Store.getVisibleStages() : TOTAL_STAGES;
    if (stageNum > visibleStages) return;
    startOverlay.classList.add('hidden');
    initLevel(stageNum);
    if (stageNum === 1) {
      startIntroSequence();
    } else if (stageNum === STORY1_END + 1) {
      startSeason2IntroSequence();
    } else {
      enterGameplay();
    }
  }

  // Universal Checkpoint Safe Zone Enforcement (guarantees 100% of checkpoints in ALL Stages 1-23 remain completely enemy-free & hazard-free!)
  const CP_SAFE_HALF_W = 108;

  function isInCheckpointSafeZone(lv, x, y, w = 48, h = 40) {
    if (!lv || !lv.checkpoints) return null;
    const cx = x + w / 2;
    const bottomY = y + h;
    for (const cp of lv.checkpoints) {
      const cpCx = cp.x + 20;
      const cpBottom = cp.y + 32;
      if (Math.abs(bottomY - cpBottom) < 80 && Math.abs(cx - cpCx) < CP_SAFE_HALF_W) {
        return cp;
      }
    }
    return null;
  }

  // Runtime barrier ensuring no moving, chasing, repelled, distracted, rolling, or swooping enemy can ever enter a checkpoint zone
  function guardCheckpointZone(lv, e, isCenterBased = false) {
    if (!lv || !lv.checkpoints || !e) return;
    if (isCenterBased && e.x === undefined) return;
    const ew = isCenterBased ? (e.r || 18) * 2 : (e.w || 44);
    const eh = isCenterBased ? (e.r || 18) * 2 : (e.h || 38);
    const left = isCenterBased ? e.x - ew * 0.5 : e.x;
    const rawY = isCenterBased
      ? (e.curY !== undefined ? e.curY : e.y) - eh * 0.5
      : (e.y !== undefined ? e.y : (e.baseY || 0)) - (e.hopY || 0);

    for (const cp of lv.checkpoints) {
      const cpCx = cp.x + 20;
      const cpTop = cp.y - 82;
      const cpBottom = cp.y + 52;
      if (rawY + eh < cpTop || rawY > cpBottom) continue;

      const zoneLeft = cpCx - CP_SAFE_HALF_W;
      const zoneRight = cpCx + CP_SAFE_HALF_W;
      if (left + ew > zoneLeft && left < zoneRight) {
        const enemyCx = left + ew * 0.5;
        if (enemyCx <= cpCx) {
          const clampedLeft = zoneLeft - ew;
          e.x = isCenterBased ? clampedLeft + ew * 0.5 : clampedLeft;
          e.facing = -1;
          if (e.vx !== undefined) e.vx = -Math.abs(e.vx);
          if (e.dir !== undefined) e.dir = -1;
          if (e.repelTimer > 0) e.repelDir = -1;
        } else {
          const clampedLeft = zoneRight;
          e.x = isCenterBased ? clampedLeft + ew * 0.5 : clampedLeft;
          e.facing = 1;
          if (e.vx !== undefined) e.vx = Math.abs(e.vx);
          if (e.dir !== undefined) e.dir = 1;
          if (e.repelTimer > 0) e.repelDir = 1;
        }
        if (e.alert) e.alert = false;
        if (e.state === 'alert' || e.state === 'distracted') e.state = 'patrol';
        if (e.awake) {
          e.awake = false;
          if (e.homeX !== undefined) e.returning = Math.abs(e.homeX - e.x) > 3;
        }
        if (e.swooping) {
          e.swooping = false;
          if (e.baseY !== undefined) e.y = e.baseY;
        }
        if (isCenterBased && e.waiting !== undefined) {
          e.waiting = true;
          e.waitTimer = e.respawnDelay || 1.4;
        }
      }
    }
  }
  window.Game.guardCheckpointZone = guardCheckpointZone;

  function enforceCheckpointSafeZones(lv) {
    if (!lv || !lv.checkpoints) return;

    // 1. Standard minX..maxX Ground Patrols, Chasers, & Flyers across ALL 24 Stages
    const patrolEntries = [
      { list: lv.dogs }, { list: lv.hedgehogs }, { list: lv.crabs }, { list: lv.rats },
      { list: lv.raccoons }, { list: lv.porcupines }, { list: lv.security_bots },
      { list: lv.foxes, hop: 46 }, { list: lv.clockwork_beetles }, { list: lv.skunks, extraX: 58 },
      { list: lv.badgers }, { list: lv.bridge_rovers }, { list: lv.dobermans },
      { list: lv.rival_cats }, { list: lv.hover_saws }, { list: lv.penguins },
      { list: lv.seals, hop: 28 }, { list: lv.unicycle_monkeys }, { list: lv.circus_clowns },
      { list: lv.sleeping_lions }, { list: lv.scorpions }, { list: lv.sand_vipers },
      { list: lv.desert_falcons, swoop: 160 }, { list: lv.dust_devils },
      { list: lv.tanuki_rascals }, { list: lv.shiba_guards }, { list: lv.samurai_crows, swoop: 160 },
      { list: lv.rail_inspectors }, { list: lv.mail_owls },
      { list: lv.carnival_jesters }, { list: lv.canal_crabs }, { list: lv.venice_gulls },
      { list: lv.paris_poodles }, { list: lv.paris_bakers }, { list: lv.paris_pigeons },
      { list: lv.morocco_monkeys }, { list: lv.morocco_merchants }, { list: lv.morocco_storks },
      { list: lv.maya_jaguars }, { list: lv.maya_warriors }, { list: lv.maya_quetzals, swoop: 150 },
      { list: lv.greece_goats }, { list: lv.greece_hoplites }, { list: lv.greece_owls, swoop: 0 },
      { list: lv.battir_porcupines }, { list: lv.battir_hyraxes }, { list: lv.battir_kestrels, swoop: 0 },
      { list: lv.crows }, { list: lv.pigeons }, { list: lv.seagulls },
      { list: lv.falcons }, { list: lv.bats }, { list: lv.owls },
      { list: lv.pelicans }, { list: lv.hawks }, { list: lv.drones },
    ];

    for (const entry of patrolEntries) {
      const list = entry.list;
      if (!list) continue;
      const extraX = entry.extraX || 0;
      for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i];
        if (e.minX === undefined || e.maxX === undefined) continue;
        const ew = e.w || 48;
        const eh = e.h || 40;
        const baseEy = e.baseY !== undefined ? e.baseY : e.y;
        const downSwoop = Math.max(e.amp || 0, e.dip || 0, e.bobAmp || 0, e.ampY || 0, entry.swoop || 0);
        const upReach = Math.max(e.amp || 0, e.bobAmp || 0, e.ampY || 0, entry.hop || 0);
        for (const cp of lv.checkpoints) {
          const cpCx = cp.x + 20;
          const cpBottom = cp.y + 32;
          const lowBottom = baseEy + downSwoop + eh;
          const highTop = baseEy - upReach;
          if (lowBottom < cp.y - 82 || highTop > cpBottom + 50) continue;
          const safeLeft = cpCx - CP_SAFE_HALF_W - extraX - ew;
          const safeRight = cpCx + CP_SAFE_HALF_W + extraX;
          if (e.maxX > safeLeft && e.minX < safeRight) {
            const leftRoom = safeLeft - e.minX;
            const rightRoom = e.maxX - safeRight;
            if (rightRoom >= leftRoom) {
              e.minX = Math.max(e.minX, safeRight);
            } else {
              e.maxX = Math.min(e.maxX, safeLeft);
            }
            if (e.maxX - e.minX < 45) {
              list.splice(i, 1);
              break;
            }
            if (e.x < e.minX) e.x = e.minX;
            if (e.x > e.maxX) e.x = e.maxX;
            if (e.homeX !== undefined) {
              e.homeX = Math.max(e.minX, Math.min(e.maxX, e.homeX));
            }
          }
        }
      }
    }

    // 2. Center-based Rolling & Hopping Hazards (snowballs, daruma_rollers, coal_sparks)
    const rollerLists = [lv.snowballs, lv.daruma_rollers, lv.coal_sparks];
    for (const list of rollerLists) {
      if (!list) continue;
      for (let i = list.length - 1; i >= 0; i--) {
        const rObj = list[i];
        const rad = rObj.r || 18;
        const topY = rObj.y - rad - 28;
        const botY = rObj.y + rad;
        for (const cp of lv.checkpoints) {
          const cpCx = cp.x + 20;
          if (botY < cp.y - 82 || topY > cp.y + 82) continue;
          const safeLeft = cpCx - CP_SAFE_HALF_W - rad;
          const safeRight = cpCx + CP_SAFE_HALF_W + rad;
          if (rObj.maxX > safeLeft && rObj.minX < safeRight) {
            const leftRoom = safeLeft - rObj.minX;
            const rightRoom = rObj.maxX - safeRight;
            if (rightRoom >= leftRoom) {
              rObj.minX = Math.max(rObj.minX, safeRight);
            } else {
              rObj.maxX = Math.min(rObj.maxX, safeLeft);
            }
            if (rObj.maxX - rObj.minX < 65) {
              list.splice(i, 1);
              break;
            }
            if (rObj.startX !== undefined) {
              rObj.startX = (rObj.dir || -1) < 0 ? rObj.maxX : rObj.minX;
            }
            if (rObj.x !== undefined) {
              rObj.x = Math.max(rObj.minX, Math.min(rObj.maxX, rObj.x));
            }
          }
        }
      }
    }

    // 3. Figure-8 Oscillating Flyers (bees, luna_moths using baseX / rx)
    const oscLists = [lv.bees, lv.luna_moths];
    for (const list of oscLists) {
      if (!list) continue;
      for (let i = list.length - 1; i >= 0; i--) {
        const b = list[i];
        const rx = b.rx || 115;
        const ry = b.ry || 38;
        const bw = b.w || 36;
        const bh = b.h || 32;
        for (const cp of lv.checkpoints) {
          const cpCx = cp.x + 20;
          if (b.baseY + ry + bh < cp.y - 82 || b.baseY - ry > cp.y + 82) continue;
          const minBx = b.baseX - rx;
          const maxBx = b.baseX + rx + bw;
          const zoneL = cpCx - CP_SAFE_HALF_W;
          const zoneR = cpCx + CP_SAFE_HALF_W;
          if (maxBx > zoneL && minBx < zoneR) {
            if (b.baseX <= cpCx) {
              b.baseX = zoneL - bw - rx;
            } else {
              b.baseX = zoneR + rx;
            }
            if (b.baseX < 120 || b.baseX > (lv.width || 5000) - 120) {
              list.splice(i, 1);
              break;
            }
            b.x = b.baseX;
          }
        }
      }
    }

    // 4. Stationary / Vertical / Sweeping Hazards near Checkpoints
    const trimNearCp = (list, getBounds) => {
      if (!list) return;
      for (let i = list.length - 1; i >= 0; i--) {
        const b = getBounds(list[i]);
        for (const cp of lv.checkpoints) {
          const cpCx = cp.x + 20;
          if (b.bottom < cp.y - 82 || b.top > cp.y + 82) continue;
          if (b.right > cpCx - CP_SAFE_HALF_W && b.left < cpCx + CP_SAFE_HALF_W) {
            list.splice(i, 1);
            break;
          }
        }
      }
    };
    trimNearCp(lv.venus_traps, (v) => ({ left: v.x - 10, right: v.x + (v.w || 40) + 10, top: v.y - 26, bottom: v.y + (v.h || 36) }));
    trimNearCp(lv.fire_hoops, (f) => ({ left: f.x - (f.r || 36), right: f.x + (f.r || 36), top: f.y - (f.r || 36), bottom: f.y + (f.r || 36) }));
    trimNearCp(lv.falling_icicles, (ic) => ({ left: ic.x - 16, right: ic.x + 16, top: ic.y, bottom: ic.floorY || ic.y + 260 }));
    trimNearCp(lv.cyber_spiders, (sp) => ({ left: sp.x, right: sp.x + (sp.w || 36), top: sp.topY, bottom: sp.topY + (sp.dropDist || 180) + (sp.h || 32) }));
    trimNearCp(lv.tentacles, (t) => ({ left: t.x - 24, right: t.x + 24, top: t.baseY - (t.maxH || 130), bottom: t.baseY }));
    trimNearCp(lv.leaping_fish, (f) => ({ left: f.x - 24, right: f.x + 24, top: f.baseY - (f.jumpH || 220), bottom: f.baseY }));
    trimNearCp(lv.sweeping_lasers, (l) => {
      const span = Math.sin(l.sweep || 0.65) * (l.len || 240);
      return { left: l.x - span, right: l.x + span, top: l.y, bottom: l.y + (l.len || 240) };
    });
  }

  function initLevel(stageNum) {
    if (typeof stageNum === 'number') currentStage = stageNum;
    level = createLevelByNumber(currentStage);
    enforceCheckpointSafeZones(level);
    Store.ensureLevelCoins(level, currentStage);
    stageBadge.textContent = String(currentStage);
    if (pauseStageTag) pauseStageTag.textContent = t('stage_n', { n: currentStage });
    Audio.setMusicTrack(level.theme);

    catCtrl = window.Game.Cat(level.startX, level.startY);
    catCtrl.applyUpgrades(Store.getBonuses(), false);
    catCtrl.cat.winterOutfit = !!level.winterOutfit;
    catCtrl.cat.circusOutfit = !!level.circusOutfit;
    catCtrl.cat.desertOutfit = !!level.desertOutfit;
    catCtrl.cat.japanOutfit = !!level.japanOutfit;
    catCtrl.cat.conductorOutfit = !!level.conductorOutfit;
    catCtrl.cat.veniceOutfit = !!level.veniceOutfit;
    catCtrl.cat.parisOutfit = !!level.parisOutfit;
    catCtrl.cat.moroccoOutfit = !!level.moroccoOutfit;
    catCtrl.cat.mayaOutfit = !!level.mayaOutfit;
    catCtrl.cat.greeceOutfit = !!level.greeceOutfit;
    catCtrl.cat.battirOutfit = !!level.battirOutfit;

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
    if (pauseStageTag) pauseStageTag.textContent = t('stage_n', { n: currentStage });

    // Show life refill option if missing lives
    if (btnPauseRefill && catCtrl) {
      const needsLives = catCtrl.cat.lives < catCtrl.cat.maxLives;
      btnPauseRefill.classList.toggle('hidden', !needsLives);
      btnPauseRefill.textContent = t('pause_refill', { cost: Store.LIFE_REFILL_COST });
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
    const mMuted = Audio.isMusicMuted();
    if (btnDimBg) btnDimBg.classList.toggle('active', dimBackground);
    if (btnMusic) btnMusic.classList.toggle('muted', mMuted);
    if (btnHudMusic) btnHudMusic.classList.toggle('muted', mMuted);
    if (hudMusicIcon) hudMusicIcon.textContent = mMuted ? '🔇' : '🎵';
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
      for (const rawU of Store.UPGRADES) {
        const u = I18n ? I18n.getShopUpgrade(rawU) : rawU;
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
            ${isMax ? t('shop_maxed') : `${cost} <span class="gold-coin-icon">★</span>`}
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
              showToast(t('toast_upgraded', { name: u.name, lv: res.level }));
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

      for (const rawS of Store.SKINS) {
        const s = I18n ? I18n.getShopSkin(rawS) : rawS;
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
            ${isEquipped ? t('shop_equipped') : owned ? t('shop_equip') : `${t('shop_unlock_cost', { cost: s.cost })} <span class="gold-coin-icon">★</span>`}
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
            showToast(res.action === 'bought' ? t('toast_skin_bought', { name: s.name }) : t('toast_skin_equipped', { name: s.name }));
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
            <div class="shop-item-title">${t('shop_daily_title')}</div>
            <div class="shop-item-desc">${t('shop_daily_desc', { amount: Store.DAILY_BONUS_AMOUNT })}</div>
          </div>
        </div>
        <button class="ios-btn ${dailyAvailable ? 'ios-btn-gold' : 'maxed'} shop-buy-btn" type="button" ${!dailyAvailable ? 'disabled' : ''}>
          ${dailyAvailable ? `+${Store.DAILY_BONUS_AMOUNT} <span class="gold-coin-icon">★</span>` : t('shop_daily_claimed')}
        </button>
      `;
      dailyCard.querySelector('button').addEventListener('click', () => {
        const res = Store.claimDailyBonus();
        if (res.ok) {
          Audio.playPurchase();
          haptic(18);
          showToast(t('toast_daily_claimed', { amount: res.amount }));
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
            <div class="shop-item-title">${allUnlocked ? t('shop_unlock_all') : t('shop_unlock_next', { n: nextLocked })}</div>
            <div class="shop-item-desc">${t('shop_unlock_desc')}</div>
          </div>
        </div>
        <button class="ios-btn ${allUnlocked ? 'maxed' : 'ios-btn-gold'} shop-buy-btn" type="button" ${allUnlocked || coins < Store.UNLOCK_STAGE_COST ? 'disabled' : ''}>
          ${allUnlocked ? t('shop_unlocked_badge') : `${Store.UNLOCK_STAGE_COST} <span class="gold-coin-icon">★</span>`}
        </button>
      `;
      unlockCard.querySelector('button').addEventListener('click', () => {
        const res = Store.unlockNextStageWithCoins();
        if (res.ok) {
          Audio.playPurchase();
          haptic(20);
          showToast(t('toast_stage_unlocked', { n: res.unlockedStage }));
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
              <div class="shop-item-title">${t('shop_refill_title')}</div>
              <div class="shop-item-desc">${t('shop_refill_desc')}</div>
            </div>
          </div>
          <button class="ios-btn ${full ? 'maxed' : 'ios-btn-gold'} shop-buy-btn" type="button" ${full || coins < Store.LIFE_REFILL_COST ? 'disabled' : ''}>
            ${full ? t('shop_refill_full') : `${Store.LIFE_REFILL_COST} 🪙`}
          </button>
        `;
        refillCard.querySelector('button').addEventListener('click', () => {
          if (Store.spendCoins(Store.LIFE_REFILL_COST)) {
            catCtrl.cat.lives = catCtrl.cat.maxLives;
            if (catCtrl.cat.shieldEnabled) catCtrl.cat.shieldActive = true;
            Audio.playPurchase();
            haptic(16);
            updateHUD();
            showToast(t('toast_lives_refilled'));
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
    if (introCaption) introCaption.classList.add('hidden');
    if (introHud) introHud.classList.add('hidden');
    introVideo.onended = null;
    introVideo.onerror = null;
    introVideo.pause();
    hud.classList.remove('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    Audio.startMusic();
    lastTime = 0;
    running = true;
    Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, t('stage_n', { n: currentStage }), '#7dd3fc');
  }

  function startIntroSequence() {
    startOverlay.classList.add('hidden');
    Audio.pauseMusic();
    activeIntroCaptionKey = 'intro';
    if (introHud) introHud.classList.remove('hidden');
    introVideo.muted = false;
    introVideo.src = 'videos/intro.mp4';
    introVideo.currentTime = 0;
    introLayer.classList.remove('hidden');
    updateVideoCaption(introVideo, introCaption, 'intro');

    const fallbackToCanvasIntro = () => {
      introLayer.classList.add('hidden');
      if (introCaption) introCaption.classList.add('hidden');
      playingCanvasIntro = true;
      canvasIntroTimer = 0;
    };

    introVideo.onerror = fallbackToCanvasIntro;
    introVideo.onended = () => {
      enterGameplay();
    };
    const playPromise = introVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Retry muted if browser autoplay policy blocks unmuted playback
        introVideo.muted = true;
        introVideo.play().catch(fallbackToCanvasIntro);
      });
    }
  }

  function startSeason2IntroSequence() {
    startOverlay.classList.add('hidden');
    Audio.pauseMusic();
    if (introHud) introHud.classList.remove('hidden');
    introLayer.classList.remove('hidden');
    if (introCaption) introCaption.classList.add('hidden');

    const clips = ['videos/introS2-1.mp4', 'videos/introS2-2.mp4'];
    let idx = 0;

    const playNextClip = () => {
      if (idx >= clips.length) {
        enterGameplay();
        return;
      }
      activeIntroCaptionKey = idx === 0 ? 'introS2_1' : 'introS2_2';
      introVideo.muted = false;
      introVideo.src = clips[idx];
      introVideo.currentTime = 0;
      if (introVideo.load) introVideo.load();
      updateVideoCaption(introVideo, introCaption, activeIntroCaptionKey);

      const advance = () => {
        idx += 1;
        playNextClip();
      };
      introVideo.onended = advance;
      introVideo.onerror = advance;

      const playPromise = introVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          introVideo.muted = true;
          introVideo.play().catch(advance);
        });
      }
    };

    playNextClip();
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
    Particles.spawnPopup(mx, c.y - 16, t('popup_meow'), '#ffd60a');

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
        Particles.spawnPopup(dogCx, dog.y - 14, t('popup_repel'), '#7dd3fc');
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

    // Repel all extended Stage 9-24 enemies as well!
    if (EnemiesExt && EnemiesExt.applyMeowRepel) {
      EnemiesExt.applyMeowRepel(level, mx, my, range, Particles);
    }

    // Shatter nearby Mayan blowgun darts & counter Greek Stage 25 hazards with Repelling Meow!
    if (level && level.platforms) {
      const isEn = window.Game.I18n && window.Game.I18n.isEn();
      for (const p of level.platforms) {
        if (p.type === 'maya_dart_totem' && p.darts && p.darts.length) {
          for (let di = p.darts.length - 1; di >= 0; di--) {
            const d = p.darts[di];
            if (Math.hypot(mx - d.x, my - d.y) < range) {
              Particles.spawnDust(d.x, d.y, 8, d.high ? '#38bdf8' : '#fde047');
              Particles.spawnPopup(d.x, d.y - 10, '💥', '#34d399');
              p.darts.splice(di, 1);
            }
          }
        } else if (p.type === 'greece_medusa_aegis') {
          const mCx = p.x + p.w * 0.5, mCy = p.y + p.h * 0.45;
          if (Math.hypot(mx - mCx, my - mCy) < range + 28 && !(p.stunTimer > 0.2)) {
            p.stunTimer = 3.2;
            p.gazeState = 'stunned';
            Particles.spawnDust(mCx, mCy, 10, '#34d399');
            Particles.spawnPopup(mCx, p.y - 12, isEn ? '✨ Aegis Blinded!' : '✨ أُغلقت عين ميدوسا!', '#6ee7b7');
          }
        } else if (p.type === 'greece_discobolus' && p.discActive && !p.deflected) {
          if (Math.hypot(mx - (p.discX || 0), my - (p.discY || 0)) < range + 16) {
            p.deflected = true;
            p.discActive = false;
            Particles.spawnDust(p.discX, p.discY, 10, '#fde047');
            Particles.spawnPopup(p.discX, p.discY - 12, isEn ? '💥 Deflected!' : '💥 ارتدّ القرص!', '#fde047');
          }
        } else if (p.type === 'greece_zeus_obelisk' && (p.boltState === 'track' || p.boltState === 'lock')) {
          const zCx = p.strikeX !== undefined ? p.strikeX : (p.x + p.w * 0.5);
          if (Math.hypot(mx - zCx, my - (p.y + p.h - 32)) < range + 26) {
            p.boltState = 'cooldown';
            p.boltTimer = 2.6;
            Particles.spawnDust(zCx, p.y - 40, 10, '#7dd3fc');
            Particles.spawnPopup(zCx, p.y - 16, isEn ? '⚡ Cloud Dispersed!' : '⚡ تبددت الصاعقة!', '#7dd3fc');
          }
        } else if (p.type === 'battir_roman_bath_vent') {
          const bCx = p.x + p.w * 0.5;
          const bCy = p.y + p.h - 24;
          if (Math.hypot(mx - bCx, my - bCy) < range + 45) {
            p.boostTimer = 3.6;
            Particles.spawnDust(bCx, bCy - 18, 12, '#fef08a');
            Particles.spawnPopup(bCx, bCy - 36, isEn ? '♨️ Roman Bath Steam!' : '♨️ بخار الحمام الروماني!', '#fde047');
          }
        } else if (p.type === 'battir_railway_semaphore') {
          const sCx = p.x + p.w * 0.5;
          const sCy = p.y + p.h - 48;
          if (Math.hypot(mx - sCx, my - sCy) < range + 55 && !(p.greenTimer > 0.2)) {
            p.greenTimer = 3.8;
            p.semState = 'green';
            Particles.spawnDust(sCx, p.y + 28, 12, '#4ade80');
            Particles.spawnPopup(sCx, p.y + 8, isEn ? '🟢 Green Rail Signal!' : '🟢 إشارة السكة خضراء!', '#4ade80');
          }
        } else if (p.type === 'battir_aqueduct_surge' && p.waveActive && !p.waveCalmed) {
          if (Math.hypot(mx - (p.waveX || p.x), my - (p.y + p.h - 14)) < range + 26) {
            p.waveCalmed = true;
            p.waveActive = false;
            Particles.spawnDust(p.waveX || p.x, p.y + p.h - 16, 10, '#7dd3fc');
            Particles.spawnPopup(p.waveX || p.x, p.y - 6, isEn ? '💧 Canal Wave Calmed!' : '💧 هدأت موجة المعدود!', '#7dd3fc');
          }
        }
      }
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
          dog.x = Math.max(dog.minX, Math.min(dog.maxX, dog.x + dog.facing * 85 * dt));
        }
        if (dog.stateTimer <= 0) dog.state = 'patrol';
      } else if (dist < sightRange && sameHeight && facingCat && c.invulnTimer <= 0 && !isInCheckpointSafeZone(level, c.x, c.y, c.w, c.h)) {
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

      guardCheckpointZone(level, dog, false);

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
        guardCheckpointZone(level, e, false);
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
      guardCheckpointZone(level, e, false);
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
        guardCheckpointZone(level, f, false);
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
      guardCheckpointZone(level, f, false);
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
        guardCheckpointZone(level, rat, false);
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
      guardCheckpointZone(level, rat, false);
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
      } else if (p.type === 'pendulum_censer') {
        const ang = Math.sin(timeSec * (p.swingSpeed || 2.0) + (p.phase || 0)) * (p.maxAngle || 0.90);
        const len = p.chainLen || 168;
        const px0 = p.pivotX !== undefined ? p.pivotX : p.x + p.w / 2;
        const py0 = p.pivotY !== undefined ? p.pivotY : p.y;
        const bx = px0 + Math.sin(ang) * len;
        const by = py0 + Math.cos(ang) * len;
        p.bobX = bx;
        p.bobY = by;
        p.curAngle = ang;
        const topY = c.crouching ? c.y + 18 : c.y + 6;
        const nearX = Math.max(c.x + 6, Math.min(bx, c.x + c.w - 6));
        const nearY = Math.max(topY, Math.min(by, c.y + c.h - 4));
        if (Math.hypot(bx - nearX, by - nearY) < (p.bobR || 22) - 3) {
          onCatHit('مبخرة متأرجحة! -1 ❤️');
        }
      } else if (p.type === 'carnival_bell_swing') {
        const ang = Math.sin(timeSec * (p.swingSpeed || 1.9) + (p.phase || 0)) * (p.maxAngle || 0.84);
        const len = p.chainLen || 182;
        const px0 = p.pivotX !== undefined ? p.pivotX : p.x + p.w / 2;
        const py0 = p.pivotY !== undefined ? p.pivotY : p.y;
        const bx = px0 + Math.sin(ang) * len;
        const by = py0 + Math.cos(ang) * len;
        p.bobX = bx; p.bobY = by; p.curAngle = ang;
        const topY = c.crouching ? c.y + 18 : c.y + 6;
        const nearX = Math.max(c.x + 6, Math.min(bx, c.x + c.w - 6));
        const nearY = Math.max(topY, Math.min(by, c.y + c.h - 4));
        if (Math.hypot(bx - nearX, by - nearY) < (p.bobR || 23) - 3) {
          onCatHit('جرس البندقية المتأرجح! -1 ❤️');
        }
      } else if (p.type === 'maya_dart_totem') {
        // Carved Mayan Chaac Blowgun Totem: alternates LOW (jump over!) & HIGH (crouch/sneak under!) obsidian darts!
        if (!p.darts) p.darts = [];
        const period = p.period || 2.35;
        const cyc = (timeSec + (p.phase || 0)) % period;
        const shotIdx = Math.floor((timeSec + (p.phase || 0)) / period);
        const nextIsHigh = p.dartMode === 'high' ? true : p.dartMode === 'low' ? false : (shotIdx % 2 === 1);
        p.warnHigh = nextIsHigh;
        p.warnRatio = cyc >= period - 0.62 ? (cyc - (period - 0.62)) / 0.62 : 0;
        if (p.lastShotIdx === undefined) p.lastShotIdx = shotIdx;
        if (shotIdx > p.lastShotIdx) {
          p.lastShotIdx = shotIdx;
          const fDir = p.fireDir || -1;
          const fireHigh = p.dartMode === 'high' ? true : p.dartMode === 'low' ? false : ((shotIdx - 1) % 2 === 1);
          const muzzleX = fDir > 0 ? p.x + p.w + 4 : p.x - 4;
          const muzzleY = fireHigh ? (p.y + p.h - 49) : (p.y + p.h - 19);
          p.darts.push({
            x: muzzleX,
            y: muzzleY,
            startX: muzzleX,
            vx: fDir * (p.dartSpeed || 305),
            high: fireHigh,
            maxDist: p.maxRange || 430,
          });
          p.muzzleFlash = 1.0;
        }
        if (p.muzzleFlash > 0) p.muzzleFlash = Math.max(0, p.muzzleFlash - dt * 4.5);

        const catTop = c.crouching ? c.y + 22 : c.y + 5;
        const catBot = c.y + c.h - 3;
        for (let di = p.darts.length - 1; di >= 0; di--) {
          const d = p.darts[di];
          d.x += d.vx * dt;
          if (
            Math.abs(d.x - d.startX) >= d.maxDist ||
            isInCheckpointSafeZone(level, d.x - 12, d.y - 6, 24, 12)
          ) {
            p.darts.splice(di, 1);
            continue;
          }
          if (
            d.x + 11 > c.x + 7 &&
            d.x - 11 < c.x + c.w - 7 &&
            d.y + 4 > catTop &&
            d.y - 4 < catBot
          ) {
            Particles.spawnDust(d.x, d.y, 7, d.high ? '#38bdf8' : '#fde047');
            p.darts.splice(di, 1);
            onCatHit('سهم الأوبسيديان! -1 ❤️');
          }
        }
      } else if (p.type === 'greece_medusa_aegis') {
        // 1. GORGONEION MEDUSA AEGIS: Gaze-check petrification cone! Look away (turn back), crouch low, or Meow to counter!
        if (p.stunTimer > 0) {
          p.stunTimer = Math.max(0, p.stunTimer - dt);
          p.gazeState = 'stunned';
          p.gazeRatio = 0;
        } else {
          const period = p.period || 4.5;
          const cyc = (timeSec + (p.phase || 0)) % period;
          const cycIdx = Math.floor((timeSec + (p.phase || 0)) / period);
          if (cyc < 2.15) {
            p.gazeState = 'dormant';
            p.gazeRatio = 0;
          } else if (cyc < 3.05) {
            p.gazeState = 'warn';
            p.gazeRatio = (cyc - 2.15) / 0.90;
          } else {
            p.gazeState = 'active';
            p.gazeRatio = 1;
            const gDir = p.gazeDir || -1;
            const gRange = p.gazeRange || 220;
            const eyeX = gDir < 0 ? p.x + 4 : p.x + p.w - 4;
            const minX = gDir < 0 ? eyeX - gRange : eyeX;
            const maxX = gDir < 0 ? eyeX : eyeX + gRange;
            const catCx = c.x + c.w * 0.5;
            const catTop = c.crouching ? c.y + 22 : c.y + 5;
            const beamBot = p.y + p.h - 28; // Standing catTop (groundY-39) is inside; crouching catTop (groundY-22) ducks safely below!
            const beamTop = p.y - 6;
            if (catCx > minX + 8 && catCx < maxX - 6 && catTop < beamBot && c.y + c.h > beamTop) {
              if (c.facing === -gDir) {
                // Mashmasha is looking straight into Medusa's eyes!
                Particles.spawnDust(catCx, c.y + 18, 9, '#a7f3d0');
                onCatHit('نظرة ميدوسا المتحجرة! أشِح بنظرك أو انحنِ -1 ❤️');
              } else if (p.evadedCycle !== cycIdx) {
                // Clever counterplay: Mashmasha turned her back to Medusa's gaze!
                p.evadedCycle = cycIdx;
                const isEn = window.Game.I18n && window.Game.I18n.isEn();
                Particles.spawnPopup(catCx, c.y - 12, isEn ? '🙈 Looked Away!' : '🙈 أشاحت بنظرها!', '#6ee7b7');
              }
            }
          }
        }
      } else if (p.type === 'greece_discobolus') {
        // 2. OLYMPIC BRONZE DISCOBOLUS: Hurls a Boomerang Discus LOW outward (jump!) that curves UP and sweeps HIGH back (crouch/duck!)
        const period = p.period || 3.9;
        const cyc = (timeSec + (p.phase || 0)) % period;
        const throwIdx = Math.floor((timeSec + (p.phase || 0)) / period);
        if (p.lastThrowIdx !== throwIdx) {
          p.lastThrowIdx = throwIdx;
          p.deflected = false;
        }
        const tDir = p.throwDir || -1;
        const dist = p.throwDist || 255;
        const floorY = p.y + p.h;
        const handX = p.x + p.w * 0.5 + tDir * 16;

        if (cyc < 0.85 || p.deflected || cyc >= 3.55) {
          p.pose = 'idle';
          p.windupRatio = 0;
          p.discActive = false;
        } else if (cyc < 1.55) {
          p.pose = 'windup';
          p.windupRatio = (cyc - 0.85) / 0.70;
          p.discActive = false;
        } else {
          const u = (cyc - 1.55) / 2.00; // 0..1 boomerang flight
          p.pose = u < 0.78 ? 'throw' : 'catch';
          p.discActive = true;
          p.discU = u;
          const reach = Math.sin(u * Math.PI) * dist;
          const highBlend = u < 0.34 ? 0 : u > 0.64 ? 1 : (u - 0.34) / 0.30;
          const smoothHigh = highBlend * highBlend * (3 - 2 * highBlend);
          // Outward pass: floorY - 18 (jump over!); Return pass: floorY - 38 (crouch/sneak under!)
          p.discX = handX + tDir * reach;
          p.discY = (floorY - 18) - smoothHigh * 20;
          p.discHigh = smoothHigh > 0.55;
          p.discRot = timeSec * 18 * tDir;

          if (!isInCheckpointSafeZone(level, p.discX - 16, p.discY - 8, 32, 16)) {
            const catTop = c.crouching ? c.y + 22 : c.y + 5;
            const catBot = c.y + c.h - 3;
            if (
              p.discX + 14 > c.x + 7 &&
              p.discX - 14 < c.x + c.w - 7 &&
              p.discY + 5.5 > catTop &&
              p.discY - 5.5 < catBot
            ) {
              Particles.spawnDust(p.discX, p.discY, 8, '#fde047');
              p.deflected = true;
              p.discActive = false;
              onCatHit('القرص الأولمبي المرتدّ! -1 ❤️');
            }
          }
        }
      } else if (p.type === 'greece_zeus_obelisk') {
        // 3. ALTAR OF ZEUS OBELISK: Summons a sky-tracking storm cloud that locks onto floor X, telegraphs, then strikes vertically!
        if (!p.boltState) {
          p.boltState = 'idle';
          p.boltTimer = 0;
          p.strikeX = p.x + p.w * 0.5;
        }
        const obCx = p.x + p.w * 0.5;
        const floorY = p.y + p.h;
        const zRad = p.zoneRadius || 210;
        const catCx = c.x + c.w * 0.5;
        const inZone = Math.abs(catCx - obCx) <= zRad && Math.abs((c.y + c.h) - floorY) < 190;

        if (p.boltState === 'idle') {
          if (inZone) {
            p.boltState = 'track';
            p.boltTimer = 0.48;
            p.strikeX = Math.max(obCx - zRad + 20, Math.min(obCx + zRad - 20, catCx));
          }
        } else if (p.boltState === 'track') {
          const targetX = Math.max(obCx - zRad + 20, Math.min(obCx + zRad - 20, catCx));
          p.strikeX += (targetX - p.strikeX) * Math.min(1, dt * 8.5);
          p.boltTimer -= dt;
          if (p.boltTimer <= 0) {
            p.boltState = 'lock';
            p.boltTimer = 0.66; // Stationary golden warning ring so player can dash/jump clear!
          }
        } else if (p.boltState === 'lock') {
          p.boltTimer -= dt;
          p.lockRatio = 1 - Math.max(0, p.boltTimer / 0.66);
          if (p.boltTimer <= 0) {
            p.boltState = 'strike';
            p.boltTimer = 0.36;
            Particles.spawnDust(p.strikeX, floorY - 6, 12, '#fef08a');
          }
        } else if (p.boltState === 'strike') {
          p.boltTimer -= dt;
          p.strikeAlpha = Math.max(0, p.boltTimer / 0.36);
          if (
            p.boltTimer > 0.08 &&
            !isInCheckpointSafeZone(level, p.strikeX - 22, floorY - 220, 44, 220) &&
            Math.abs(catCx - p.strikeX) < 22 &&
            c.y + c.h > floorY - 245 &&
            c.y < floorY + 8
          ) {
            onCatHit('صاعقة زيوس السماوية! -1 ❤️');
          }
          if (p.boltTimer <= 0) {
            p.boltState = 'cooldown';
            p.boltTimer = p.cooldown || 2.5;
          }
        } else if (p.boltState === 'cooldown') {
          p.boltTimer -= dt;
          if (p.boltTimer <= 0) p.boltState = 'idle';
        }
      } else if (p.type === 'battir_stone_roller') {
        const prevX = p.x;
        if (p.dir === undefined) p.dir = -1;
        const spd = p.speed || 135;
        p.x += p.dir * spd * dt;
        if (p.x <= p.minX) { p.x = p.minX; p.dir = 1; }
        else if (p.x >= p.maxX) { p.x = p.maxX; p.dir = -1; }
        const dx = p.x - prevX;
        p.wheelRot = (p.wheelRot || 0) + dx / Math.max(12, p.w * 0.5);
        const r = p.w * 0.5;
        const rCx = p.x + r, rCy = p.y + r;
        const catCx2 = c.x + c.w * 0.5, catCy2 = c.y + c.h * 0.5;
        if (!isInCheckpointSafeZone(level, p.x, p.y, p.w, p.h) && Math.hypot(catCx2 - rCx, catCy2 - rCy) < r + 14) {
          onCatHit('حجر معصرة الزيتون في بتّير! -1 ❤️');
        }
      } else if (p.type === 'battir_olive_press') {
        // Ancient Battir Lever-and-Counterweight Olive Press (معصرة الزيتون الأثرية):
        // Falling counterweight stone on right slams down, WHILE the left oak lever tail catapults Mashmasha skyward!
        const cyc = (gameTime + (p.phase || 0)) % 4.2;
        if (p.launchCd > 0) p.launchCd = Math.max(0, p.launchCd - dt);
        const prevState = p.pressState || 'rise';
        if (cyc < 1.9) {
          p.pressState = 'rise';
          p.pressDrop = Math.max(0, 1 - cyc / 1.7);
        } else if (cyc < 2.65) {
          p.pressState = 'warn';
          p.pressDrop = 0;
        } else if (cyc < 3.05) {
          p.pressState = 'slam';
          const u = (cyc - 2.65) / 0.4;
          p.pressDrop = Math.min(1, u * u * 1.35);
          if (prevState !== 'slam') {
            if (Audio.playStoneThud) Audio.playStoneThud();
            Particles.spawnDust(p.x + p.w - 34, p.y + p.h - 6, 12, '#a3e635');
          }
        } else {
          p.pressState = 'hold';
          p.pressDrop = 1;
        }
        const floorY = p.y + p.h;
        const catCx2 = c.x + c.w * 0.5;
        // 1. Slamming heavy limestone counterweight on right (x + 96 .. x + 156)
        if ((p.pressState === 'slam' || (p.pressState === 'hold' && cyc < 3.25)) && p.pressDrop > 0.45) {
          const stoneBottom = floorY - 58 + p.pressDrop * 54;
          if (
            !isInCheckpointSafeZone(level, p.x + 96, floorY - 64, 58, 64) &&
            catCx2 > p.x + 98 &&
            catCx2 < p.x + 154 &&
            c.y + 8 < stoneBottom &&
            c.y + c.h > stoneBottom - 44
          ) {
            onCatHit('حجر معصرة الزيتون! انتبه لهبوط الثقل -1 ❤️');
          }
        }
        // 2. Innovative Lever-Tail Catapult on left (x + 4 .. x + 74) when counterweight slams!
        if (
          (p.pressState === 'slam' || (p.pressState === 'hold' && cyc < 3.55)) &&
          !(p.launchCd > 0) &&
          catCx2 >= p.x + 2 &&
          catCx2 <= p.x + 76 &&
          c.y + c.h >= floorY - 62 &&
          c.y + c.h <= floorY + 8 &&
          c.vy >= -180
        ) {
          c.vy = -760;
          c.onGround = false;
          c.scaleX = 0.84;
          c.scaleY = 1.2;
          p.launchCd = 0.65;
          Audio.playJump();
          Particles.spawnDust(catCx2, floorY - 28, 12, '#bef264');
          const isEn = window.Game.I18n && window.Game.I18n.isEn();
          Particles.spawnPopup(catCx2, floorY - 58, isEn ? '🫒 Olive-Press Launch!' : '🫒 قفزة معصرة الزيتون!', '#bef264');
        }
      } else if (p.type === 'battir_railway_semaphore') {
        // 1892 Jaffa–Jerusalem Ottoman Railway Semaphore & Sanasel Shelter Steam Jet:
        // Crouch behind the low dry-stone Sanasel wall OR Meow to flip the signal GREEN!
        if (p.greenTimer > 0) {
          p.greenTimer = Math.max(0, p.greenTimer - dt);
          p.semState = 'green';
          p.jetPower = Math.max(0, (p.jetPower || 0) - dt * 5);
        } else {
          const cyc = (gameTime + (p.phase || 0)) % 4.6;
          const prevSt = p.semState || 'clear';
          if (cyc < 1.9) {
            p.semState = 'clear';
            p.jetPower = Math.max(0, (p.jetPower || 0) - dt * 4);
          } else if (cyc < 2.75) {
            p.semState = 'warn';
            p.jetPower = 0.15;
          } else if (cyc < 4.05) {
            p.semState = 'jet';
            p.jetPower = Math.min(1, (p.jetPower || 0) + dt * 6);
            if (prevSt !== 'jet' && Audio.playSteamHiss) Audio.playSteamHiss();
          } else {
            p.semState = 'clear';
            p.jetPower = Math.max(0, (p.jetPower || 0) - dt * 4);
          }
        }
        if (p.semState === 'jet' && (p.jetPower || 0) > 0.55) {
          const floorY = p.y + p.h;
          const jetTop = floorY - 52;
          const jetBot = floorY - 27; // Crouching catTop is floorY - 22 (593 > 588) -> shelters safely behind Sanasel wall!
          const catTop = c.y + (c.crouching ? 22 : 5);
          const catBot = c.y + 41;
          if (
            !c.crouching &&
            !isInCheckpointSafeZone(level, p.x, jetTop, p.w, 30) &&
            c.x + c.w - 10 > p.x + 14 &&
            c.x + 10 < p.x + p.w - 14 &&
            catTop < jetBot &&
            catBot > jetTop
          ) {
            onCatHit('بخار قاطرة بتّير ١٨٩٢! انحنِ خلف السنسلة أو موء للإشارة -1 ❤️');
          }
        }
      } else if (p.type === 'battir_aqueduct_surge') {
        // Ma'dud Roman Irrigation Canal Surge + Famous Purple Battiri Eggplant Sprint Boost!
        const cyc = (gameTime + (p.phase || 0)) % 3.5;
        if (p.boostCd > 0) p.boostCd = Math.max(0, p.boostCd - dt);
        if (cyc < 0.55) {
          p.waveWarn = true;
          p.waveActive = false;
          p.waveCalmed = false;
        } else if (cyc < 2.55 && !p.waveCalmed) {
          p.waveWarn = false;
          p.waveActive = true;
          const u = (cyc - 0.55) / 2.0;
          const dir = p.waveDir || 1;
          p.waveX = dir > 0 ? (p.x + 28 + u * (p.w - 64)) : (p.x + p.w - 28 - u * (p.w - 64));
          const floorY = p.y + p.h;
          const catCx2 = c.x + c.w * 0.5;
          if (
            !isInCheckpointSafeZone(level, p.waveX - 20, floorY - 30, 40, 30) &&
            Math.abs(catCx2 - p.waveX) < 20 &&
            c.y + c.h > floorY - 26 &&
            c.y < floorY + 4
          ) {
            onCatHit('موجة سقي قناة المعدود! اقفز فوق الموجة -1 ❤️');
          }
        } else {
          p.waveWarn = false;
          p.waveActive = false;
        }
        // Touching the irrigated Battiri Eggplant patch at the far end grants a joyful stamina sprint boost!
        const patchX = (p.waveDir || 1) > 0 ? (p.x + p.w - 28) : (p.x + 28);
        const floorY = p.y + p.h;
        if (
          !(p.boostCd > 0) &&
          Math.abs((c.x + c.w * 0.5) - patchX) < 26 &&
          c.y + c.h >= floorY - 26 &&
          c.y <= floorY + 4
        ) {
          c.eggplantBoostTimer = 2.5;
          p.boostCd = 3.6;
          if (Audio.playCollect) Audio.playCollect();
          Particles.spawnDust(patchX, floorY - 12, 10, '#a855f7');
          const isEn = window.Game.I18n && window.Game.I18n.isEn();
          Particles.spawnPopup(patchX, floorY - 38, isEn ? '🍆 Battiri Eggplant Boost!' : '🍆 نشاط الباذنجان البتيري!', '#d8b4fe');
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
        Particles.spawnPopup(cp.x + 18, cp.y - 38, t('popup_checkpoint'), '#86efac');
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
    const isStory1Final = currentStage === STORY1_END;
    const isWorldFinal = currentStage === TOTAL_STAGES;
    const isFinal = isStory1Final || isWorldFinal;
    btnNextStage.classList.toggle('hidden', isFinal);
    if (!isFinal) {
      btnNextStage.textContent = t('end_next_stage', { n: currentStage + 1 });
    }
    endBadge.textContent = isFinal
      ? t('end_final_badge', { n: currentStage })
      : t('end_stage_done', { n: currentStage });
    endTitle.textContent = isStory1Final
      ? t('end_title_final')
      : isWorldFinal
      ? t('end_title_world_final')
      : t('end_title_win');

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
    endStats.innerHTML = t('end_stats_html', {
      time: elapsedTime.toFixed(1),
      lives: catCtrl.cat.lives,
      maxLives: catCtrl.cat.maxLives,
      treats: collectedTreats,
      total: totalRunCoins,
      earned: stageCoinsEarned,
      bonus: reward.totalBonus,
    });
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

      if (currentStage === STORY1_END) {
        // Grand Finale of Story 1 (Stage 15) plays Win1.mp4 -> Win2.mp4!
        Audio.pauseMusic();
        endOverlay.classList.add('hidden');
        hud.classList.add('hidden');

        let summaryShown = false;
        const showFinalSummary = () => {
          if (summaryShown) return;
          summaryShown = true;
          winVideo.onended = null;
          winVideo.onerror = null;
          winVideo.pause();
          winLayer.classList.add('hidden');
          if (winCaption) winCaption.classList.add('hidden');
          showVictoryOverlay(reward);
        };

        const winPlaylist = [
          { src: 'videos/Win1.mp4', key: 'win1' },
          { src: 'videos/Win2.mp4', key: 'win2' },
        ];
        let winIdx = 0;
        const playNextWinClip = () => {
          if (summaryShown) return;
          if (winIdx >= winPlaylist.length) {
            showFinalSummary();
            return;
          }
          const clip = winPlaylist[winIdx++];
          activeWinClipKey = clip.key;
          winVideo.muted = false;
          winVideo.src = clip.src;
          winVideo.currentTime = 0;
          winVideo.load();
          winLayer.classList.remove('hidden');
          if (winCaption) winCaption.classList.add('hidden');
          updateVideoCaption(winVideo, winCaption, activeWinClipKey);

          const p = winVideo.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              // Autoplay policy may block unmuted play() from requestAnimationFrame:
              // retry muted immediately so the finale cutscene ALWAYS plays!
              winVideo.muted = true;
              const pMuted = winVideo.play();
              if (pMuted && typeof pMuted.catch === 'function') {
                pMuted.catch(() => {
                  // Only skip to next clip / summary if muted playback also fails
                  if (winIdx < winPlaylist.length) playNextWinClip();
                  else showFinalSummary();
                });
              }
            });
          }
        };

        winVideo.onended = playNextWinClip;
        winVideo.onerror = () => {
          if (winIdx < winPlaylist.length) playNextWinClip();
          else showFinalSummary();
        };
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
      btnGameOverRevive.textContent = t('gameover_revive', { cost: Store.LIFE_REFILL_COST });
    }

    const showFallbackOverlay = () => {
      gameOverLayer.classList.add('hidden');
      if (gameOverCaption) gameOverCaption.classList.add('hidden');
      endOverlay.classList.remove('hidden');
      btnNextStage.classList.add('hidden');
      if (endStarsRow) {
        endStarsRow.querySelectorAll('.end-star').forEach((s) => s.classList.remove('earned'));
      }
      endBadge.textContent = t('end_out_of_lives');
      endTitle.textContent = t('end_try_again');
      endStats.innerHTML = t('end_fail_tip');
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
    gameOverVideo.muted = false;
    gameOverVideo.currentTime = 0;
    const goPlay = gameOverVideo.play();
    if (goPlay && typeof goPlay.catch === 'function') {
      goPlay.catch(() => {
        gameOverVideo.muted = true;
        const goMuted = gameOverVideo.play();
        if (goMuted && typeof goMuted.catch === 'function') {
          goMuted.catch(showFallbackOverlay);
        }
      });
    }
  }

  function reviveAtCheckpoint() {
    if (!Store.spendCoins(Store.LIFE_REFILL_COST)) {
      showToast(t('toast_no_coins'));
      return;
    }
    Audio.playPurchase();
    haptic(20);
    if (gameOverVideo._btnTimer) clearTimeout(gameOverVideo._btnTimer);
    gameOverVideo.pause();
    gameOverLayer.classList.add('hidden');
    if (gameOverCaption) gameOverCaption.classList.add('hidden');
    gameOverActions.classList.add('hidden');
    endOverlay.classList.add('hidden');
    hud.classList.remove('hidden');
    if (touchControls) touchControls.classList.remove('hidden');
    clearAllInputs();
    catCtrl.refillLives();
    updateHUD();
    syncCoinDisplays();
    Particles.spawnShieldBurst(catCtrl.cat.x + catCtrl.cat.w / 2, catCtrl.cat.y + catCtrl.cat.h / 2);
    Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, t('popup_revive'), '#86efac');
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
    } else if (theme === 'snow') {
      Art.drawSnowSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawSnowMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'circus') {
      Art.drawCircusSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawCircusMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'desert') {
      Art.drawDesertSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawDesertMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'japan') {
      Art.drawJapanSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawJapanMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'steam_train') {
      Art.drawSteamTrainSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawSteamTrainMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'venice') {
      Art.drawVeniceSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawVeniceMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'paris') {
      Art.drawParisSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawParisMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'marrakech') {
      Art.drawMarrakechSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawMarrakechMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'maya') {
      Art.drawMayaSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawMayaMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'greece') {
      Art.drawGreeceSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawGreeceMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
    } else if (theme === 'battir') {
      Art.drawBattirSkyAndHorizon(ctx, camX, LOGICAL_W, LOGICAL_H, time);
      Art.drawBattirMidground(ctx, camX, LOGICAL_W, LOGICAL_H, time);
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

    // Atmospheric World Teasers (drawn right BEHIND wooden piers/rooftops & water for true occlusion!)
    if (Art.drawWorldTeasers) {
      Art.drawWorldTeasers(ctx, level, catCtrl ? catCtrl.cat : null, camX, camY, time, cullW);
    }

    for (const p of level.platforms) {
      if (p.hiddenInDay && !nv) continue;
      if (p.bounceAnim && p.bounceAnim > 0) p.bounceAnim = Math.max(0, p.bounceAnim - 0.08);
      const px = p.x - camX;
      const py = p.y - camY + (p.type !== 'flower_bounce' && p.bounceAnim ? Math.sin(p.bounceAnim * Math.PI) * 6 : 0);
      const pad = (p.type === 'maya_dart_totem' || p.type === 'maya_twin_scale' || p.type === 'greece_medusa_aegis' || p.type === 'greece_discobolus' || p.type === 'greece_zeus_obelisk')
        ? 540
        : (p.type === 'pendulum_censer' || p.type === 'waterwheel_arm' || p.type === 'pressure_boiler_valve' || p.type === 'switch_rail_bridge' || p.type === 'carnival_bell_swing' || p.type === 'gondola_boat' || p.type === 'moulin_sail_wheel' || p.type === 'paris_balcony_drawbridge' || p.type === 'morocco_lantern_swing' || p.type === 'morocco_magic_carpet' || p.type === 'morocco_cedar_bridge' || p.type === 'maya_vine_swing' || p.type === 'maya_sun_disc' || p.type === 'maya_stone_bridge' || p.type === 'maya_serpent_ring' || p.type === 'maya_rolling_wheel' || p.type === 'maya_serpent_spine' || p.type === 'maya_vault_door' || p.type === 'greece_sun_mirror' || p.type === 'greece_light_bridge' || p.type === 'greece_chariot_track' || p.type === 'greece_poseidon_wave' || p.type === 'greece_lyre_pillar' || p.type === 'greece_marble_lift' || p.type === 'battir_madud_gate' || p.type === 'battir_pool_bridge' || p.type === 'battir_press_pad' || p.type === 'battir_olive_basket' || p.type === 'battir_roman_bath_vent' || p.type === 'battir_hosh_arch_swing' || p.type === 'battir_olive_bough' || p.type === 'battir_alley_wall')
        ? 280
        : 40;
      if (px + p.w < -pad || px > cullW + pad) continue;
      Art.drawPlatform(ctx, p, px, py, nv, time);
    }

    if (currentStage === 1) {
      Art.drawStartCardboardScene(ctx, camX, camY);
    }

    for (const p of level.puddles) {
      const px = p.x - camX;
      if (px + p.w < -40 || px > cullW + 40) continue;
      Art.drawPuddle(ctx, px, p.y - camY, p.w, p.h, time, level.theme === 'harbor' || level.theme === 'harbor_storm' || level.theme === 'snow');
    }

    for (const cp of level.checkpoints) {
      const cx = cp.x - camX;
      if (cx < -115 || cx > cullW + 115) continue;
      Art.drawCheckpoint(ctx, cp, cx, cp.y - camY, time, level.theme, currentStage);
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
    if (level.theme === 'desert' && Art.drawPharaonicMuseumGate) {
      Art.drawPharaonicMuseumGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'japan' && Art.drawJapaneseShrineGate) {
      Art.drawJapaneseShrineGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'steam_train' && Art.drawGrandTrainStationGate) {
      Art.drawGrandTrainStationGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'venice' && Art.drawVenicePiazzaGate) {
      Art.drawVenicePiazzaGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'paris' && Art.drawParisArcGate) {
      Art.drawParisArcGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'marrakech' && Art.drawMarrakechBabGate) {
      Art.drawMarrakechBabGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'maya' && Art.drawMayaTempleGate) {
      Art.drawMayaTempleGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'greece' && Art.drawGreeceAcropolisGate) {
      Art.drawGreeceAcropolisGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else if (level.theme === 'battir' && Art.drawBattirFinishGate) {
      Art.drawBattirFinishGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    } else {
      Art.drawMarketGate(ctx, g, g.x - camX, g.y - camY, time, level.goalLabel);
    }
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
      if (catCtrl.cat.quicksandSunk) {
        catCtrl.cat.quicksandSunk = false;
        onCatHit('رمال متحركة! -1 ❤️');
      }
      if (catCtrl.cat.crushedByBlock) {
        catCtrl.cat.crushedByBlock = false;
        onCatHit('كتلة حجرية ساقطة! -1 ❤️');
      }
      if (catCtrl.cat.crushedByPinch) {
        catCtrl.cat.crushedByPinch = false;
        onCatHit('بوابة منزلقة! -1 ❤️');
      }
      if (catCtrl.cat.hitLowBridge) {
        catCtrl.cat.hitLowBridge = false;
        onCatHit('جسر منخفض! انحنِ للتسلل -1 ❤️');
      }
      if (catCtrl.cat.scaldedBySteam) {
        catCtrl.cat.scaldedBySteam = false;
        onCatHit('بخار القطار الحار! -1 ❤️');
      }
      if (catCtrl.cat.prickedByThorns) {
        catCtrl.cat.prickedByThorns = false;
        onCatHit('أشواك الغابة! -1 ❤️');
      }
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
        showToast(t('toast_lives_refilled'));
      } else {
        showToast(t('toast_no_coins'));
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
      Particles.spawnPopup(catCtrl.cat.x + 20, catCtrl.cat.y - 24, t('stage_n', { n: nextStage }), '#ffd60a');
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
  if (btnHudMusic) {
    btnHudMusic.addEventListener('click', () => {
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

  // Hidden Season 2 Secret PIN Gate (Unlabeled tiny dot -> 112233)
  const btnSecretGate = document.getElementById('btnSecretGate');
  const secretCodeOverlay = document.getElementById('secretCodeOverlay');
  const secretCodeInput = document.getElementById('secretCodeInput');
  const btnSecretSubmit = document.getElementById('btnSecretSubmit');
  const btnSecretCancel = document.getElementById('btnSecretCancel');
  const SECRET_SEASON2_PIN = '112233';

  function closeSecretGate() {
    if (secretCodeOverlay) secretCodeOverlay.classList.add('hidden');
    if (secretCodeInput) {
      secretCodeInput.value = '';
      secretCodeInput.classList.remove('shake');
    }
  }

  function submitSecretPin() {
    if (!secretCodeInput) return;
    const entered = String(secretCodeInput.value || '').trim();
    if (entered === SECRET_SEASON2_PIN) {
      const nextState = !(Store.isSeason2Unlocked && Store.isSeason2Unlocked());
      if (Store.setSeason2Unlocked) Store.setSeason2Unlocked(nextState);
      if (Audio.playCollect) Audio.playCollect();
      closeSecretGate();
      renderLevelGrid();
      syncCoinDisplays();
    } else {
      secretCodeInput.classList.remove('shake');
      void secretCodeInput.offsetWidth;
      secretCodeInput.classList.add('shake');
      secretCodeInput.value = '';
      haptic(25);
    }
  }

  if (btnSecretGate && secretCodeOverlay) {
    btnSecretGate.addEventListener('click', () => {
      Audio.ensureCtx();
      secretCodeOverlay.classList.remove('hidden');
      if (secretCodeInput) {
        secretCodeInput.value = '';
        secretCodeInput.classList.remove('shake');
        setTimeout(() => secretCodeInput.focus(), 40);
      }
    });
  }
  if (btnSecretSubmit) btnSecretSubmit.addEventListener('click', submitSecretPin);
  if (btnSecretCancel) btnSecretCancel.addEventListener('click', closeSecretGate);
  if (secretCodeOverlay) {
    secretCodeOverlay.addEventListener('click', (e) => {
      if (e.target === secretCodeOverlay) closeSecretGate();
    });
  }
  if (secretCodeInput) {
    secretCodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); submitSecretPin(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeSecretGate(); }
    });
  }

  // Boot
  refreshAllLocalizedUI();
  syncToggleButtons();
  initLevel(1);
  requestAnimationFrame(loop);
})();
