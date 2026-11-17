window.Game = window.Game || {};

window.Game.createLevel6 = function () {
  const width = 10000;
  const height = 720;

  // Stage 6: High-Rise Rooftops (أسطح المباني الشاهقة — ضعف الطول: 10000px)
  const platforms = [
    // Detailed High-Rise Architectural Buildings (separated by city abysses)
    { x: 0, y: 600, w: 980, h: 120, type: 'rooftop', climbable: false },
    { x: 1620, y: 560, w: 900, h: 160, type: 'rooftop', climbable: false },
    { x: 2820, y: 590, w: 1100, h: 130, type: 'rooftop', climbable: false },
    { x: 4380, y: 540, w: 860, h: 180, type: 'rooftop', climbable: false },
    { x: 5820, y: 580, w: 1180, h: 140, type: 'rooftop', climbable: false },
    { x: 7500, y: 550, w: 960, h: 170, type: 'rooftop', climbable: false },
    { x: 8960, y: 580, w: 1040, h: 140, type: 'rooftop', climbable: false },

    // Zone 1 (0..1620): Solar Panels, Steam Vent Updraft & Cracked Skylight Tiles
    { x: 340, y: 550, w: 120, h: 50, type: 'solar_panel', oneWay: true },
    { x: 690, y: 572, w: 68, h: 28, type: 'steam_vent', oneWay: false, phase: 0.2 },
    { x: 845, y: 425, w: 120, h: 22, type: 'crumble', oneWay: true },
    { x: 1075, y: 445, w: 135, h: 22, type: 'seesaw', oneWay: true },
    { x: 1335, y: 495, w: 125, h: 22, type: 'crumble', oneWay: true },

    // Zone 2 (1620..2820): Water Tower, Secret Fish #1, Steam Vent & Sagging Cable
    { x: 1880, y: 450, w: 130, h: 110, type: 'watertower', oneWay: true },
    { x: 1870, y: 270, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 2220, y: 532, w: 68, h: 28, type: 'steam_vent', oneWay: false, phase: 1.4 },
    { x: 2530, y: 510, w: 235, h: 12, type: 'cable', oneWay: true, narrow: true },

    // Zone 3 (2820..4380): Penthouse Solar Array, Guard Dog #1, Seesaw & Gondola
    { x: 3120, y: 540, w: 120, h: 50, type: 'solar_panel', oneWay: true },
    { x: 3650, y: 558, w: 115, h: 32, type: 'skylight', oneWay: true, bouncy: true },
    {
      x: 3960,
      y: 465,
      w: 135,
      h: 22,
      type: 'gondola',
      oneWay: true,
      moving: true,
      baseX: 3960,
      moveRange: 100,
      moveSpeed: 1.55,
      dx: 0,
      dy: 0,
    },
    { x: 4195, y: 495, w: 125, h: 22, type: 'crumble', oneWay: true },

    // Zone 4 (4380..5820): Steam Lift to Secret Fish #2, Seesaw & Cracked Glass Bridge
    { x: 4630, y: 512, w: 68, h: 28, type: 'steam_vent', oneWay: false, phase: 0.7 },
    { x: 4605, y: 255, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 4980, y: 490, w: 96, h: 50, type: 'ac_unit', oneWay: false },
    { x: 5270, y: 495, w: 125, h: 22, type: 'crumble', oneWay: true },
    { x: 5525, y: 515, w: 145, h: 22, type: 'seesaw', oneWay: true },

    // Zone 5 (5820..7500): HVAC Labyrinth, Water Tower (Fish #3), Steam Vent & Crane Girder
    { x: 6080, y: 525, w: 96, h: 55, type: 'ac_unit', oneWay: false },
    { x: 6390, y: 470, w: 130, h: 110, type: 'watertower', oneWay: true },
    { x: 6760, y: 552, w: 68, h: 28, type: 'steam_vent', oneWay: false, phase: 1.9 },
    {
      x: 7025,
      y: 440,
      w: 150,
      h: 24,
      type: 'girder',
      oneWay: true,
      moving: true,
      baseX: 7025,
      moveRange: 90,
      moveSpeed: -1.65,
      dx: 0,
      dy: 0,
    },
    { x: 7295, y: 495, w: 130, h: 24, type: 'girder', oneWay: true },

    // Zone 6 (7500..8960): Solar Array, Cracked Tiles, Cable & Gondola
    { x: 7830, y: 500, w: 120, h: 50, type: 'solar_panel', oneWay: true },
    { x: 8140, y: 505, w: 125, h: 22, type: 'crumble', oneWay: true },
    { x: 8425, y: 465, w: 220, h: 12, type: 'cable', oneWay: true, narrow: true },
    {
      x: 8715,
      y: 505,
      w: 140,
      h: 22,
      type: 'gondola',
      oneWay: true,
      moving: true,
      baseX: 8715,
      moveRange: 75,
      moveSpeed: 1.7,
      dx: 0,
      dy: 0,
    },

    // Zone 7 (8960..10000): Summit Penthouse & Home Terrace Gate
    { x: 9240, y: 525, w: 96, h: 55, type: 'ac_unit', oneWay: false },
    { x: 9540, y: 515, w: 105, h: 65, type: 'crate', oneWay: false },
    { x: 9685, y: 445, w: 260, h: 135, type: 'rooftop', oneWay: false },
  ];

  const puddles = [];

  // Guard Dogs on wide penthouse terraces (respond to Shift stealth & Q meow)
  const dogs = [
    {
      x: 3290,
      y: 546,
      w: 58,
      h: 44,
      minX: 3255,
      maxX: 3590,
      vx: 115,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 6200,
      y: 536,
      w: 58,
      h: 44,
      minX: 6185,
      maxX: 6680,
      vx: 122,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
  ];

  // Stocky Fluffy Rooftop Raccoons (الراكون المتسلل)
  const raccoons = [
    { x: 500, y: 560, w: 54, h: 40, minX: 470, maxX: 660, vx: 78, facing: 1 },
    { x: 4780, y: 500, w: 54, h: 40, minX: 4715, maxX: 4955, vx: 82, facing: -1 },
    { x: 7600, y: 510, w: 54, h: 40, minX: 7540, maxX: 7805, vx: 82, facing: 1 },
  ];

  // Great Horned Night Owls (بومة الأسطح الليلية) swooping over skyscraper chasms
  const falcons = [
    { x: 1220, y: 315, baseY: 315, w: 52, h: 34, minX: 1020, maxX: 1540, vx: 128, facing: 1, amp: 24, freq: 2.3 },
    { x: 5340, y: 345, baseY: 345, w: 52, h: 34, minX: 5180, maxX: 5720, vx: 132, facing: -1, amp: 26, freq: 2.4 },
    { x: 8560, y: 325, baseY: 325, w: 52, h: 34, minX: 8360, maxX: 8920, vx: 135, facing: 1, amp: 24, freq: 2.5 },
  ];

  // Fast Rooftop Rats near vents
  const rats = [
    { x: 2340, y: 536, w: 38, h: 24, minX: 2305, maxX: 2490, vx: 112, facing: -1 },
    { x: 9080, y: 556, w: 38, h: 24, minX: 9020, maxX: 9220, vx: 115, facing: 1 },
  ];

  // Checkpoints (Cozy Cat Houses seated on rooftops)
  const checkpoints = [
    { x: 2870, y: 558, activated: false },
    { x: 5870, y: 548, activated: false },
    { x: 7550, y: 518, activated: false },
  ];

  // Collectible Fish Treats
  const treats = [
    { x: 1945, y: 230, collected: false, hiddenInDay: true },
    { x: 4675, y: 215, collected: false, hiddenInDay: true },
    { x: 6455, y: 420, collected: false, hiddenInDay: false },
  ];

  // Rooftop Floodlights across 10000px
  const lamps = [
    140, 560, 1700, 2120, 2900, 3500, 4460, 5120,
    5900, 6580, 7580, 8280, 9040, 9480, 9820,
  ];

  // Summit Exit Gate
  const goal = { x: 9830, y: 365, w: 72, h: 80 };

  return {
    stage: 6,
    theme: 'rooftop',
    title: 'المرحلة 6: أسطح المباني الشاهقة • High-Rise Rooftops',
    goalLabel: 'بوابة القمة 🏙️',
    width,
    height,
    startX: 85,
    startY: 556,
    platforms,
    puddles,
    dogs,
    raccoons,
    falcons,
    rats,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
