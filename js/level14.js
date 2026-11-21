window.Game = window.Game || {};

window.Game.createLevel14 = function () {
  const width = 6600;
  const height = 720;

  // Stage 14: Neon Cyberpunk Skyline (ناطحات السحاب النيونية)
  // Signature New Obstacles: Electric Neon Turbo Boost Pads, Phase-Shifting Hologram Bridges, Laser Barrier Gates
  // Signature New Enemies: 6-Legged Cybernetic Neon Spider-Bots on Laser Silk & High-Speed Plasma Hover-Saws!
  const platforms = [
    { x: 0, y: 600, w: 880, h: 120, type: 'neon_deck', climbable: false },
    { x: 1360, y: 570, w: 940, h: 150, type: 'neon_deck', climbable: false },
    { x: 2780, y: 590, w: 980, h: 130, type: 'neon_deck', climbable: false },
    { x: 4240, y: 560, w: 960, h: 160, type: 'neon_deck', climbable: false },
    { x: 5680, y: 580, w: 920, h: 140, type: 'neon_deck', climbable: false },

    // Zone 1: Neon Launchpad -> Turbo Boost Strip launching across glowing Phase Bridge!
    { x: 360, y: 584, w: 165, h: 16, type: 'boost_pad', boostDir: 1, oneWay: true },
    { x: 640, y: 584, w: 185, h: 16, type: 'boost_pad', boostDir: 1, oneWay: true },
    { x: 965, y: 505, w: 145, h: 20, type: 'phase_platform', oneWay: true, phase: 0.0 },
    { x: 1175, y: 490, w: 135, h: 20, type: 'phase_platform', oneWay: true, phase: 1.4 },

    // Zone 2: Cyber Billboard Plaza -> Laser Gate, Bouncy Skylight to Secret Fish #1, Turbo Gap
    { x: 1560, y: 556, w: 140, h: 14, type: 'laser_grid', oneWay: false, phase: 0.3 },
    { x: 1810, y: 538, w: 115, h: 32, type: 'skylight', oneWay: true, bouncy: true },
    { x: 1790, y: 295, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 2045, y: 554, w: 195, h: 16, type: 'boost_pad', boostDir: 1, oneWay: true },
    { x: 2430, y: 495, w: 140, h: 20, type: 'phase_platform', oneWay: true, phase: 0.6 },
    { x: 2610, y: 495, w: 135, h: 20, type: 'phase_platform', oneWay: true, phase: 2.0 },

    // Zone 3: Hover-Saw Skyway -> High Hologram Deck (Fish #2), Laser Gate & Phase Bridge
    { x: 3000, y: 500, w: 150, h: 20, type: 'phase_platform', oneWay: true, phase: 0.2 },
    { x: 3220, y: 425, w: 195, h: 20, type: 'catwalk', oneWay: true },
    { x: 3480, y: 576, w: 145, h: 14, type: 'laser_grid', oneWay: false, phase: 1.5 },
    { x: 3860, y: 505, w: 140, h: 20, type: 'phase_platform', oneWay: true, phase: 0.4 },
    { x: 4050, y: 485, w: 140, h: 20, type: 'phase_platform', oneWay: true, phase: 1.7 },

    // Zone 4: Holo-Spire -> Bouncy Skylight to Secret Fish #3, Turbo Boost Launch over Abyss!
    { x: 4460, y: 528, w: 115, h: 32, type: 'skylight', oneWay: true, bouncy: true },
    { x: 4445, y: 275, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 4720, y: 546, w: 140, h: 14, type: 'laser_grid', oneWay: false, phase: 0.7 },
    { x: 4970, y: 544, w: 205, h: 16, type: 'boost_pad', boostDir: 1, oneWay: true },
    { x: 5340, y: 480, w: 155, h: 20, type: 'phase_platform', oneWay: true, phase: 0.2 },

    // Zone 5: Summit Helipad -> Dawn Homeward Gate
    { x: 5940, y: 548, w: 115, h: 32, type: 'skylight', oneWay: true, bouncy: true },
    { x: 6160, y: 400, w: 380, h: 180, type: 'neon_deck', oneWay: false },
  ];

  const puddles = [];
  const dogs = [];

  // Brand-New 6-Legged Cybernetic Neon Spider-Bots dropping on laser silk threads!
  const cyber_spiders = [
    { x: 1090, y: 260, topY: 225, dropDist: 195, w: 34, h: 28, speed: 1.9, phase: 0.2 },
    { x: 2535, y: 260, topY: 230, dropDist: 190, w: 34, h: 28, speed: 2.0, phase: 1.3 },
    { x: 3980, y: 250, topY: 220, dropDist: 195, w: 34, h: 28, speed: 2.1, phase: 0.7 },
    { x: 5455, y: 260, topY: 225, dropDist: 185, w: 34, h: 28, speed: 2.0, phase: 2.0 },
  ];

  // Brand-New High-Speed Plasma Hover-Saws gliding swiftly along neon decks!
  const hover_saws = [
    { x: 1620, y: 530, w: 36, h: 36, minX: 1460, maxX: 2020, vx: 175, facing: 1 },
    { x: 3120, y: 550, w: 36, h: 36, minX: 2860, maxX: 3440, vx: 190, facing: -1 },
    { x: 4640, y: 520, w: 36, h: 36, minX: 4580, maxX: 4940, vx: 185, facing: 1 },
    { x: 5820, y: 540, w: 36, h: 36, minX: 5720, maxX: 6120, vx: 195, facing: -1 },
  ];

  const checkpoints = [
    { x: 1410, y: 538, activated: false },
    { x: 2830, y: 558, activated: false },
    { x: 4290, y: 528, activated: false },
  ];

  const treats = [
    { x: 1865, y: 255, collected: false, hiddenInDay: true },
    { x: 3315, y: 385, collected: false, hiddenInDay: false },
    { x: 4520, y: 235, collected: false, hiddenInDay: true },
  ];

  // Futuristic neon skyline uses glowing holograms & searchlights (no antique streetlamps!)
  const lamps = [];
  const goal = { x: 6395, y: 320, w: 72, h: 80 };

  return {
    stage: 14,
    theme: 'rooftop_neon',
    title: 'المرحلة 14',
    goalLabel: 'شارع المنزل 🌅',
    width,
    height,
    startX: 85,
    startY: 556,
    platforms,
    puddles,
    dogs,
    cyber_spiders,
    hover_saws,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
