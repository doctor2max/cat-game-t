window.Game = window.Game || {};

window.Game.createLevel7 = function () {
  const width = 14400;
  const height = 720;

  // Stage 7: Grand Train Yard & Underground Metro Station (ساحة القطارات ومحطة الأنفاق الكبرى — ضعف الطول: 14400px)
  const platforms = [
    // Main Concrete Metro Platforms & Track Beds (10 Grand Segments across 14400px)
    { x: 0, y: 630, w: 1080, h: 90, type: 'rail_platform', climbable: false },
    { x: 1480, y: 630, w: 1120, h: 90, type: 'rail_platform', climbable: false },
    { x: 3040, y: 630, w: 1180, h: 90, type: 'rail_platform', climbable: false },
    { x: 4680, y: 630, w: 1240, h: 90, type: 'rail_platform', climbable: false },
    { x: 6360, y: 630, w: 1140, h: 90, type: 'rail_platform', climbable: false },
    { x: 7940, y: 630, w: 1220, h: 90, type: 'rail_platform', climbable: false },
    { x: 9620, y: 630, w: 1180, h: 90, type: 'rail_platform', climbable: false },
    { x: 11240, y: 630, w: 1160, h: 90, type: 'rail_platform', climbable: false },
    { x: 12840, y: 630, w: 1560, h: 90, type: 'rail_platform', climbable: false },

    // Zone 1 (0..1480): Open-Air Marshalling Yard -> Turnstile Bounce, Dumpster Step, Giant Graffiti Freight Car, Signal Bridge & Rail Cart
    { x: 290, y: 580, w: 68, h: 50, type: 'turnstile', oneWay: true, bouncy: true },
    { x: 410, y: 420, w: 185, h: 22, type: 'signal_bridge', oneWay: true },
    { x: 580, y: 566, w: 58, h: 64, type: 'trashbin', oneWay: false },
    { x: 650, y: 498, w: 320, h: 132, type: 'train_car', variant: 'freight', graffiti: true, oneWay: false },
    {
      x: 1140,
      y: 580,
      w: 150,
      h: 26,
      type: 'rail_cart',
      oneWay: true,
      moving: true,
      baseX: 1140,
      moveRange: 105,
      moveSpeed: 1.55,
      dx: 0,
      dy: 0,
    },

    // Zone 2 (1480..3040): Tunnel Entrance -> Escalator Walkway, Overhead Catwalk, Secret Fish #1 & Third Rail
    { x: 1680, y: 535, w: 220, h: 24, type: 'escalator', direction: 1, speed: 105, oneWay: true },
    { x: 1960, y: 430, w: 210, h: 20, type: 'catwalk', oneWay: true },
    { x: 1860, y: 315, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 2220, y: 612, w: 140, h: 18, type: 'third_rail', oneWay: false, phase: 0.3 },
    { x: 2650, y: 505, w: 290, h: 12, type: 'cable', oneWay: true, narrow: true },

    // Zone 3 (3040..4680): Grand Concourse -> Turnstile Gate,Parked Stainless Metro Car, Seesaw & Inspection Cart
    { x: 3260, y: 580, w: 68, h: 50, type: 'turnstile', oneWay: true, bouncy: true },
    { x: 3420, y: 415, w: 215, h: 20, type: 'catwalk', oneWay: true },
    { x: 3615, y: 566, w: 58, h: 64, type: 'trashbin', oneWay: false },
    { x: 3685, y: 498, w: 430, h: 132, type: 'train_car', variant: 'subway', oneWay: false },
    {
      x: 4290,
      y: 575,
      w: 155,
      h: 26,
      type: 'rail_cart',
      oneWay: true,
      moving: true,
      baseX: 4290,
      moveRange: 115,
      moveSpeed: -1.65,
      dx: 0,
      dy: 0,
    },

    // Zone 4 (4680..6360): Central Transfer Hall -> Reverse Escalator, Steam Updraft, Secret Fish #2 & Cracked Tiles
    { x: 4920, y: 535, w: 230, h: 24, type: 'escalator', direction: -1, speed: 95, oneWay: true },
    { x: 5230, y: 602, w: 68, h: 28, type: 'steam_vent', oneWay: false, phase: 0.5 },
    { x: 5200, y: 315, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 5420, y: 430, w: 195, h: 22, type: 'signal_bridge', oneWay: true },
    { x: 5680, y: 612, w: 145, h: 18, type: 'third_rail', oneWay: false, phase: 1.4 },
    { x: 5980, y: 515, w: 135, h: 22, type: 'crumble', oneWay: true },
    { x: 6165, y: 495, w: 135, h: 22, type: 'seesaw', oneWay: true },

    // Zone 5 (6360..7940): Express Track Sidings -> Baggage Trolley, Metro Car, Catwalk (Fish #2) & Cable
    { x: 6620, y: 575, w: 100, h: 55, type: 'baggage_cart', oneWay: true, bouncy: true },
    { x: 6810, y: 405, w: 220, h: 20, type: 'catwalk', oneWay: true },
    { x: 7075, y: 498, w: 420, h: 132, type: 'train_car', variant: 'subway', oneWay: false },
    { x: 7560, y: 485, w: 295, h: 12, type: 'cable', oneWay: true, narrow: true },

    // Zone 6 (7940..9620): Deep Maintenance Vault -> Turnstile, Escalator, Third Rail & Crane Girder
    { x: 8180, y: 580, w: 68, h: 50, type: 'turnstile', oneWay: true, bouncy: true },
    { x: 8340, y: 425, w: 220, h: 24, type: 'escalator', direction: 1, speed: 110, oneWay: true },
    { x: 8660, y: 612, w: 150, h: 18, type: 'third_rail', oneWay: false, phase: 2.1 },
    { x: 8836, y: 565, w: 74, h: 65, type: 'crate', oneWay: false },
    { x: 8920, y: 498, w: 295, h: 132, type: 'train_car', variant: 'freight', oneWay: false },
    {
      x: 9260,
      y: 475,
      w: 155,
      h: 24,
      type: 'girder',
      oneWay: true,
      moving: true,
      baseX: 9260,
      moveRange: 105,
      moveSpeed: 1.6,
      dx: 0,
      dy: 0,
    },

    // Zone 7 (9620..11240): High-Voltage Junction -> Steam Vent, Secret Fish #3, Signal Bridge & Rail Cart
    { x: 9920, y: 602, w: 68, h: 28, type: 'steam_vent', oneWay: false, phase: 1.1 },
    { x: 9890, y: 310, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 10140, y: 425, w: 210, h: 22, type: 'signal_bridge', oneWay: true },
    { x: 10360, y: 498, w: 420, h: 132, type: 'train_car', variant: 'subway', oneWay: false },
    {
      x: 10890,
      y: 575,
      w: 155,
      h: 26,
      type: 'rail_cart',
      oneWay: true,
      moving: true,
      baseX: 10890,
      moveRange: 105,
      moveSpeed: 1.7,
      dx: 0,
      dy: 0,
    },

    // Zone 8 (11240..12840): Mezzanine Overpass -> Turnstile, Catwalk, Seesaw & Cracked Glass Bridge
    { x: 11480, y: 580, w: 68, h: 50, type: 'turnstile', oneWay: true, bouncy: true },
    { x: 11640, y: 415, w: 225, h: 20, type: 'catwalk', oneWay: true },
    { x: 11960, y: 612, w: 145, h: 18, type: 'third_rail', oneWay: false, phase: 0.8 },
    { x: 12220, y: 535, w: 215, h: 24, type: 'escalator', direction: 1, speed: 110, oneWay: true },
    { x: 12490, y: 495, w: 135, h: 22, type: 'crumble', oneWay: true },
    { x: 12665, y: 485, w: 135, h: 22, type: 'seesaw', oneWay: true },

    // Zone 9 (12840..14400): Grand Terminal Concourse & Station Exit Gate
    { x: 13120, y: 575, w: 100, h: 55, type: 'baggage_cart', oneWay: true, bouncy: true },
    { x: 13300, y: 498, w: 410, h: 132, type: 'train_car', variant: 'subway', oneWay: false },
    { x: 13720, y: 535, w: 220, h: 24, type: 'escalator', direction: 1, speed: 105, oneWay: true },
    { x: 14040, y: 485, w: 280, h: 145, type: 'rail_platform', oneWay: false },
  ];

  // Flooded electrified track pits between station platforms
  const puddles = [
    { x: 1080, y: 636, w: 400, h: 28 },
    { x: 2600, y: 636, w: 440, h: 28 },
    { x: 4220, y: 636, w: 460, h: 28 },
    { x: 5920, y: 636, w: 440, h: 28 },
    { x: 7500, y: 636, w: 440, h: 28 },
    { x: 9160, y: 636, w: 460, h: 28 },
    { x: 10800, y: 636, w: 440, h: 28 },
    { x: 12400, y: 636, w: 440, h: 28 },
  ];

  // Well-spaced Station Guard Dogs (3 across 14400px)
  const dogs = [
    {
      x: 3980,
      y: 586,
      w: 58,
      h: 44,
      minX: 3965,
      maxX: 4195,
      vx: 112,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 8420,
      y: 586,
      w: 58,
      h: 44,
      minX: 8280,
      maxX: 8620,
      vx: 118,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 13620,
      y: 586,
      w: 58,
      h: 44,
      minX: 13585,
      maxX: 13960,
      vx: 120,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
  ];

  // Subway Rats scurrying along platforms (4 across 14400px)
  const rats = [
    { x: 2420, y: 606, w: 38, h: 24, minX: 2380, maxX: 2575, vx: 110, facing: 1 },
    { x: 5440, y: 606, w: 38, h: 24, minX: 5320, maxX: 5640, vx: 115, facing: -1 },
    { x: 10180, y: 606, w: 38, h: 24, minX: 10020, maxX: 10400, vx: 115, facing: 1 },
    { x: 11720, y: 606, w: 38, h: 24, minX: 11580, maxX: 11920, vx: 118, facing: -1 },
  ];

  // Nocturnal Tunnel Bats with Echolocation (5 across 14400px)
  const bats = [
    { x: 1220, y: 385, baseY: 385, w: 42, h: 26, minX: 1040, maxX: 1460, vx: 126, facing: 1, amp: 22, freq: 2.8 },
    { x: 2740, y: 365, baseY: 365, w: 42, h: 26, minX: 2560, maxX: 3020, vx: 130, facing: -1, amp: 24, freq: 2.9 },
    { x: 6060, y: 355, baseY: 355, w: 42, h: 26, minX: 5880, maxX: 6340, vx: 132, facing: 1, amp: 22, freq: 3.0 },
    { x: 9320, y: 345, baseY: 345, w: 42, h: 26, minX: 9120, maxX: 9580, vx: 134, facing: -1, amp: 24, freq: 2.9 },
    { x: 12560, y: 355, baseY: 355, w: 42, h: 26, minX: 12360, maxX: 12820, vx: 136, facing: 1, amp: 22, freq: 3.0 },
  ];

  // 4 Checkpoints (Cozy Cat Houses seated on station platforms)
  const checkpoints = [
    { x: 3090, y: 598, activated: false },
    { x: 6410, y: 598, activated: false },
    { x: 9670, y: 598, activated: false },
    { x: 12890, y: 598, activated: false },
  ];

  // Collectible Fish Treats (1 visible on Catwalk #2, 2 hidden in Night Vision)
  const treats = [
    { x: 1935, y: 275, collected: false, hiddenInDay: true },
    { x: 6920, y: 365, collected: false, hiddenInDay: false },
    { x: 9965, y: 270, collected: false, hiddenInDay: true },
  ];

  // Station Lamps across 14400px
  const lamps = [
    180, 960, 1560, 2480, 3140, 4080, 4780, 5780, 6460, 7380,
    8040, 9040, 9720, 10680, 11340, 12280, 12940, 13880, 14240,
  ];

  // Grand Terminal Exit Gate
  const goal = { x: 14180, y: 405, w: 72, h: 80 };

  return {
    stage: 7,
    theme: 'subway',
    title: 'المرحلة 7: ساحة القطارات ومحطة الأنفاق الكبرى • Grand Metro Station',
    goalLabel: 'بوابة المحطة 🚇',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    rats,
    bats,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
