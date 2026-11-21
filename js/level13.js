window.Game = window.Game || {};

window.Game.createLevel13 = function () {
  const width = 6000;
  const height = 720;

  // Stage 13: Royal Botanical Greenhouse (البيت الزجاجي الملكي)
  // Signature New Obstacles: Giant Sinking Floating Lilypads, Dynamic Bouncy Botanical Flowers, Wrought-Iron Glass Walkways
  // Signature New Enemies: Snapping Carnivorous Venus Flytraps & Stinging Greenhouse Honeybees!
  const platforms = [
    { x: 0, y: 630, w: 720, h: 90, type: 'glass_floor', climbable: false },
    { x: 1180, y: 630, w: 860, h: 90, type: 'glass_floor', climbable: false },
    { x: 2540, y: 630, w: 920, h: 90, type: 'glass_floor', climbable: false },
    { x: 3960, y: 630, w: 880, h: 90, type: 'glass_floor', climbable: false },
    { x: 5260, y: 630, w: 740, h: 90, type: 'glass_floor', climbable: false },

    // Zone 1: Lotus Pond Entrance -> Bouncy Hibiscus Flower & Sinking Lilypad Chain over Pond #1!
    { x: 265, y: 545, w: 96, h: 85, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 435, y: 405, w: 175, h: 22, type: 'branch', oneWay: true },
    { x: 765, y: 570, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 965, y: 550, w: 115, h: 20, type: 'sink_pad', oneWay: true },

    // Zone 2: Orchid Dome -> Flower Bounce to Secret Fish #1, Sinking Pads over Pond #2
    { x: 1410, y: 545, w: 96, h: 85, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 1385, y: 270, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 1620, y: 435, w: 165, h: 22, type: 'branch', oneWay: true },
    { x: 2090, y: 560, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 2295, y: 535, w: 115, h: 20, type: 'sink_pad', oneWay: true },

    // Zone 3: Crystal Conservatory -> Wall-Jump Mossy Pillars, High Canopy (Fish #2), Twin Lilypads over Pond #3
    { x: 2720, y: 375, w: 46, h: 255, type: 'stonewall', oneWay: false, climbable: true },
    { x: 2865, y: 285, w: 46, h: 260, type: 'stonewall', oneWay: false, climbable: true },
    { x: 2915, y: 370, w: 185, h: 22, type: 'branch', oneWay: true },
    { x: 3205, y: 545, w: 96, h: 85, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 3520, y: 555, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 3735, y: 530, w: 115, h: 20, type: 'sink_pad', oneWay: true },

    // Zone 4: Bioluminescent Palm Hall -> Flower Launch to Secret Fish #3 & Sinking Pads over Pond #4
    { x: 4230, y: 545, w: 96, h: 85, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 4410, y: 390, w: 170, h: 22, type: 'branch', oneWay: true },
    { x: 4425, y: 265, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 4910, y: 560, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 5095, y: 535, w: 115, h: 20, type: 'sink_pad', oneWay: true },

    // Zone 5: Exit Conservatory Terrace
    { x: 5470, y: 545, w: 96, h: 85, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 5650, y: 395, w: 295, h: 235, type: 'stonewall', oneWay: false, climbable: true },
  ];

  const puddles = [
    { x: 720, y: 636, w: 460, h: 26 },
    { x: 2040, y: 636, w: 500, h: 26 },
    { x: 3460, y: 636, w: 500, h: 26 },
    { x: 4840, y: 636, w: 420, h: 26 },
  ];
  const dogs = [];

  // Brand-New Snapping Carnivorous Venus Flytraps!
  const venus_traps = [
    { x: 580, y: 590, w: 44, h: 40, phase: 0.2 },
    { x: 1620, y: 590, w: 44, h: 40, phase: 1.1 },
    { x: 1840, y: 590, w: 44, h: 40, phase: 2.3 },
    { x: 3060, y: 590, w: 44, h: 40, phase: 0.6 },
    { x: 4540, y: 590, w: 44, h: 40, phase: 1.6 },
    { x: 5360, y: 590, w: 44, h: 40, phase: 0.9 },
  ];

  // Brand-New Stinging Greenhouse Honeybees patrolling around the blossoms & lilyponds!
  const bees = [
    { x: 920, y: 420, baseX: 920, baseY: 420, w: 46, h: 32, rx: 120, ry: 38, freq: 1.45, phase: 0.2, facing: 1 },
    { x: 2260, y: 415, baseX: 2260, baseY: 415, w: 46, h: 32, rx: 128, ry: 40, freq: 1.55, phase: 1.4, facing: -1 },
    { x: 3680, y: 405, baseX: 3680, baseY: 405, w: 46, h: 32, rx: 125, ry: 38, freq: 1.6, phase: 0.8, facing: 1 },
    { x: 5020, y: 415, baseX: 5020, baseY: 415, w: 46, h: 32, rx: 115, ry: 36, freq: 1.55, phase: 2.1, facing: -1 },
  ];

  const checkpoints = [
    { x: 1230, y: 598, activated: false },
    { x: 2960, y: 338, activated: false },
    { x: 4015, y: 598, activated: false },
  ];

  const treats = [
    { x: 1458, y: 230, collected: false, hiddenInDay: true },
    { x: 3005, y: 330, collected: false, hiddenInDay: false },
    { x: 4498, y: 225, collected: false, hiddenInDay: true },
  ];

  // Indoor Victorian glass dome uses hanging glowing terrarium lanterns (no outdoor streetlamps!)
  const lamps = [];
  const goal = { x: 5775, y: 315, w: 72, h: 80 };

  return {
    stage: 13,
    theme: 'greenhouse',
    title: 'المرحلة 13',
    goalLabel: 'أبراج النيون 🌆',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    venus_traps,
    bees,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
