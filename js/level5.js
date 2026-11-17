window.Game = window.Game || {};

window.Game.createLevel5 = function () {
  const width = 6800;
  const height = 720;

  // Stage 5: The Harbor Docks (الميناء الليلي وأرصفة الصيد - مرحلة طويلة ومنسقة)
  const platforms = [
    // Ground weathered wooden harbor piers separated by ocean channels
    { x: 0, y: 630, w: 660, h: 90, type: 'pier', climbable: false },
    { x: 980, y: 630, w: 780, h: 90, type: 'pier', climbable: false },
    { x: 2640, y: 630, w: 820, h: 90, type: 'pier', climbable: false },
    { x: 3760, y: 630, w: 860, h: 90, type: 'pier', climbable: false },
    { x: 5020, y: 630, w: 700, h: 90, type: 'pier', climbable: false },
    { x: 6120, y: 630, w: 680, h: 90, type: 'pier', climbable: false },

    // Zone 1: Harbor Entrance Pier -> Crates, Floating Buoy & Ship Rigging over Channel #1
    { x: 495, y: 560, w: 85, h: 70, type: 'crate', oneWay: false },
    { x: 690, y: 585, w: 92, h: 55, type: 'buoy', oneWay: true, bouncy: true },
    { x: 805, y: 405, w: 215, h: 12, type: 'rigging', oneWay: true, narrow: true },

    // Zone 2: Steamship Pier -> Vertical Crane Iron Girder & Secret Fish #1
    {
      x: 1520,
      y: 475,
      w: 120,
      h: 24,
      type: 'girder',
      oneWay: true,
      moving: true,
      baseX: 1520,
      baseY: 475,
      moveRange: 0,
      moveYRange: 80,
      moveSpeed: 1.8,
      dx: 0,
      dy: 0,
    },
    // Secret Night-Vision platform #1 (reachable from top of crane lift)
    { x: 1335, y: 275, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },

    // Zone 3: Bobbing Fishing Boats Crossing over Wide Harbor Channel #2
    {
      x: 1845,
      y: 585,
      w: 155,
      h: 44,
      type: 'boat',
      oneWay: true,
      moving: true,
      baseX: 1845,
      moveRange: 75,
      moveSpeed: 1.6,
      dx: 0,
      dy: 0,
    },
    {
      x: 2245,
      y: 575,
      w: 155,
      h: 44,
      type: 'boat',
      oneWay: true,
      moving: true,
      baseX: 2245,
      moveRange: 85,
      moveSpeed: -1.75,
      dx: 0,
      dy: 0,
    },

    // Zone 4: Fish Market Pier -> Buoy Launch, High Rigging (Fish #2) & Secret Fish #3
    { x: 3310, y: 540, w: 92, h: 90, type: 'buoy', oneWay: true, bouncy: true },
    { x: 3220, y: 265, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 3465, y: 395, w: 235, h: 12, type: 'rigging', oneWay: true, narrow: true },

    // Zone 5: Cargo Dock Pier -> Barrels, Buoy #3 & High Rigging over Channel #4
    { x: 3920, y: 565, w: 74, h: 65, type: 'barrel', oneWay: false },
    { x: 4460, y: 540, w: 92, h: 90, type: 'buoy', oneWay: true, bouncy: true },
    { x: 4680, y: 395, w: 235, h: 12, type: 'rigging', oneWay: true, narrow: true },

    // Zone 6: Deep Harbor Pier -> Tugboat Crossing & Final Lighthouse Gate
    {
      x: 5780,
      y: 580,
      w: 165,
      h: 44,
      type: 'boat',
      oneWay: true,
      moving: true,
      baseX: 5780,
      moveRange: 80,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },
    { x: 6435, y: 555, w: 80, h: 75, type: 'crate', oneWay: false },
    { x: 6540, y: 485, w: 220, h: 145, type: 'crate', oneWay: false },
  ];

  // Deep ocean water channels (hazards)
  const puddles = [
    { x: 660, y: 636, w: 320, h: 28 },
    { x: 1760, y: 636, w: 880, h: 28 },
    { x: 3460, y: 636, w: 300, h: 28 },
    { x: 4620, y: 636, w: 400, h: 28 },
    { x: 5720, y: 636, w: 400, h: 28 },
  ];

  // Well-spaced Harbor Enemies (zero overcrowding across 6800px!)
  const dogs = [
    {
      x: 2980,
      y: 586,
      w: 58,
      h: 44,
      minX: 2800,
      maxX: 3240,
      vx: 115,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 5360,
      y: 586,
      w: 58,
      h: 44,
      minX: 5180,
      maxX: 5640,
      vx: 120,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
  ];

  // 3 Harbor Crabs (Zone 1, Zone 5, Zone 6)
  const crabs = [
    { x: 320, y: 602, w: 40, h: 28, minX: 240, maxX: 460, vx: 68, facing: 1 },
    { x: 3880, y: 602, w: 40, h: 28, minX: 3800, maxX: 4060, vx: 72, facing: 1 },
    { x: 6220, y: 602, w: 40, h: 28, minX: 6150, maxX: 6400, vx: 75, facing: -1 },
  ];

  // 3 Swooping Seagulls over open water channels
  const seagulls = [
    { x: 820, y: 295, baseY: 295, w: 44, h: 28, minX: 680, maxX: 1020, vx: 110, facing: 1, amp: 22, freq: 2.4 },
    { x: 2120, y: 365, baseY: 365, w: 44, h: 28, minX: 1920, maxX: 2360, vx: 115, facing: -1, amp: 24, freq: 2.6 },
    { x: 5840, y: 345, baseY: 345, w: 44, h: 28, minX: 5680, maxX: 6100, vx: 115, facing: 1, amp: 22, freq: 2.5 },
  ];

  // 2 Harbor Rats (Zone 2 & Zone 5)
  const rats = [
    { x: 1260, y: 606, w: 38, h: 24, minX: 1140, maxX: 1460, vx: 105, facing: -1 },
    { x: 4220, y: 606, w: 38, h: 24, minX: 4120, maxX: 4420, vx: 110, facing: 1 },
  ];

  // Checkpoints (Cozy Cat Houses cleanly seated on piers)
  const checkpoints = [
    { x: 1030, y: 598, activated: false },
    { x: 2690, y: 598, activated: false },
    { x: 5070, y: 598, activated: false },
  ];

  // Collectible Fish Treats (1 visible on Rigging #2, 2 hidden in Night Vision)
  const treats = [
    { x: 1405, y: 235, collected: false, hiddenInDay: true },
    { x: 3580, y: 350, collected: false, hiddenInDay: false },
    { x: 3290, y: 225, collected: false, hiddenInDay: true },
  ];

  // Harbor Dock Lamps across the full 6800px pier
  const lamps = [160, 580, 1080, 1660, 2720, 3360, 3840, 4480, 5120, 5600, 6200, 6620];

  // Exit Gate at Harbor Lighthouse Pier
  const goal = { x: 6635, y: 405, w: 72, h: 80 };

  return {
    stage: 5,
    theme: 'harbor',
    title: 'المرحلة 5: الميناء الليلي وأرصفة الصيد • The Harbor Docks',
    goalLabel: 'بوابة الميناء ⚓',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    crabs,
    seagulls,
    rats,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
