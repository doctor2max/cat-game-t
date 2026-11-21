window.Game = window.Game || {};

window.Game.createLevel15 = function () {
  const width = 15200;
  const height = 720;

  // Stage 15 (EPIC EXPANDED GRAND FINALE): Dawn Homeward Avenue (فجر العودة إلى شرفة المنزل)
  // 10 Escalating Residential Dawn Zones across 15,200px with 8 Safe Checkpoints,
  // Buoyant Garden Fountain Jets, Rotating Timber Mill Waterwheels, Balanced Garden Seesaws,
  // Sculpted Purple Bounce Flowers, Chained Garden Swings, Crumbling Stone Footbridges,
  // Wall-Jump Brick Chimneys, Koi Lilypads & Guarded by Dobermans, Badgers, Hedgehogs & Golden Dawn Eagles!
  const platforms = [
    // 10 Sunlit Cobblestone Residential Avenue Segments separated by 9 Sparkling Koi & Mill Streams
    { x: 0, y: 630, w: 860, h: 90, type: 'home_deck', climbable: false },
    { x: 1240, y: 630, w: 1020, h: 90, type: 'home_deck', climbable: false },
    { x: 2740, y: 630, w: 920, h: 90, type: 'home_deck', climbable: false },
    { x: 4280, y: 630, w: 1000, h: 90, type: 'home_deck', climbable: false },
    { x: 5820, y: 630, w: 1020, h: 90, type: 'home_deck', climbable: false },
    { x: 7520, y: 630, w: 940, h: 90, type: 'home_deck', climbable: false },
    { x: 9160, y: 630, w: 1060, h: 90, type: 'home_deck', climbable: false },
    { x: 10880, y: 630, w: 1060, h: 90, type: 'home_deck', climbable: false },
    { x: 12620, y: 630, w: 1040, h: 90, type: 'home_deck', climbable: false },
    { x: 14220, y: 630, w: 980, h: 90, type: 'home_deck', climbable: false },

    // ZONE 1 (0..1240): Sunrise Villa Promenade -> Bench, Bouncy Awning, High Pergola & Stream Bridge #1
    { x: 225, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },
    { x: 400, y: 515, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 580, y: 400, w: 195, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 955, y: 545, w: 190, h: 24, type: 'garden_pergola', oneWay: true },

    // ZONE 2 (1240..2740): Brick Courtyard Wall-Jump Chimney (Secret Fish #1), Fountain Jet & Twin Koi Lilypads!
    { x: 1455, y: 390, w: 46, h: 240, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1600, y: 295, w: 46, h: 255, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1650, y: 385, w: 195, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 1540, y: 235, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 1985, y: 590, w: 105, h: 40, type: 'fountain_jet', oneWay: true, jetHeight: 195 },
    { x: 2320, y: 565, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 2535, y: 540, w: 115, h: 20, type: 'sink_pad', oneWay: true },

    // ZONE 3 (2740..4280): Rose Pergola Terrace, Garden Seesaw & Twin Chained Garden Swings over Ravine!
    { x: 2935, y: 515, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 3120, y: 400, w: 190, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 3380, y: 470, w: 190, h: 18, type: 'seesaw', oneWay: true },
    {
      x: 3785,
      y: 535,
      w: 130,
      h: 18,
      type: 'swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 3785,
      baseY: 535,
      moveRange: 42,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },
    {
      x: 4050,
      y: 515,
      w: 130,
      h: 18,
      type: 'swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 4050,
      baseY: 515,
      moveRange: 42,
      moveSpeed: -1.75,
      dx: 0,
      dy: 0,
    },

    // ZONE 4 (4280..5820): Estate Fountain Square -> Buoyant Water Geyser Route & Crumbling Garden Stone Arches!
    { x: 4475, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },
    { x: 4665, y: 590, w: 105, h: 40, type: 'fountain_jet', oneWay: true, jetHeight: 205 },
    { x: 4865, y: 395, w: 200, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 5355, y: 545, w: 130, h: 22, type: 'crumble', oneWay: true },
    { x: 5585, y: 520, w: 130, h: 22, type: 'crumble', oneWay: true },

    // ZONE 5 (5820..7520): High Villa Rooftops -> Brick Wall-Jump Tower, Secret Fish #2 & 3-Pad Koi Rapids!
    { x: 6045, y: 395, w: 46, h: 235, type: 'brickwall', oneWay: false, climbable: true },
    { x: 6190, y: 295, w: 46, h: 255, type: 'brickwall', oneWay: false, climbable: true },
    { x: 6240, y: 385, w: 195, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 6535, y: 515, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 6515, y: 295, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 6900, y: 565, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 7110, y: 545, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 7325, y: 525, w: 115, h: 20, type: 'sink_pad', oneWay: true },

    // ZONE 6 (7520..9160): Grand Manor Courtyard -> Bounce Flower, Secret Fish #3, Rotating Waterwheel & Swing!
    { x: 7755, y: 520, w: 106, h: 24, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 7945, y: 400, w: 190, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 7960, y: 275, w: 150, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 8220, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },
    { x: 8580, y: 540, w: 145, h: 22, type: 'waterwheel', oneWay: true, rotSpeed: 0.75 },
    {
      x: 8910,
      y: 515,
      w: 135,
      h: 18,
      type: 'swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 8910,
      baseY: 515,
      moveRange: 48,
      moveSpeed: -1.75,
      dx: 0,
      dy: 0,
    },

    // ZONE 7 (9160..10880): Old Mill Garden -> Pergola Terrace, Garden Seesaw & Twin Rotating Mill Waterwheels!
    { x: 9380, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },
    { x: 9560, y: 515, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 9740, y: 405, w: 195, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 9985, y: 480, w: 185, h: 18, type: 'seesaw', oneWay: true },
    { x: 10310, y: 540, w: 140, h: 22, type: 'waterwheel', oneWay: true, rotSpeed: 0.72 },
    { x: 10615, y: 515, w: 140, h: 22, type: 'waterwheel', oneWay: true, rotSpeed: -0.72 },

    // ZONE 8 (10880..12620): Botanical Fountain Terrace -> Dumpster, Buoyant Fountain Geyser, Bounce Flower & Stone-Lilypad Bridge!
    { x: 11100, y: 572, w: 105, h: 58, type: 'dumpster', oneWay: true },
    { x: 11290, y: 590, w: 105, h: 40, type: 'fountain_jet', oneWay: true, jetHeight: 205 },
    { x: 11460, y: 395, w: 200, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 11730, y: 520, w: 106, h: 24, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 12020, y: 545, w: 130, h: 22, type: 'crumble', oneWay: true },
    { x: 12235, y: 540, w: 115, h: 20, type: 'sink_pad', oneWay: true },
    { x: 12430, y: 520, w: 130, h: 22, type: 'crumble', oneWay: true },

    // ZONE 9 (12620..14220): Manor Bell-Tower Wall-Jump, Sky Pergola & Moving Bridge + Swing Ravine!
    { x: 12860, y: 395, w: 46, h: 235, type: 'brickwall', oneWay: false, climbable: true },
    { x: 13005, y: 295, w: 46, h: 255, type: 'brickwall', oneWay: false, climbable: true },
    { x: 13055, y: 385, w: 200, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 13350, y: 515, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    {
      x: 13755,
      y: 535,
      w: 145,
      h: 24,
      type: 'garden_pergola',
      oneWay: true,
      moving: true,
      baseX: 13755,
      moveRange: 55,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },
    {
      x: 14015,
      y: 515,
      w: 130,
      h: 18,
      type: 'swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 14015,
      baseY: 515,
      moveRange: 40,
      moveSpeed: -1.75,
      dx: 0,
      dy: 0,
    },

    // ZONE 10 (14220..15200): HOME STREET FINALE -> Final Guard Gauntlet & Ascent to Mashmasha's Home Balcony!
    { x: 14350, y: 580, w: 115, h: 50, type: 'bench', oneWay: true },
    { x: 14520, y: 515, w: 115, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 14685, y: 405, w: 185, h: 24, type: 'garden_pergola', oneWay: true },
    { x: 14835, y: 520, w: 106, h: 24, type: 'flower_bounce', oneWay: true, bouncy: true },
    { x: 14950, y: 390, w: 230, h: 240, type: 'brickwall', oneWay: false, climbable: true },
  ];

  // 9 Sparkling Dawn Garden Koi & Mill Streams
  const puddles = [
    { x: 860, y: 636, w: 380, h: 24 },
    { x: 2260, y: 636, w: 480, h: 24 },
    { x: 3660, y: 636, w: 620, h: 24 },
    { x: 5280, y: 636, w: 540, h: 24 },
    { x: 6840, y: 636, w: 680, h: 24 },
    { x: 8460, y: 636, w: 700, h: 24 },
    { x: 10220, y: 636, w: 660, h: 24 },
    { x: 11940, y: 636, w: 680, h: 24 },
    { x: 13660, y: 636, w: 560, h: 24 },
  ];
  const dogs = [];

  // Epic Grand Finale Enemies: Sleek Guard Dobermans (with Vision Cone & Bark!), Raccoons/Badgers, Hedgehogs & Golden Dawn Eagles!
  // All enemy patrol ranges are strictly outside the 8 Checkpoint Safe Zones!
  const dobermans = [
    { x: 1860, y: 582, w: 62, h: 48, minX: 1680, maxX: 1940, vx: 112, facing: -1 },
    { x: 4920, y: 582, w: 62, h: 48, minX: 4800, maxX: 5220, vx: 118, facing: 1 },
    { x: 6380, y: 582, w: 62, h: 48, minX: 6260, maxX: 6780, vx: 122, facing: -1 },
    { x: 8040, y: 582, w: 62, h: 48, minX: 7860, maxX: 8380, vx: 124, facing: 1 },
    { x: 9740, y: 582, w: 62, h: 48, minX: 9520, maxX: 10140, vx: 126, facing: -1 },
    { x: 11560, y: 582, w: 62, h: 48, minX: 11420, maxX: 11880, vx: 128, facing: 1 },
    { x: 14620, y: 582, w: 62, h: 48, minX: 14480, maxX: 14810, vx: 130, facing: -1 },
  ];

  const badgers = [
    { x: 3200, y: 590, w: 56, h: 40, minX: 2960, maxX: 3560, vx: 110, facing: -1 },
    { x: 6100, y: 590, w: 56, h: 40, minX: 5995, maxX: 6170, vx: 98, facing: 1 },
    { x: 7740, y: 590, w: 56, h: 40, minX: 7695, maxX: 7920, vx: 114, facing: 1 },
    { x: 13240, y: 590, w: 56, h: 40, minX: 13080, maxX: 13580, vx: 118, facing: -1 },
  ];

  const hedgehogs = [
    { x: 560, y: 606, w: 36, h: 24, minX: 360, maxX: 780, vx: 76, facing: -1 },
    { x: 4920, y: 371, w: 36, h: 24, minX: 4875, maxX: 5020, vx: 62, facing: 1 },
    { x: 9810, y: 381, w: 36, h: 24, minX: 9755, maxX: 9915, vx: 64, facing: 1 },
    { x: 11520, y: 371, w: 36, h: 24, minX: 11475, maxX: 11635, vx: 66, facing: -1 },
  ];

  const hawks = [
    { x: 1030, y: 325, baseY: 325, w: 66, h: 34, minX: 820, maxX: 1280, vx: 126, facing: 1, amp: 32, freq: 2.2 },
    { x: 2480, y: 320, baseY: 320, w: 66, h: 34, minX: 2220, maxX: 2780, vx: 132, facing: -1, amp: 34, freq: 2.4 },
    { x: 3960, y: 310, baseY: 310, w: 66, h: 34, minX: 3640, maxX: 4300, vx: 138, facing: 1, amp: 36, freq: 2.5 },
    { x: 5540, y: 315, baseY: 315, w: 66, h: 34, minX: 5260, maxX: 5840, vx: 140, facing: -1, amp: 35, freq: 2.5 },
    { x: 7160, y: 315, baseY: 315, w: 66, h: 34, minX: 6820, maxX: 7540, vx: 146, facing: 1, amp: 38, freq: 2.6 },
    { x: 8780, y: 310, baseY: 310, w: 66, h: 34, minX: 8440, maxX: 9180, vx: 148, facing: -1, amp: 38, freq: 2.6 },
    { x: 10540, y: 310, baseY: 310, w: 66, h: 34, minX: 10200, maxX: 10900, vx: 146, facing: 1, amp: 36, freq: 2.5 },
    { x: 12260, y: 310, baseY: 310, w: 66, h: 34, minX: 11920, maxX: 12640, vx: 148, facing: -1, amp: 36, freq: 2.6 },
    { x: 13920, y: 305, baseY: 305, w: 66, h: 34, minX: 13640, maxX: 14240, vx: 148, facing: 1, amp: 34, freq: 2.5 },
  ];

  // 8 Fairly Spaced & 100% Protected Checkpoints across the 15,200px Grand Finale
  const checkpoints = [
    { x: 1700, y: 353, activated: false },
    { x: 2800, y: 598, activated: false },
    { x: 4340, y: 598, activated: false },
    { x: 5880, y: 598, activated: false },
    { x: 7580, y: 598, activated: false },
    { x: 9220, y: 598, activated: false },
    { x: 10940, y: 598, activated: false },
    { x: 12680, y: 598, activated: false },
    { x: 14265, y: 598, activated: false },
  ];

  const treats = [
    { x: 1612, y: 195, collected: false, hiddenInDay: true },
    { x: 6590, y: 255, collected: false, hiddenInDay: true },
    { x: 8035, y: 235, collected: false, hiddenInDay: true },
  ];

  const lamps = [
    180, 760, 1340, 2120, 2860, 3540, 4380, 5140, 5940, 6720,
    7640, 8340, 9260, 10120, 10980, 11840, 12720, 13560, 14300, 14900,
  ];

  // MASHMASHA'S HOME BALCONY EXIT GATE -> Plays Win1.mp4 -> Win2.mp4!
  const goal = { x: 15035, y: 310, w: 72, h: 80 };

  return {
    stage: 15,
    theme: 'homeward',
    title: 'المرحلة 15',
    goalLabel: 'شرفة المنزل 🏠',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    dobermans,
    badgers,
    hedgehogs,
    hawks,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
