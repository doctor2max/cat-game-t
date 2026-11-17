window.Game = window.Game || {};

window.Game.createLevel4 = function () {
  const width = 4800;
  const height = 720;

  // Stage 4: Deep Public Park (أعماق الحديقة العامة - تصميم متناسق ومتوازن)
  const platforms = [
    // Ground lush park turf segments (cleanly spaced with ponds between zones)
    { x: 0, y: 630, w: 580, h: 90, type: 'grass', climbable: false },
    { x: 780, y: 630, w: 840, h: 90, type: 'grass', climbable: false },
    { x: 1830, y: 630, w: 730, h: 90, type: 'grass', climbable: false },
    { x: 2770, y: 630, w: 950, h: 90, type: 'grass', climbable: false },
    { x: 3920, y: 630, w: 880, h: 90, type: 'grass', climbable: false },

    // Zone 1: Park Terrace -> Grounded Bench -> Vertical Lift -> High Rope Bridge
    { x: 205, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },
    {
      x: 380,
      y: 470,
      w: 110,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 380,
      baseY: 470,
      moveRange: 0,
      moveYRange: 80,
      moveSpeed: 1.85,
      dx: 0,
      dy: 0,
    },
    { x: 540, y: 390, w: 220, h: 12, type: 'clothesline', oneWay: true, narrow: true },

    // Zone 2: Mushroom Glade (grounded giant mushrooms + canopy branch + reachable Secret Fish #1)
    { x: 845, y: 540, w: 96, h: 90, type: 'mushroom', oneWay: true, bouncy: true },
    { x: 1015, y: 385, w: 170, h: 22, type: 'branch', oneWay: true },
    // Secret Night-Vision branch #1 (120px above branch -> easily reachable!)
    { x: 1090, y: 265, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 1270, y: 540, w: 96, h: 90, type: 'mushroom', oneWay: true, bouncy: true },

    // Zone 3: Mossy Stone Arch Wall-Jump over Pond #2
    { x: 1515, y: 350, w: 46, h: 280, type: 'stonewall', oneWay: false, climbable: true },
    { x: 1685, y: 270, w: 46, h: 270, type: 'stonewall', oneWay: false, climbable: true },
    { x: 1845, y: 350, w: 185, h: 22, type: 'branch', oneWay: true },

    // Zone 4: Grounded Bench -> Twin Suspended Moving Bridges over Pond #3
    { x: 2110, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },
    {
      x: 2305,
      y: 465,
      w: 115,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 2305,
      moveRange: 80,
      moveSpeed: 1.95,
      dx: 0,
      dy: 0,
    },
    {
      x: 2600,
      y: 410,
      w: 115,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 2600,
      moveRange: 85,
      moveSpeed: -2.05,
      dx: 0,
      dy: 0,
    },

    // Zone 5: Upper Canopy & Secret Fish #3 + Grounded Bench
    { x: 2850, y: 540, w: 96, h: 90, type: 'mushroom', oneWay: true, bouncy: true },
    { x: 3020, y: 395, w: 175, h: 22, type: 'branch', oneWay: true },
    // Secret Night-Vision branch #2 (120px above branch -> easily reachable!)
    { x: 3250, y: 275, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 3340, y: 445, w: 155, h: 22, type: 'branch', oneWay: true },
    { x: 3530, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },

    // Zone 6: Final Pond Crossing, Mushroom Launch, Rope Bridge & Home Gate
    {
      x: 3755,
      y: 470,
      w: 115,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 3755,
      moveRange: 85,
      moveSpeed: 2.15,
      dx: 0,
      dy: 0,
    },
    { x: 3985, y: 540, w: 96, h: 90, type: 'mushroom', oneWay: true, bouncy: true },
    { x: 4135, y: 385, w: 215, h: 12, type: 'clothesline', oneWay: true, narrow: true },
    { x: 4405, y: 350, w: 46, h: 280, type: 'stonewall', oneWay: false, climbable: true },
    { x: 4545, y: 340, w: 225, h: 290, type: 'stonewall', oneWay: false, climbable: true },
  ];

  // Park water ponds & streams (hazards)
  const puddles = [
    { x: 580, y: 636, w: 200, h: 22 },
    { x: 1620, y: 636, w: 210, h: 22 },
    { x: 2560, y: 636, w: 210, h: 22 },
    { x: 3720, y: 636, w: 200, h: 22 },
  ];

  // Park Guard Dogs (4 dogs)
  const dogs = [
    {
      x: 1030,
      y: 586,
      w: 58,
      h: 44,
      minX: 820,
      maxX: 1470,
      vx: 115,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 2050,
      y: 586,
      w: 58,
      h: 44,
      minX: 1870,
      maxX: 2490,
      vx: 125,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 3120,
      y: 586,
      w: 58,
      h: 44,
      minX: 2830,
      maxX: 3630,
      vx: 130,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 4160,
      y: 586,
      w: 58,
      h: 44,
      minX: 3960,
      maxX: 4350,
      vx: 125,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
  ];

  // Spiky Hedgehogs (4 hedgehogs)
  const hedgehogs = [
    { x: 310, y: 604, w: 36, h: 26, minX: 220, maxX: 520, vx: 65, facing: 1 },
    { x: 1060, y: 359, w: 36, h: 26, minX: 1020, maxX: 1145, vx: 45, facing: -1 },
    { x: 3365, y: 419, w: 36, h: 26, minX: 3345, maxX: 3455, vx: 48, facing: 1 },
    { x: 4050, y: 604, w: 36, h: 26, minX: 3960, maxX: 4350, vx: 75, facing: 1 },
  ];

  // Swooping Night Crows (5 crows)
  const crows = [
    { x: 640, y: 285, baseY: 285, w: 42, h: 28, minX: 520, maxX: 840, vx: 115, facing: 1, amp: 24, freq: 2.6 },
    { x: 1750, y: 235, baseY: 235, w: 42, h: 28, minX: 1600, maxX: 1980, vx: 125, facing: -1, amp: 26, freq: 2.8 },
    { x: 2450, y: 305, baseY: 305, w: 42, h: 28, minX: 2280, maxX: 2740, vx: 120, facing: 1, amp: 28, freq: 2.7 },
    { x: 3380, y: 310, baseY: 310, w: 42, h: 28, minX: 3200, maxX: 3620, vx: 130, facing: -1, amp: 26, freq: 3.0 },
    { x: 4240, y: 265, baseY: 265, w: 42, h: 28, minX: 4080, maxX: 4460, vx: 130, facing: 1, amp: 24, freq: 2.9 },
  ];

  // Checkpoints (Cozy Cat Houses cleanly seated on platforms)
  const checkpoints = [
    { x: 1915, y: 318, activated: false },
    { x: 3085, y: 363, activated: false },
    { x: 4085, y: 598, activated: false },
  ];

  // Collectible Fish Treats (1 visible on final rope bridge, 2 hidden in Night Vision)
  const treats = [
    { x: 1160, y: 225, collected: false, hiddenInDay: true },
    { x: 4240, y: 345, collected: false, hiddenInDay: false },
    { x: 3320, y: 235, collected: false, hiddenInDay: true },
  ];

  // Victorian Park Lamps
  const lamps = [150, 520, 980, 1450, 1960, 2450, 2980, 3480, 4000, 4460];

  // Exit Gate to Home (نهاية رحلة العودة!)
  const goal = { x: 4625, y: 260, w: 72, h: 80 };

  return {
    stage: 4,
    theme: 'park',
    title: 'المرحلة 4: أعماق الحديقة العامة • Deep Public Park',
    goalLabel: 'بوابة البيت 🏡',
    width,
    height,
    startX: 90,
    startY: 586,
    platforms,
    puddles,
    dogs,
    hedgehogs,
    crows,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
