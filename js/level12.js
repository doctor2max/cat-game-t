window.Game = window.Game || {};

window.Game.createLevel12 = function () {
  const width = 6200;
  const height = 720;

  // Stage 12: Stormy Harbor Freighters (الميناء العاصف والسفن العملاقة)
  // Signature New Obstacles: Slippery Rain-Slick Oil Decks, Swinging Crane Cargo Containers, Storm Gale Crosswinds
  // Signature New Enemies: Crackling Electric Leaping Sea-Eels & Giant Dock Octopus Tentacles!
  const platforms = [
    { x: 0, y: 630, w: 740, h: 90, type: 'pier', climbable: false },
    { x: 1160, y: 630, w: 860, h: 90, type: 'oil_deck', climbable: false },
    { x: 2620, y: 630, w: 920, h: 90, type: 'pier', climbable: false },
    { x: 4020, y: 630, w: 880, h: 90, type: 'oil_deck', climbable: false },
    { x: 5360, y: 630, w: 840, h: 90, type: 'pier', climbable: false },

    // Zone 1: Storm Pier -> Swinging Blue Cargo Container over Electric Eel Channel #1
    { x: 420, y: 545, w: 115, h: 85, type: 'crate', oneWay: false },
    {
      x: 865,
      y: 525,
      w: 155,
      h: 46,
      type: 'cargo_container',
      color: '#1d4ed8',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 865,
      baseY: 525,
      moveRange: 85,
      moveSpeed: 1.55,
      dx: 0,
      dy: 0,
    },

    // Zone 2: Rain-Slick Freighter Oil Deck -> Low Friction Slide, Vertical Lift & Secret Fish #1
    { x: 1360, y: 400, w: 360, h: 215, type: 'wind_zone', windDir: 1, windForce: 320 },
    {
      x: 1680,
      y: 475,
      w: 135,
      h: 24,
      type: 'girder',
      oneWay: true,
      moving: true,
      baseX: 1680,
      baseY: 475,
      moveRange: 0,
      moveYRange: 85,
      moveSpeed: 1.8,
      dx: 0,
      dy: 0,
    },
    { x: 1475, y: 275, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },

    // Wide Storm Channel #2 -> Twin Swinging Red & Emerald Cargo Containers!
    {
      x: 2120,
      y: 505,
      w: 150,
      h: 46,
      type: 'cargo_container',
      color: '#b91c1c',
      oneWay: true,
      moving: true,
      baseX: 2120,
      moveRange: 75,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },
    {
      x: 2410,
      y: 480,
      w: 150,
      h: 46,
      type: 'cargo_container',
      color: '#047857',
      oneWay: true,
      moving: true,
      baseX: 2410,
      moveRange: 75,
      moveSpeed: -1.7,
      dx: 0,
      dy: 0,
    },

    // Zone 3: Octopus Wharf -> Bouncy Buoy, High Rigging (Fish #2) & Swinging Yellow Container
    { x: 2890, y: 540, w: 96, h: 90, type: 'buoy', oneWay: true, bouncy: true },
    { x: 3060, y: 395, w: 235, h: 12, type: 'rigging', oneWay: true, narrow: true },
    {
      x: 3685,
      y: 525,
      w: 155,
      h: 46,
      type: 'cargo_container',
      color: '#d97706',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 3685,
      baseY: 525,
      moveRange: 95,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },

    // Zone 4: Slippery Storm Pier #2 -> Buoy Launch to Secret Fish #3, Headwind & Cable
    { x: 4210, y: 540, w: 96, h: 90, type: 'buoy', oneWay: true, bouncy: true },
    { x: 4185, y: 275, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 4440, y: 400, w: 320, h: 215, type: 'wind_zone', windDir: -1, windForce: 340 },
    { x: 4990, y: 525, w: 260, h: 12, type: 'rigging', oneWay: true, narrow: true },

    // Zone 5: Exit Lighthouse Pier
    { x: 5620, y: 545, w: 110, h: 85, type: 'crate', oneWay: false },
    { x: 5790, y: 455, w: 340, h: 175, type: 'pier', oneWay: false },
  ];

  const puddles = [
    { x: 740, y: 636, w: 420, h: 28 },
    { x: 2020, y: 636, w: 600, h: 28 },
    { x: 3540, y: 636, w: 480, h: 28 },
    { x: 4900, y: 636, w: 460, h: 28 },
  ];
  const dogs = [];

  // Brand-New Crackling Electric Leaping Sea-Eels!
  const leaping_fish = [
    { x: 960, baseY: 645, jumpH: 220, period: 3.1, phase: 0.3 },
    { x: 2295, baseY: 645, jumpH: 235, period: 3.3, phase: 1.4 },
    { x: 3770, baseY: 645, jumpH: 225, period: 3.0, phase: 0.8 },
    { x: 5110, baseY: 645, jumpH: 230, period: 3.2, phase: 1.9 },
  ];

  // Brand-New Giant Storm Octopus Tentacles erupting from piers!
  const tentacles = [
    { x: 610, baseY: 630, maxH: 118, phase: 0.4 },
    { x: 1560, baseY: 630, maxH: 122, phase: 1.8 },
    { x: 3180, baseY: 630, maxH: 125, phase: 0.9 },
    { x: 4620, baseY: 630, maxH: 122, phase: 2.2 },
    { x: 5510, baseY: 630, maxH: 118, phase: 1.1 },
  ];

  const checkpoints = [
    { x: 1215, y: 598, activated: false },
    { x: 2675, y: 598, activated: false },
    { x: 4075, y: 598, activated: false },
  ];

  const treats = [
    { x: 1545, y: 235, collected: false, hiddenInDay: true },
    { x: 3175, y: 355, collected: false, hiddenInDay: false },
    { x: 4258, y: 235, collected: false, hiddenInDay: true },
  ];

  const lamps = [160, 640, 1260, 1880, 2720, 3380, 4120, 4760, 5440, 5980];
  const goal = { x: 5975, y: 375, w: 72, h: 80 };

  return {
    stage: 12,
    theme: 'harbor_storm',
    title: 'المرحلة 12',
    goalLabel: 'البيت الزجاجي 🌿',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    leaping_fish,
    tentacles,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
