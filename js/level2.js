window.Game = window.Game || {};

window.Game.createLevel2 = function () {
  const width = 4200;
  const height = 720;

  // Stage 2: The Night Market (السوق الشعبي الليلي)
  const platforms = [
    // Ground cobblestone segments (leaving gaps for harbor water canals)
    { x: 0, y: 630, w: 740, h: 90, type: 'cobble', climbable: false },
    { x: 890, y: 630, w: 780, h: 90, type: 'cobble', climbable: false },
    { x: 1830, y: 630, w: 860, h: 90, type: 'cobble', climbable: false },
    { x: 2850, y: 630, w: 1350, h: 90, type: 'cobble', climbable: false },

    // Entrance from Stage 1 Market Gate: Wooden barrels & fish crates
    { x: 240, y: 575, w: 64, h: 55, type: 'barrel', oneWay: false },
    { x: 350, y: 530, w: 100, h: 100, type: 'crate', oneWay: false },
    { x: 520, y: 475, w: 140, h: 24, type: 'stall', oneWay: true },

    // Moving hanging cargo lift over Canal #1
    {
      x: 720,
      y: 440,
      w: 110,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 720,
      moveRange: 95,
      moveSpeed: 1.7,
      dx: 0,
    },

    // Market Lane 1: Bouncy striped awnings & high spice-stall roofs
    { x: 960, y: 540, w: 70, h: 90, type: 'barrel', oneWay: false },
    { x: 1110, y: 470, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 1310, y: 365, w: 150, h: 24, type: 'stall', oneWay: true },

    // Secret Night-Vision ledge #1 (Fish #1 above!)
    { x: 1140, y: 245, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },

    // Wall-jump brick market arch over Canal #2
    { x: 1625, y: 340, w: 45, h: 290, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1785, y: 250, w: 45, h: 270, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1830, y: 340, w: 165, h: 24, type: 'fireescape', oneWay: true },

    // Market Lane 2: Clothesline & moving fish-cart bridge over dog patrol
    { x: 2060, y: 420, w: 230, h: 12, type: 'clothesline', oneWay: true, narrow: true },
    {
      x: 2350,
      y: 370,
      w: 120,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 2350,
      moveRange: 115,
      moveSpeed: 2.0,
      dx: 0,
    },
    { x: 2560, y: 520, w: 130, h: 110, type: 'dumpster', oneWay: false },

    // Canal #3 + Bouncy awning + Market balcony
    { x: 2710, y: 510, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 2910, y: 410, w: 160, h: 24, type: 'stall', oneWay: true },

    // Secret Night-Vision ledge #2 (Fish #3 above!)
    { x: 3130, y: 275, w: 140, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },

    // Final Market Climb to Garden Gate
    { x: 3360, y: 540, w: 80, h: 90, type: 'barrel', oneWay: false },
    { x: 3500, y: 485, w: 120, h: 145, type: 'crate', oneWay: false },
    {
      x: 3670,
      y: 410,
      w: 110,
      h: 22,
      type: 'crate',
      oneWay: true,
      moving: true,
      baseX: 3670,
      moveRange: 85,
      moveSpeed: 1.85,
      dx: 0,
    },
    { x: 3920, y: 350, w: 210, h: 280, type: 'brickwall', oneWay: false, climbable: true },
  ];

  // Deep harbor water canals (hazards)
  const puddles = [
    { x: 740, y: 636, w: 150, h: 22 },
    { x: 1670, y: 636, w: 160, h: 22 },
    { x: 2690, y: 636, w: 160, h: 22 },
  ];

  // Market Guard & Stray Dogs
  const dogs = [
    {
      x: 1120,
      y: 586,
      w: 58,
      h: 44,
      minX: 930,
      maxX: 1540,
      vx: 90,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 2020,
      y: 586,
      w: 58,
      h: 44,
      minX: 1870,
      maxX: 2500,
      vx: 105,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 3020,
      y: 586,
      w: 58,
      h: 44,
      minX: 2890,
      maxX: 3310,
      vx: 115,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 3660,
      y: 586,
      w: 58,
      h: 44,
      minX: 3640,
      maxX: 3880,
      vx: 95,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
  ];

  // Checkpoints (Cozy Cat Houses)
  const checkpoints = [
    { x: 1885, y: 308, activated: false },
    { x: 2965, y: 378, activated: false },
  ];

  // Collectible Fish Treats (1 visible, 2 hidden in Night Vision)
  const treats = [
    { x: 1210, y: 205, collected: false, hiddenInDay: true },
    { x: 2175, y: 375, collected: false, hiddenInDay: false },
    { x: 3200, y: 235, collected: false, hiddenInDay: true },
  ];

  // Warm market streetlamps
  const lamps = [160, 620, 1080, 1580, 2120, 2640, 3220, 3820];

  // Exit Gate to Stage 3 (The Neighborhood Gardens)
  const goal = { x: 4005, y: 270, w: 72, h: 80 };

  return {
    stage: 2,
    theme: 'market',
    title: 'المرحلة 2: السوق الشعبي الليلي • The Night Market',
    goalLabel: 'بوابة الحديقة ←',
    width,
    height,
    startX: 110,
    startY: 590,
    platforms,
    puddles,
    dogs,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
