window.Game = window.Game || {};

window.Game.createLevel8 = function () {
  const width = 16800;
  const height = 720;

  // Stage 8 (Grand Finale): Stormy Skyscraper Construction & Giant Tower Cranes (ورشة ناطحة السحاب)
  // Diverse Enemies: Huge Doberman Guards, Site Security Drones, Storm Owls & Site Rats!
  const platforms = [
    // Unfinished Concrete Skyscraper Decks (with Workshop Props: Cones, Brick Pallets, Mixers, Floodlights)
    { x: 0, y: 610, w: 1120, h: 110, type: 'concrete_slab', climbable: false },
    { x: 1560, y: 580, w: 1160, h: 140, type: 'concrete_slab', climbable: false },
    { x: 3160, y: 600, w: 1240, h: 120, type: 'concrete_slab', climbable: false },
    { x: 4860, y: 560, w: 1180, h: 160, type: 'concrete_slab', climbable: false },
    { x: 6500, y: 590, w: 1260, h: 130, type: 'concrete_slab', climbable: false },
    { x: 8220, y: 550, w: 1200, h: 170, type: 'concrete_slab', climbable: false },
    { x: 9880, y: 590, w: 1220, h: 130, type: 'concrete_slab', climbable: false },
    { x: 11560, y: 560, w: 1240, h: 160, type: 'concrete_slab', climbable: false },
    { x: 13260, y: 590, w: 1200, h: 130, type: 'concrete_slab', climbable: false },
    { x: 14920, y: 560, w: 1880, h: 160, type: 'concrete_slab', climbable: false },

    // Zone 1 (0..1560): Orange Safety Net Launch, Scaffolding, Welding Arc & Swinging Pendulum Beam
    { x: 330, y: 582, w: 96, h: 28, type: 'safety_net', oneWay: true, bouncy: true },
    { x: 495, y: 440, w: 185, h: 170, type: 'scaffolding', oneWay: true },
    { x: 790, y: 598, w: 140, h: 14, type: 'welding_spark', oneWay: false, phase: 0.2 },
    {
      x: 1185,
      y: 485,
      w: 145,
      h: 22,
      type: 'pendulum_beam',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 1185,
      baseY: 485,
      moveRange: 105,
      moveSpeed: 1.75,
      dx: 0,
      dy: 0,
    },

    // Zone 2 (1560..3160): Wall-Jump Concrete Shaft, Secret Fish #1, Crumble & Vertical Construction Hoist
    { x: 1820, y: 360, w: 46, h: 220, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1965, y: 270, w: 46, h: 250, type: 'brickwall', oneWay: false, climbable: true },
    { x: 2010, y: 350, w: 175, h: 22, type: 'scaffolding', oneWay: true },
    { x: 1960, y: 205, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 2340, y: 568, w: 145, h: 14, type: 'welding_spark', oneWay: false, phase: 1.3 },
    {
      x: 2770,
      y: 485,
      w: 130,
      h: 22,
      type: 'elevator_hoist',
      oneWay: true,
      moving: true,
      baseX: 2770,
      baseY: 485,
      moveRange: 0,
      moveYRange: 85,
      moveSpeed: 1.8,
      dx: 0,
      dy: 0,
    },
    { x: 2965, y: 495, w: 125, h: 22, type: 'seesaw', oneWay: true },

    // Zone 3 (3160..4860): Material Conveyor, High Scaffolding & Moving Crane Hook
    { x: 3420, y: 515, w: 220, h: 24, type: 'escalator', direction: -1, speed: 105, oneWay: true },
    { x: 3740, y: 425, w: 195, h: 175, type: 'scaffolding', oneWay: true },
    { x: 4050, y: 588, w: 140, h: 14, type: 'welding_spark', oneWay: false, phase: 0.7 },
    {
      x: 4460,
      y: 470,
      w: 145,
      h: 24,
      type: 'crane_hook',
      oneWay: true,
      moving: true,
      baseX: 4460,
      moveRange: 115,
      moveSpeed: -1.7,
      dx: 0,
      dy: 0,
    },

    // Zone 4 (4860..6500): Sandbags, High-Tension Cable, Secret Fish #2 & Twin Crumble
    { x: 5140, y: 530, w: 86, h: 30, type: 'sandbags', oneWay: true, bouncy: true },
    { x: 5300, y: 385, w: 170, h: 22, type: 'girder', oneWay: true },
    { x: 5260, y: 270, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 5620, y: 470, w: 235, h: 12, type: 'cable', oneWay: true, narrow: true },
    { x: 6080, y: 510, w: 125, h: 22, type: 'crumble', oneWay: true },
    { x: 6275, y: 495, w: 125, h: 22, type: 'crumble', oneWay: true },

    // Zone 5 (6500..8220): Safety Net, Scaffolding & Swinging Pendulum Beam
    { x: 6780, y: 562, w: 96, h: 28, type: 'safety_net', oneWay: true, bouncy: true },
    { x: 6940, y: 430, w: 185, h: 160, type: 'scaffolding', oneWay: true },
    { x: 7240, y: 578, w: 145, h: 14, type: 'welding_spark', oneWay: false, phase: 1.9 },
    {
      x: 7820,
      y: 485,
      w: 150,
      h: 22,
      type: 'pendulum_beam',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 7820,
      baseY: 485,
      moveRange: 115,
      moveSpeed: 1.8,
      dx: 0,
      dy: 0,
    },

    // Zone 6 (8220..9880): Vertical Wall-Jump Shaft #2, Conveyor & High Cable
    { x: 8480, y: 330, w: 46, h: 220, type: 'brickwall', oneWay: false, climbable: true },
    { x: 8625, y: 240, w: 46, h: 250, type: 'brickwall', oneWay: false, climbable: true },
    { x: 8670, y: 325, w: 180, h: 22, type: 'girder', oneWay: true },
    { x: 9020, y: 465, w: 220, h: 24, type: 'escalator', direction: 1, speed: 115, oneWay: true },
    { x: 9460, y: 495, w: 265, h: 12, type: 'cable', oneWay: true, narrow: true },

    // Zone 7 (9880..11560): Vertical Hoist, Secret Fish #3, Welding & Crane Hook
    {
      x: 10160,
      y: 475,
      w: 130,
      h: 22,
      type: 'elevator_hoist',
      oneWay: true,
      moving: true,
      baseX: 10160,
      baseY: 475,
      moveRange: 0,
      moveYRange: 95,
      moveSpeed: 1.85,
      dx: 0,
      dy: 0,
    },
    { x: 10340, y: 410, w: 185, h: 180, type: 'scaffolding', oneWay: true },
    { x: 10350, y: 245, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 10680, y: 578, w: 145, h: 14, type: 'welding_spark', oneWay: false, phase: 0.4 },
    {
      x: 11160,
      y: 485,
      w: 150,
      h: 24,
      type: 'crane_hook',
      oneWay: true,
      moving: true,
      baseX: 11160,
      moveRange: 115,
      moveSpeed: -1.8,
      dx: 0,
      dy: 0,
    },

    // Zone 8 (11560..13260): High-Speed Conveyor, Seesaw & Cracked Concrete Bridge
    { x: 11840, y: 475, w: 220, h: 24, type: 'escalator', direction: -1, speed: 115, oneWay: true },
    { x: 12220, y: 548, w: 145, h: 14, type: 'welding_spark', oneWay: false, phase: 1.5 },
    { x: 12520, y: 470, w: 135, h: 22, type: 'seesaw', oneWay: true },
    { x: 12840, y: 510, w: 125, h: 22, type: 'crumble', oneWay: true },
    { x: 13035, y: 495, w: 125, h: 22, type: 'crumble', oneWay: true },

    // Zone 9 (13260..14920): Final Tower Crane Ascent -> Safety Net, Scaffolding & Swinging Beam
    { x: 13560, y: 562, w: 96, h: 28, type: 'safety_net', oneWay: true, bouncy: true },
    { x: 13720, y: 415, w: 185, h: 175, type: 'scaffolding', oneWay: true },
    { x: 14040, y: 578, w: 145, h: 14, type: 'welding_spark', oneWay: false, phase: 2.2 },
    {
      x: 14520,
      y: 485,
      w: 155,
      h: 22,
      type: 'pendulum_beam',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 14520,
      baseY: 485,
      moveRange: 115,
      moveSpeed: 1.85,
      dx: 0,
      dy: 0,
    },

    // Zone 10 (14920..16800): Final Doberman Guarded Rooftop Bridge to Home Balcony!
    { x: 15280, y: 475, w: 220, h: 24, type: 'escalator', direction: 1, speed: 120, oneWay: true },
    { x: 15740, y: 530, w: 86, h: 30, type: 'sandbags', oneWay: true, bouncy: true },
    { x: 15920, y: 430, w: 195, h: 130, type: 'scaffolding', oneWay: true },
    { x: 16240, y: 410, w: 460, h: 150, type: 'rooftop', oneWay: false },
  ];

  const puddles = [];

  // 5 Huge Guard Dobermans on major concrete decks
  const dogs = [
    { x: 520, y: 556, w: 72, h: 54, variant: 'doberman', minX: 440, maxX: 760, vx: 135, facing: 1, state: 'patrol', distractX: 0, stateTimer: 0 },
    { x: 3560, y: 546, w: 72, h: 54, variant: 'doberman', minX: 3320, maxX: 4010, vx: 145, facing: 1, state: 'patrol', distractX: 0, stateTimer: 0 },
    { x: 6900, y: 536, w: 72, h: 54, variant: 'doberman', minX: 6890, maxX: 7210, vx: 150, facing: 1, state: 'patrol', distractX: 0, stateTimer: 0 },
    { x: 10440, y: 536, w: 72, h: 54, variant: 'doberman', minX: 10310, maxX: 10650, vx: 155, facing: 1, state: 'patrol', distractX: 0, stateTimer: 0 },
    { x: 15540, y: 506, w: 72, h: 54, variant: 'doberman', minX: 15100, maxX: 15710, vx: 162, facing: -1, state: 'patrol', distractX: 0, stateTimer: 0 },
  ];

  // 4 Site Security Patrol Drones with Red Laser Scanners
  const drones = [
    { x: 2450, y: 360, baseY: 360, w: 48, h: 24, minX: 2240, maxX: 2720, vx: 130, facing: 1, amp: 16, freq: 2.5 },
    { x: 5600, y: 330, baseY: 330, w: 48, h: 24, minX: 5400, maxX: 5950, vx: 135, facing: -1, amp: 18, freq: 2.6 },
    { x: 9100, y: 335, baseY: 335, w: 48, h: 24, minX: 8920, maxX: 9440, vx: 140, facing: 1, amp: 16, freq: 2.7 },
    { x: 12100, y: 345, baseY: 345, w: 48, h: 24, minX: 11880, maxX: 12440, vx: 142, facing: -1, amp: 18, freq: 2.7 },
  ];

  // 4 Storm Night Owls swooping across crane chasms
  const falcons = [
    { x: 1220, y: 315, baseY: 315, w: 52, h: 34, minX: 1020, maxX: 1520, vx: 128, facing: 1, amp: 24, freq: 2.3 },
    { x: 4480, y: 300, baseY: 300, w: 52, h: 34, minX: 4320, maxX: 4840, vx: 132, facing: -1, amp: 24, freq: 2.4 },
    { x: 7860, y: 305, baseY: 305, w: 52, h: 34, minX: 7660, maxX: 8180, vx: 136, facing: 1, amp: 24, freq: 2.5 },
    { x: 14560, y: 310, baseY: 310, w: 52, h: 34, minX: 14360, maxX: 14880, vx: 138, facing: -1, amp: 24, freq: 2.5 },
  ];

  // 4 Construction Site Rats scurrying near concrete debris
  const rats = [
    { x: 2140, y: 556, w: 38, h: 24, minX: 2040, maxX: 2310, vx: 115, facing: -1 },
    { x: 5420, y: 536, w: 38, h: 24, minX: 5260, maxX: 5600, vx: 118, facing: 1 },
    { x: 8820, y: 526, w: 38, h: 24, minX: 8700, maxX: 9010, vx: 120, facing: -1 },
    { x: 13800, y: 566, w: 38, h: 24, minX: 13680, maxX: 14010, vx: 122, facing: 1 },
  ];

  // 4 Checkpoints (Cozy Cat Houses seated on construction decks)
  const checkpoints = [
    { x: 3210, y: 568, activated: false },
    { x: 6550, y: 558, activated: false },
    { x: 9930, y: 558, activated: false },
    { x: 13310, y: 558, activated: false },
  ];

  // Collectible Fish Treats (1 visible on Girder in Zone 6, 2 hidden in Night Vision)
  const treats = [
    { x: 2030, y: 165, collected: false, hiddenInDay: true },
    { x: 5330, y: 230, collected: false, hiddenInDay: true },
    { x: 8760, y: 285, collected: false, hiddenInDay: false },
  ];

  // Construction Site Floodlights across 16800px
  const lamps = [
    180, 980, 1660, 2560, 3260, 4220, 4960, 5880, 6600, 7560,
    8320, 9220, 9980, 10940, 11660, 12640, 13360, 14320, 15020, 16560,
  ];

  // Home Balcony Exit Gate (leads to Win1.mp4 -> Win2.mp4!)
  const goal = { x: 16540, y: 330, w: 72, h: 80 };

  return {
    stage: 8,
    theme: 'construction',
    title: 'المرحلة 8',
    goalLabel: 'بوابة المتحف 🏛️',
    width,
    height,
    startX: 85,
    startY: 566,
    platforms,
    puddles,
    dogs,
    drones,
    falcons,
    rats,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
