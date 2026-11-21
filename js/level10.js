window.Game = window.Game || {};

window.Game.createLevel10 = function () {
  const width = 5800;
  const height = 720;

  // Stage 10: Foggy Suspension Bridge (الجسر المعلق الضبابي)
  // Signature New Obstacles: Horizontal Crosswind Gust Zones (Tailwind & Headwind), Vintage Aerial Cable Cars, Bridge Steel Decks
  // Signature New Enemies: Giant Swooping Coastal Pelicans & Bounding Sly Red Foxes
  const platforms = [
    { x: 0, y: 610, w: 800, h: 110, type: 'bridge_deck', climbable: false },
    { x: 1200, y: 590, w: 880, h: 130, type: 'bridge_deck', climbable: false },
    { x: 2520, y: 610, w: 920, h: 110, type: 'bridge_deck', climbable: false },
    { x: 3880, y: 580, w: 900, h: 140, type: 'bridge_deck', climbable: false },
    { x: 5180, y: 600, w: 620, h: 120, type: 'bridge_deck', climbable: false },

    // Zone 1: South Tower Span -> Tailwind Wind Stream helping launch over wide river gap!
    { x: 360, y: 536, w: 175, h: 74, type: 'car', variant: 'van', oneWay: true },
    { x: 760, y: 380, w: 460, h: 210, type: 'wind_zone', windDir: 1, windForce: 430 },
    { x: 920, y: 495, w: 165, h: 20, type: 'girder', oneWay: true },

    // Zone 2: Mid-Span -> Headwind Zone (crouch to anchor!), Cable Car & Secret Fish #1
    { x: 1360, y: 410, w: 340, h: 175, type: 'wind_zone', windDir: -1, windForce: 360 },
    { x: 1460, y: 485, w: 150, h: 22, type: 'girder', oneWay: true },
    { x: 1525, y: 365, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 1850, y: 510, w: 120, h: 22, type: 'crumble', oneWay: true },
    {
      x: 2215,
      y: 485,
      w: 145,
      h: 24,
      type: 'cable_car',
      oneWay: true,
      moving: true,
      baseX: 2215,
      moveRange: 105,
      moveSpeed: 1.55,
      dx: 0,
      dy: 0,
    },

    // Zone 3: Main Red Suspension Arch -> Bouncy Highway Safety Tires, High Suspension Cable (Fish #2) & Cable Car
    { x: 2740, y: 535, w: 86, h: 75, type: 'tire_bounce', oneWay: true, bouncy: true },
    { x: 2925, y: 395, w: 230, h: 12, type: 'cable', oneWay: true, narrow: true },
    { x: 3220, y: 485, w: 135, h: 22, type: 'seesaw', oneWay: true },
    {
      x: 3580,
      y: 495,
      w: 145,
      h: 24,
      type: 'cable_car',
      oneWay: true,
      moving: true,
      baseX: 3580,
      moveRange: 110,
      moveSpeed: -1.65,
      dx: 0,
      dy: 0,
    },

    // Zone 4: North Fog Span -> Tailwind Boost Gap, Secret Fish #3 & Cracked Steel Walkway
    { x: 4080, y: 505, w: 155, h: 22, type: 'girder', oneWay: true },
    { x: 4160, y: 385, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 4380, y: 495, w: 140, h: 22, type: 'crumble', oneWay: true },
    { x: 4760, y: 370, w: 430, h: 210, type: 'wind_zone', windDir: 1, windForce: 460 },
    { x: 4910, y: 485, w: 155, h: 20, type: 'girder', oneWay: true },

    // Zone 5: Bridge Exit -> Parked Maintenance Van to Old Town Archway
    { x: 5265, y: 526, w: 175, h: 74, type: 'car', variant: 'van', oneWay: true },
    { x: 5500, y: 435, w: 250, h: 165, type: 'bridge_deck', oneWay: false },
  ];

  const puddles = [];
  const dogs = [];

  // 100% Bridge-Logical Enemies: Flashing Highway Maintenance Rovers & Coastal Pelicans!
  const bridge_rovers = [
    { x: 1560, y: 550, w: 56, h: 40, minX: 1280, maxX: 1960, vx: 98, facing: -1 },
    { x: 2980, y: 570, w: 56, h: 40, minX: 2840, maxX: 3340, vx: 105, facing: 1 },
    { x: 4240, y: 540, w: 56, h: 40, minX: 3960, maxX: 4660, vx: 112, facing: -1 },
  ];

  const pelicans = [
    { x: 960, y: 295, baseY: 295, w: 68, h: 34, minX: 780, maxX: 1220, vx: 118, facing: 1, dip: 68 },
    { x: 2280, y: 300, baseY: 300, w: 68, h: 34, minX: 2040, maxX: 2540, vx: 122, facing: -1, dip: 72 },
    { x: 3620, y: 290, baseY: 290, w: 68, h: 34, minX: 3380, maxX: 3900, vx: 126, facing: 1, dip: 70 },
    { x: 4920, y: 305, baseY: 305, w: 68, h: 34, minX: 4720, maxX: 5200, vx: 128, facing: -1, dip: 66 },
  ];

  const checkpoints = [
    { x: 1245, y: 558, activated: false },
    { x: 2565, y: 578, activated: false },
    { x: 3925, y: 548, activated: false },
  ];

  const treats = [
    { x: 1598, y: 325, collected: false, hiddenInDay: true },
    { x: 3040, y: 355, collected: false, hiddenInDay: false },
    { x: 4232, y: 345, collected: false, hiddenInDay: true },
  ];

  const lamps = [160, 680, 1280, 1880, 2600, 3260, 3960, 4620, 5260, 5600];
  const goal = { x: 5605, y: 355, w: 72, h: 80 };

  return {
    stage: 10,
    theme: 'bridge',
    title: 'المرحلة 10',
    goalLabel: 'الحي القديم 🕰️',
    width,
    height,
    startX: 85,
    startY: 566,
    platforms,
    puddles,
    dogs,
    bridge_rovers,
    pelicans,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
