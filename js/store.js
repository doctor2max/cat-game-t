window.Game = window.Game || {};

window.Game.Store = (function () {
  const SAVE_KEY = 'theWayHome_saveData_v2';
  const LEGACY_UNLOCK_KEY = 'theWayHome_maxUnlockedStage';
  const TOTAL_STAGES = 15;
  const TEMP_UNLOCK_ALL = true; // مؤقت لمعاينة جميع المراحل (أعدها إلى false لإعادة القفل)

  const UPGRADES = [
    {
      id: 'lives',
      name: 'أرواح إضافية',
      icon: '❤️',
      desc: 'يزيد عدد أرواح مشمشة في كل مرحلة',
      maxLevel: 3,
      costs: [80, 160, 280],
      effectLabels: ['6/7 أرواح', '7/7 أرواح', '8/8 أرواح', '9/9 أرواح'],
    },
    {
      id: 'agility',
      name: 'قفزة رشيقة',
      icon: '🐾',
      desc: 'يزيد سرعة الجري وارتفاع القفز بسلاسة',
      maxLevel: 3,
      costs: [70, 150, 260],
      effectLabels: ['قياسي', '+6% سرعة وقفز', '+11% سرعة وقفز', '+16% سرعة وقفز'],
    },
    {
      id: 'shield',
      name: 'درع الحماية',
      icon: '🛡️',
      desc: 'يمتص ضربة كاملة دون خسارة روح ويتجدد تلقائياً',
      maxLevel: 3,
      costs: [100, 200, 340],
      effectLabels: ['غير مفعّل', 'تجدد كل 35ث', 'تجدد كل 24ث', 'تجدد كل 16ث'],
    },
    {
      id: 'magnet',
      name: 'مغناطيس العملات',
      icon: '🧲',
      desc: 'يجذب العملات الذهبية القريبة تلقائياً نحو مشمشة',
      maxLevel: 3,
      costs: [60, 130, 220],
      effectLabels: ['غير مفعّل', 'مدى 105px', 'مدى 165px', 'مدى 235px'],
    },
    {
      id: 'lucky',
      name: 'جرس الحظ والمواء',
      icon: '🔔',
      desc: 'يضاعف قيمة العملات ويقلل وقت انتظار المواء',
      maxLevel: 3,
      costs: [90, 180, 300],
      effectLabels: ['x1 عملات • 2.4ث', 'x1.5 عملات • 1.8ث', 'x2 عملات • 1.4ث', 'x2.5 عملات • 1.0ث'],
    },
  ];

  const SKINS = [
    {
      id: 'classic',
      name: 'مشمشة الأصلية',
      icon: '🐱',
      perk: 'المظهر الكلاسيكي المحبوب',
      cost: 0,
      accent: '#f59b42',
    },
    {
      id: 'crown',
      name: 'التاج الملكي',
      icon: '👑',
      perk: 'تاج ذهبي لامع وأثر بريق دافئ',
      cost: 120,
      accent: '#fbbf24',
    },
    {
      id: 'scarf',
      name: 'وشاح النينجا',
      icon: '🧣',
      perk: 'وشاح قرمزي متطاير مع حركة الهواء',
      cost: 180,
      accent: '#ef4444',
    },
    {
      id: 'starlight',
      name: 'هالة النجوم',
      icon: '✨',
      perk: 'نجوم سماوية متلألئة تدور حول مشمشة',
      cost: 240,
      accent: '#38bdf8',
    },
    {
      id: 'cyber',
      name: 'نظارة المستقبل',
      icon: '🕶️',
      perk: 'نظارة نيون رقمية وتوهج سماوي',
      cost: 300,
      accent: '#22d3ee',
    },
    {
      id: 'wings',
      name: 'أجنحة الملاك',
      icon: '🪽',
      perk: 'أجنحة مضيئة + تحليق ناعم عند استمرار القفز',
      cost: 420,
      accent: '#fde68a',
    },
  ];

  const UNLOCK_STAGE_COST = 150;
  const LIFE_REFILL_COST = 50;
  const DAILY_BONUS_AMOUNT = 60;

  function createDefaultState() {
    let legacyUnlocked = 1;
    try {
      const saved = parseInt(localStorage.getItem(LEGACY_UNLOCK_KEY), 10);
      if (!isNaN(saved) && saved >= 1 && saved <= TOTAL_STAGES) {
        legacyUnlocked = saved;
      }
    } catch (e) {}

    return {
      coins: 50, // Friendly starter coins so the player immediately sees the coin system
      maxUnlockedStage: legacyUnlocked,
      stageStars: {},
      stageCleared: {},
      upgrades: {
        lives: 0,
        agility: 0,
        shield: 0,
        magnet: 0,
        lucky: 0,
      },
      ownedSkins: ['classic'],
      equippedSkin: 'classic',
      lastDailyClaim: '',
    };
  }

  let state = loadState();

  function loadState() {
    const def = createDefaultState();
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return def;
      const parsed = JSON.parse(raw);
      return {
        ...def,
        ...parsed,
        coins: typeof parsed.coins === 'number' && parsed.coins >= 0 ? Math.floor(parsed.coins) : def.coins,
        maxUnlockedStage: Math.max(
          def.maxUnlockedStage,
          Math.min(TOTAL_STAGES, Math.max(1, parseInt(parsed.maxUnlockedStage, 10) || 1))
        ),
        stageStars: parsed.stageStars && typeof parsed.stageStars === 'object' ? parsed.stageStars : {},
        stageCleared: parsed.stageCleared && typeof parsed.stageCleared === 'object' ? parsed.stageCleared : {},
        upgrades: { ...def.upgrades, ...(parsed.upgrades || {}) },
        ownedSkins: Array.isArray(parsed.ownedSkins) && parsed.ownedSkins.length ? parsed.ownedSkins : ['classic'],
        equippedSkin: typeof parsed.equippedSkin === 'string' ? parsed.equippedSkin : 'classic',
        lastDailyClaim: typeof parsed.lastDailyClaim === 'string' ? parsed.lastDailyClaim : '',
      };
    } catch (e) {
      return def;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      localStorage.setItem(LEGACY_UNLOCK_KEY, String(state.maxUnlockedStage));
    } catch (e) {}
  }

  function getCoins() {
    return state.coins;
  }

  function addCoins(amount) {
    const add = Math.max(0, Math.round(amount));
    state.coins += add;
    saveState();
    return state.coins;
  }

  function spendCoins(amount) {
    if (amount <= 0) return true;
    if (state.coins < amount) return false;
    state.coins -= amount;
    saveState();
    return true;
  }

  function getMaxUnlockedStage() {
    return TEMP_UNLOCK_ALL ? TOTAL_STAGES : state.maxUnlockedStage;
  }

  function getStageStars(stageNum) {
    return state.stageStars[stageNum] || 0;
  }

  function isStageCleared(stageNum) {
    return !!state.stageCleared[stageNum];
  }

  function getTotalStars() {
    let total = 0;
    for (let s = 1; s <= TOTAL_STAGES; s++) {
      total += state.stageStars[s] || 0;
    }
    return total;
  }

  function recordStageClear(stageNum, treatsCollected) {
    const firstClear = !state.stageCleared[stageNum];
    const stars = treatsCollected >= 3 ? 3 : treatsCollected >= 1 ? 2 : 1;
    state.stageCleared[stageNum] = true;
    if (stars > (state.stageStars[stageNum] || 0)) {
      state.stageStars[stageNum] = stars;
    }
    if (stageNum >= state.maxUnlockedStage && stageNum < TOTAL_STAGES) {
      state.maxUnlockedStage = stageNum + 1;
    }

    const clearBonus = 30 + stageNum * 2;
    const starBonus = stars * 15;
    const firstClearBonus = firstClear ? 25 : 0;
    const totalBonus = clearBonus + starBonus + firstClearBonus;
    state.coins += totalBonus;
    saveState();

    return {
      stars,
      firstClear,
      clearBonus,
      starBonus,
      firstClearBonus,
      totalBonus,
    };
  }

  function getUpgradeLevel(id) {
    return state.upgrades[id] || 0;
  }

  function getUpgradeCost(id) {
    const u = UPGRADES.find((item) => item.id === id);
    if (!u) return null;
    const lv = state.upgrades[id] || 0;
    if (lv >= u.maxLevel) return null;
    return u.costs[lv];
  }

  function buyUpgrade(id) {
    const cost = getUpgradeCost(id);
    if (cost === null) return { ok: false, reason: 'max' };
    if (!spendCoins(cost)) return { ok: false, reason: 'coins' };
    state.upgrades[id] = (state.upgrades[id] || 0) + 1;
    saveState();
    return { ok: true, level: state.upgrades[id], cost };
  }

  function isSkinOwned(id) {
    return state.ownedSkins.includes(id);
  }

  function getEquippedSkin() {
    return state.equippedSkin || 'classic';
  }

  function buyOrEquipSkin(id) {
    const skin = SKINS.find((s) => s.id === id);
    if (!skin) return { ok: false };
    if (isSkinOwned(id)) {
      state.equippedSkin = id;
      saveState();
      return { ok: true, action: 'equipped' };
    }
    if (!spendCoins(skin.cost)) return { ok: false, reason: 'coins' };
    state.ownedSkins.push(id);
    state.equippedSkin = id;
    saveState();
    return { ok: true, action: 'bought' };
  }

  function unlockNextStageWithCoins() {
    if (state.maxUnlockedStage >= TOTAL_STAGES) return { ok: false, reason: 'all_unlocked' };
    if (!spendCoins(UNLOCK_STAGE_COST)) return { ok: false, reason: 'coins' };
    state.maxUnlockedStage += 1;
    saveState();
    return { ok: true, unlockedStage: state.maxUnlockedStage };
  }

  function canClaimDailyBonus() {
    const today = new Date().toISOString().slice(0, 10);
    return state.lastDailyClaim !== today;
  }

  function claimDailyBonus() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastDailyClaim === today) return { ok: false };
    state.lastDailyClaim = today;
    state.coins += DAILY_BONUS_AMOUNT;
    saveState();
    return { ok: true, amount: DAILY_BONUS_AMOUNT };
  }

  function getBonuses() {
    const livesLv = state.upgrades.lives || 0;
    const agilLv = state.upgrades.agility || 0;
    const shieldLv = state.upgrades.shield || 0;
    const magLv = state.upgrades.magnet || 0;
    const luckyLv = state.upgrades.lucky || 0;

    const startLives = livesLv === 0 ? 6 : 6 + livesLv;
    const maxLives = livesLv === 0 ? 7 : Math.max(7, 6 + livesLv);
    const speedMult = [1, 1.06, 1.11, 1.16][agilLv] || 1;
    const jumpMult = [1, 1.04, 1.08, 1.12][agilLv] || 1;
    const hasShield = shieldLv > 0;
    const shieldRechargeSec = [0, 35, 24, 16][shieldLv] || 0;
    const magnetRadius = [0, 105, 165, 235][magLv] || 0;
    const coinMult = [1, 1.5, 2.0, 2.5][luckyLv] || 1;
    const meowCooldown = [2.4, 1.85, 1.4, 1.0][luckyLv] || 2.4;
    const meowRange = [360, 420, 480, 560][luckyLv] || 360;
    const skin = state.equippedSkin || 'classic';

    return {
      startLives,
      maxLives,
      speedMult,
      jumpMult,
      hasShield,
      shieldRechargeSec,
      magnetRadius,
      coinMult,
      meowCooldown,
      meowRange,
      skin,
      hasWingsGlide: skin === 'wings',
    };
  }

  // Deterministic smart coin placement for any level that doesn't already provide custom coins
  function ensureLevelCoins(level, stageNum) {
    if (Array.isArray(level.coins) && level.coins.length > 0) return level.coins;

    const coins = [];
    const occupied = [];
    const tooClose = (x, y, minDist) => {
      for (const o of occupied) {
        if (Math.hypot(x - o.x, y - o.y) < minDist) return true;
      }
      return false;
    };

    // Avoid overlapping treats or goal
    if (level.treats) {
      for (const t of level.treats) occupied.push({ x: t.x, y: t.y });
    }
    if (level.goal) {
      occupied.push({ x: level.goal.x + level.goal.w / 2, y: level.goal.y + level.goal.h / 2 });
    }

    const platforms = level.platforms || [];
    const puddles = level.puddles || [];
    const hazardTypes = new Set(['third_rail', 'welding_spark', 'laser_grid', 'steam_vent', 'wind_zone']);
    const groundTypes = new Set([
      'asphalt', 'cobble', 'grass', 'pier', 'rooftop',
      'rail_platform', 'concrete_slab', 'marble', 'bridge_deck',
      'glass_floor', 'neon_deck', 'home_deck', 'oil_deck',
    ]);

    function isSafeCoinPos(x, y) {
      if (x < 140 || x > (level.width || 4000) - 100) return false;
      if (y < 75 || y > (level.height || 720) - 95) return false;
      if (tooClose(x, y, 32)) return false;
      // Reject if inside or clipping any solid wall/box/train or hazard!
      for (const sp of platforms) {
        if (sp.type === 'wind_zone' || sp.hiddenInDay) continue;
        if (!sp.oneWay || hazardTypes.has(sp.type)) {
          const pad = hazardTypes.has(sp.type) ? 30 : 26;
          if (x + pad > sp.x && x - pad < sp.x + sp.w && y + pad > sp.y && y - pad < sp.y + sp.h) {
            return false;
          }
        }
      }
      // Reject if inside any water puddle
      for (const pud of puddles) {
        if (x + 18 > pud.x && x - 18 < pud.x + pud.w && y + 22 > pud.y && y - 18 < pud.y + pud.h) {
          return false;
        }
      }
      return true;
    }

    function tryAddCoin(x, y, value = 1, hiddenInDay = false) {
      const rx = Math.round(x);
      const ry = Math.round(y);
      if (!isSafeCoinPos(rx, ry)) return false;
      const coin = { x: rx, y: ry, collected: false, value, phase: coins.length * 0.55 };
      if (hiddenInDay) coin.hiddenInDay = true;
      coins.push(coin);
      occupied.push({ x: rx, y: ry });
      return true;
    }

    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      if (hazardTypes.has(p.type)) continue;
      if (p.x < 180) continue; // Don't clutter spawn point
      if (p.climbable && p.h > 140 && p.w < 70) continue; // Skip narrow wall-jump shafts

      if (p.bouncy) {
        const cx = p.x + p.w / 2;
        tryAddCoin(cx - 22, p.y - 78, 1);
        tryAddCoin(cx, p.y - 118, 1);
        tryAddCoin(cx + 22, p.y - 78, 1);
      } else if (p.hiddenInDay) {
        const y = p.y - 34;
        tryAddCoin(p.x + p.w / 2 - 26, y, 2, true);
        tryAddCoin(p.x + p.w / 2 + 26, y, 2, true);
      } else if (p.narrow || p.moving) {
        const count = p.w >= 180 ? 3 : 2;
        for (let k = 0; k < count; k++) {
          const frac = (k + 1) / (count + 1);
          const x = p.x + p.w * frac;
          const y = p.y - 42 - (count === 3 && k === 1 ? 14 : 0);
          tryAddCoin(x, y, 1);
        }
      } else if (!groundTypes.has(p.type) && p.w >= 70 && p.y > 160 && p.y < 600) {
        if ((i + stageNum) % 2 === 0) {
          const count = p.w >= 145 ? 2 : 1;
          for (let k = 0; k < count; k++) {
            const x = p.x + p.w * ((k + 1) / (count + 1));
            tryAddCoin(x, p.y - 36, 1);
          }
        }
      } else if (groundTypes.has(p.type) && p.w >= 420) {
        // Place a clean 3-coin line on open ground stretches (guaranteed free of walls/crates!)
        const candidates = [0.32, 0.5, 0.68];
        for (const frac of candidates) {
          const midX = p.x + p.w * frac;
          const y = p.y - 38;
          if (
            !tooClose(midX, y, 150) &&
            isSafeCoinPos(midX - 36, y) &&
            isSafeCoinPos(midX, y) &&
            isSafeCoinPos(midX + 36, y)
          ) {
            tryAddCoin(midX - 36, y, 1);
            tryAddCoin(midX, y, 1);
            tryAddCoin(midX + 36, y, 1);
            break;
          }
        }
      }
    }

    // Cap to a clean generous number per stage (proportional to stage width, ~22-45 coins)
    const maxCoins = Math.min(48, Math.max(20, Math.floor((level.width || 4000) / 220)));
    if (coins.length > maxCoins) {
      const step = coins.length / maxCoins;
      const trimmed = [];
      for (let i = 0; i < maxCoins; i++) {
        trimmed.push(coins[Math.floor(i * step)]);
      }
      level.coins = trimmed;
    } else {
      level.coins = coins;
    }
    return level.coins;
  }

  return {
    TOTAL_STAGES,
    UPGRADES,
    SKINS,
    UNLOCK_STAGE_COST,
    LIFE_REFILL_COST,
    DAILY_BONUS_AMOUNT,
    getCoins,
    addCoins,
    spendCoins,
    getMaxUnlockedStage,
    getStageStars,
    isStageCleared,
    getTotalStars,
    recordStageClear,
    getUpgradeLevel,
    getUpgradeCost,
    buyUpgrade,
    isSkinOwned,
    getEquippedSkin,
    buyOrEquipSkin,
    unlockNextStageWithCoins,
    canClaimDailyBonus,
    claimDailyBonus,
    getBonuses,
    ensureLevelCoins,
  };
})();
