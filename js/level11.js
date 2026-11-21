window.Game = window.Game || {};

window.Game.createLevel11 = function () {
  const width = 5600;
  const height = 720;

  // Stage 11: Old Town & Astronomical Clocktower (الحي القديم وبرج الساعة)
  // Signature New Obstacles: Giant Rotating Antique Brass Clockwork Gears, Phase Glass Skylights, Bakery Awnings
  // Signature New Enemies: Antique Brass Clockwork Beetles & Nocturnal Striped Skunks (with stink clouds!)
  const platforms = [
    { x: 0, y: 630, w: 800, h: 90, type: 'cobble', climbable: false },
    { x: 1080, y: 630, w: 940, h: 90, type: 'cobble', climbable: false },
    { x: 2340, y: 630, w: 960, h: 90, type: 'cobble', climbable: false },
    { x: 3620, y: 630, w: 960, h: 90, type: 'cobble', climbable: false },
    { x: 4880, y: 630, w: 720, h: 90, type: 'cobble', climbable: false },

    // Zone 1: Bakery Street -> Bouncy Striped Awning & Giant Rotating Brass Clock Gear over Canal #1!
    { x: 250, y: 560, w: 72, h: 70, type: 'barrel', oneWay: false },
    { x: 400, y: 510, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 585, y: 395, w: 165, h: 24, type: 'stall', oneWay: true },
    { x: 860, y: 535, w: 136, h: 136, type: 'clock_gear', oneWay: true, spinDir: 1, spinSpeed: 1.2 },

    // Zone 2: Clocktower Belfry -> Brick Wall-Jump Chimney, Secret Fish #1 & Twin Counter-Spinning Gears
    { x: 1260, y: 375, w: 46, h: 255, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1405, y: 285, w: 46, h: 260, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1455, y: 370, w: 165, h: 24, type: 'fireescape', oneWay: true },
    { x: 1345, y: 215, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 1760, y: 540, w: 128, h: 128, type: 'clock_gear', oneWay: true, spinDir: -1, spinSpeed: 1.15 },

    // Gap 2 Crossing -> Giant Gear (comfortably 95px above street!)
    { x: 2095, y: 535, w: 136, h: 136, type: 'clock_gear', oneWay: true, spinDir: 1, spinSpeed: 1.25 },

    // Zone 3: Clockmaker Square -> High Apartment Clothesline (Fish #2) & Hanging Wooden Canal Bridge
    { x: 2520, y: 515, w: 110, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 2705, y: 385, w: 235, h: 12, type: 'clothesline', oneWay: true, narrow: true },
    { x: 3020, y: 495, w: 145, h: 24, type: 'stall', oneWay: true },
    {
      x: 3390,
      y: 525,
      w: 140,
      h: 18,
      type: 'swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 3390,
      baseY: 525,
      moveRange: 42,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },

    // Zone 4: Bell Alley -> Gear Ascent to Secret Fish #3 & Reverse Gear Bridge
    { x: 3810, y: 535, w: 130, h: 130, type: 'clock_gear', oneWay: true, spinDir: 1, spinSpeed: 1.25 },
    { x: 4035, y: 435, w: 160, h: 24, type: 'stall', oneWay: true },
    { x: 4045, y: 315, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 4320, y: 540, w: 130, h: 130, type: 'clock_gear', oneWay: true, spinDir: -1, spinSpeed: 1.25 },
    { x: 4660, y: 535, w: 136, h: 136, type: 'clock_gear', oneWay: true, spinDir: 1, spinSpeed: 1.3 },

    // Zone 5: Old Town Gate Tower
    { x: 5060, y: 525, w: 110, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 5245, y: 375, w: 295, h: 255, type: 'brickwall', oneWay: false, climbable: true },
  ];

  const puddles = [
    { x: 800, y: 636, w: 280, h: 24 },
    { x: 2020, y: 636, w: 320, h: 24 },
    { x: 3300, y: 636, w: 320, h: 24 },
    { x: 4580, y: 636, w: 300, h: 24 },
  ];
  const dogs = [];

  // Brand-New Antique Brass Clockwork Beetles!
  const clockwork_beetles = [
    { x: 560, y: 600, w: 42, h: 30, minX: 430, maxX: 760, vx: 88, facing: 1, phase: 0.2 },
    { x: 1620, y: 600, w: 42, h: 30, minX: 1470, maxX: 1960, vx: 95, facing: -1, phase: 1.1 },
    { x: 3040, y: 600, w: 42, h: 30, minX: 2860, maxX: 3250, vx: 100, facing: 1, phase: 0.5 },
    { x: 4160, y: 600, w: 42, h: 30, minX: 3960, maxX: 4510, vx: 104, facing: -1, phase: 1.8 },
  ];

  // Brand-New Nocturnal Striped Skunks (with green stink clouds!)
  const skunks = [
    { x: 1180, y: 598, w: 44, h: 32, minX: 1110, maxX: 1245, vx: 65, facing: 1, phase: 0.4 },
    { x: 2660, y: 598, w: 44, h: 32, minX: 2440, maxX: 2820, vx: 72, facing: -1, phase: 1.6 },
    { x: 3740, y: 598, w: 44, h: 32, minX: 3650, maxX: 3940, vx: 72, facing: 1, phase: 0.9 },
    { x: 5010, y: 598, w: 44, h: 32, minX: 4920, maxX: 5200, vx: 76, facing: -1, phase: 2.1 },
  ];

  const checkpoints = [
    { x: 1505, y: 338, activated: false },
    { x: 2395, y: 598, activated: false },
    { x: 3675, y: 598, activated: false },
  ];

  const treats = [
    { x: 1418, y: 175, collected: false, hiddenInDay: true },
    { x: 2825, y: 345, collected: false, hiddenInDay: false },
    { x: 4118, y: 245, collected: false, hiddenInDay: true },
  ];

  const lamps = [160, 680, 1140, 1820, 2440, 3100, 3740, 4420, 4960, 5360];
  const goal = { x: 5365, y: 295, w: 72, h: 80 };

  return {
    stage: 11,
    theme: 'oldtown',
    title: 'المرحلة 11',
    goalLabel: 'الميناء العاصف ⛈️',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    clockwork_beetles,
    skunks,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
