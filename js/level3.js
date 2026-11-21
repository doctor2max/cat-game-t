window.Game = window.Game || {};

window.Game.createLevel3 = function () {
  const width = 4800;
  const height = 720;

  // Stage 3: The Public Park (الحديقة العامة الليلية)
  const platforms = [
    // Ground lush park turf segments (separated by deep park ponds & streams)
    { x: 0, y: 630, w: 680, h: 90, type: 'grass', climbable: false },
    { x: 850, y: 630, w: 740, h: 90, type: 'grass', climbable: false },
    { x: 1770, y: 630, w: 860, h: 90, type: 'grass', climbable: false },
    { x: 2810, y: 630, w: 820, h: 90, type: 'grass', climbable: false },
    { x: 3810, y: 630, w: 990, h: 90, type: 'grass', climbable: false },

    // Zone 1: Park Entrance — Wooden benches, mossy stone pillar & bouncy mushroom
    { x: 230, y: 580, w: 110, h: 50, type: 'bench', oneWay: true },
    { x: 410, y: 515, w: 95, h: 24, type: 'mushroom', oneWay: true, bouncy: true },
    { x: 560, y: 390, w: 145, h: 22, type: 'branch', oneWay: true },

    // Moving wooden footbridge over Pond #1
    {
      x: 720,
      y: 470,
      w: 115,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 720,
      moveRange: 85,
      moveSpeed: 1.9,
      dx: 0,
      dy: 0,
    },

    // Zone 2: Old Oak Canopy & Secret Fish #1
    {
      x: 960,
      y: 540,
      w: 115,
      h: 16,
      type: 'swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 960,
      baseY: 540,
      moveRange: 22,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },
    { x: 1150, y: 455, w: 140, h: 22, type: 'branch', oneWay: true },
    { x: 1350, y: 365, w: 150, h: 22, type: 'branch', oneWay: true },
    // Secret Night-Vision branch #1 (Fish #1 above!)
    { x: 1140, y: 240, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },

    // Zone 3: Mossy Stone Arch Wall-Jump over Pond #2
    { x: 1550, y: 330, w: 46, h: 300, type: 'stonewall', oneWay: false, climbable: true },
    { x: 1720, y: 235, w: 46, h: 285, type: 'stonewall', oneWay: false, climbable: true },
    { x: 1770, y: 325, w: 165, h: 22, type: 'branch', oneWay: true },

    // Zone 4: Fountain Plaza — Vertical moving stone lift + narrow rope bridge + bouncy mushroom
    {
      x: 2010,
      y: 430,
      w: 115,
      h: 22,
      type: 'stonewall',
      oneWay: true,
      moving: true,
      baseX: 2010,
      baseY: 430,
      moveRange: 0,
      moveYRange: 85,
      moveSpeed: 1.8,
      dx: 0,
      dy: 0,
    },
    { x: 2190, y: 395, w: 230, h: 12, type: 'clothesline', oneWay: true, narrow: true },
    { x: 2475, y: 515, w: 105, h: 24, type: 'mushroom', oneWay: true, bouncy: true },

    // Moving bridge over Pond #3
    {
      x: 2660,
      y: 425,
      w: 115,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 2660,
      moveRange: 105,
      moveSpeed: 2.15,
      dx: 0,
      dy: 0,
    },

    // Zone 5: Hedgehog Meadow & High Canopy (Fish #2 & #3)
    { x: 2890, y: 495, w: 160, h: 22, type: 'branch', oneWay: true },
    { x: 3120, y: 410, w: 145, h: 22, type: 'branch', oneWay: true },
    // Secret Night-Vision branch #2 (Fish #3 above!)
    { x: 3320, y: 295, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    {
      x: 3440,
      y: 525,
      w: 120,
      h: 16,
      type: 'swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 3440,
      baseY: 525,
      moveRange: 22,
      moveSpeed: 1.6,
      dx: 0,
      dy: 0,
    },

    // Zone 6: Final Pond Crossing & Home Garden Wall
    {
      x: 3655,
      y: 455,
      w: 110,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 3655,
      moveRange: 95,
      moveSpeed: 2.25,
      dx: 0,
      dy: 0,
    },
    { x: 3910, y: 530, w: 105, h: 24, type: 'mushroom', oneWay: true, bouncy: true },
    { x: 4090, y: 405, w: 155, h: 22, type: 'branch', oneWay: true },
    { x: 4310, y: 345, w: 46, h: 285, type: 'stonewall', oneWay: false, climbable: true },
    { x: 4480, y: 340, w: 250, h: 290, type: 'stonewall', oneWay: false, climbable: true },
  ];

  // Park water ponds & streams (hazards)
  const puddles = [
    { x: 680, y: 636, w: 170, h: 22 },
    { x: 1590, y: 636, w: 180, h: 22 },
    { x: 2630, y: 636, w: 180, h: 22 },
    { x: 3630, y: 636, w: 180, h: 22 },
  ];

  // Park Guard Dogs (faster & wider patrol)
  const dogs = [
    {
      x: 1080,
      y: 586,
      w: 58,
      h: 44,
      minX: 900,
      maxX: 1490,
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
      minX: 1820,
      maxX: 2520,
      vx: 125,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 3150,
      y: 586,
      w: 58,
      h: 44,
      minX: 2860,
      maxX: 3540,
      vx: 130,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 4050,
      y: 586,
      w: 58,
      h: 44,
      minX: 3860,
      maxX: 4240,
      vx: 125,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
  ];

  // New Enemy #1: Nocturnal Spiky Hedgehogs (القنافذ الشوكية) patrolling ground & branches (kept completely clear of checkpoints!)
  const hedgehogs = [
    { x: 290, y: 604, w: 36, h: 26, minX: 220, maxX: 540, vx: 65, facing: 1 },
    { x: 1390, y: 339, w: 36, h: 26, minX: 1355, maxX: 1460, vx: 45, facing: -1 },
    { x: 3920, y: 604, w: 36, h: 26, minX: 3840, maxX: 4230, vx: 75, facing: 1 },
  ];

  // New Enemy #2: Swooping Night Crows (الغربان الليلية) patrolling upper canopy (kept strictly away from checkpoints!)
  const crows = [
    { x: 640, y: 310, baseY: 310, w: 42, h: 28, minX: 520, maxX: 880, vx: 110, facing: 1, amp: 24, freq: 2.6 },
    { x: 2080, y: 245, baseY: 245, w: 42, h: 28, minX: 1985, maxX: 2280, vx: 125, facing: -1, amp: 28, freq: 2.9 },
    { x: 2480, y: 300, baseY: 300, w: 42, h: 28, minX: 2360, maxX: 2740, vx: 120, facing: 1, amp: 26, freq: 2.7 },
    { x: 3360, y: 325, baseY: 325, w: 42, h: 28, minX: 3180, maxX: 3600, vx: 135, facing: -1, amp: 30, freq: 3.1 },
    { x: 4350, y: 260, baseY: 260, w: 42, h: 28, minX: 4275, maxX: 4470, vx: 130, facing: 1, amp: 24, freq: 3.0 },
  ];

  // Checkpoints (Cozy Cat Houses)
  const checkpoints = [
    { x: 1835, y: 293, activated: false },
    { x: 2945, y: 463, activated: false },
    { x: 4145, y: 373, activated: false },
  ];

  // Collectible Fish Treats (1 visible on narrow rope bridge, 2 hidden in Night Vision)
  const treats = [
    { x: 1210, y: 200, collected: false, hiddenInDay: true },
    { x: 2305, y: 350, collected: false, hiddenInDay: false },
    { x: 3390, y: 255, collected: false, hiddenInDay: true },
  ];

  // Victorian Park Lamps
  const lamps = [160, 560, 1020, 1480, 1980, 2480, 3020, 3520, 4020, 4440];

  // Exit Gate to Home (نهاية رحلة العودة!)
  const goal = { x: 4605, y: 260, w: 72, h: 80 };

  return {
    stage: 3,
    theme: 'park',
    title: 'المرحلة 3: الحديقة العامة الليلية • The Public Park',
    goalLabel: 'بوابة البيت 🏡',
    width,
    height,
    startX: 100,
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
