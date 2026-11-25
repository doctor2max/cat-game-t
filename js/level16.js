window.Game = window.Game || {};

window.Game.createLevel16 = function () {
  const width = 11600;
  const height = 720;

  // Stage 16: Arctic Snow Kingdom — Extended Expedition (المملكة الثلجية)
  // 8 Escalating Glacial Zones (11,600px) with:
  // - Translucent glacial ice decks, ledges, climbable ice-brick walls, bouncy snow pillows & crumbling icicle bridges
  // - NEW: Bobbing Sinking Arctic Ice Floes (ice_floe) across Orca-patrolled sea channels
  // - NEW: Periodic Arctic Blizzard Gust Zones (blizzard_zone) — crouch/sneak to anchor or sprint in calm windows
  // - NEW: Hanging Falling Icicles (falling_icicles) with shiver/glint telegraph & shard shatter
  // - NEW: Giant Rolling Snowballs (snowballs) barreling along glacial decks
  // - Detailed Emperor Penguins (waddle + belly-slide) & Spotted Arctic Seals
  const platforms = [
    // 8 Glacial Ice Ground Segments separated by 7 Freezing Arctic Sea Channels (Orca Territory!)
    { x: 0, y: 630, w: 940, h: 90, type: 'ice_deck', climbable: false, slippery: true },
    { x: 1260, y: 630, w: 1040, h: 90, type: 'ice_deck', climbable: false, slippery: true },
    { x: 2660, y: 630, w: 1060, h: 90, type: 'ice_deck', climbable: false, slippery: true },
    { x: 4140, y: 630, w: 1080, h: 90, type: 'ice_deck', climbable: false, slippery: true },
    { x: 5620, y: 630, w: 1100, h: 90, type: 'ice_deck', climbable: false, slippery: true },
    { x: 7100, y: 630, w: 1080, h: 90, type: 'ice_deck', climbable: false, slippery: true },
    { x: 8660, y: 630, w: 1060, h: 90, type: 'ice_deck', climbable: false, slippery: true },
    { x: 10120, y: 630, w: 1480, h: 90, type: 'ice_deck', climbable: false, slippery: true },

    // ZONE 1 (0..1260): Frosty Village Entry -> Ice Ledges, Bouncy Snow Cushion & Glacial Bridge
    { x: 280, y: 555, w: 140, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 485, y: 470, w: 155, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 700, y: 585, w: 108, h: 45, type: 'ice_bounce', oneWay: true, bouncy: true },
    { x: 995, y: 550, w: 205, h: 24, type: 'ice_ledge', oneWay: true },

    // ZONE 2 (1260..2660): Twin Frosted Ice-Wall Chimney (Secret Fish #1!) & Crumbling Ice Flakes
    { x: 1495, y: 395, w: 48, h: 235, type: 'ice_wall', oneWay: false, climbable: true },
    { x: 1645, y: 295, w: 48, h: 255, type: 'ice_wall', oneWay: false, climbable: true },
    { x: 1700, y: 385, w: 195, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 1555, y: 230, w: 155, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 2020, y: 515, w: 160, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 2345, y: 555, w: 135, h: 22, type: 'ice_crumble', oneWay: true },
    { x: 2510, y: 530, w: 130, h: 22, type: 'ice_crumble', oneWay: true },

    // ZONE 3 (2660..4140): NEW — Rolling Snowball Run, Falling Icicle Overhangs & Sinking Ice Floes!
    { x: 2905, y: 530, w: 140, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 3150, y: 450, w: 175, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 3420, y: 525, w: 155, h: 24, type: 'ice_ledge', oneWay: true },
    // Sea Channel #3 (3720..4140): Cross via 2 bobbing sinking Ice Floes while Orca patrols below!
    { x: 3775, y: 598, w: 135, h: 26, type: 'ice_floe', oneWay: true, slippery: true, phase: 0.4 },
    { x: 3960, y: 598, w: 135, h: 26, type: 'ice_floe', oneWay: true, slippery: true, phase: 2.1 },

    // ZONE 4 (4140..5620): NEW — Periodic Arctic Blizzard Crossing & Moving Icebergs!
    { x: 4320, y: 310, w: 790, h: 320, type: 'blizzard_zone', oneWay: true, windDir: -1, windForce: 490, phase: 0.5 },
    { x: 4360, y: 545, w: 165, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 4610, y: 465, w: 175, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 4865, y: 585, w: 108, h: 45, type: 'ice_bounce', oneWay: true, bouncy: true },
    { x: 4990, y: 445, w: 170, h: 24, type: 'ice_ledge', oneWay: true },
    // Sea Channel #4 (5220..5620): Moving Glacier Ledges
    {
      x: 5280,
      y: 545,
      w: 140,
      h: 24,
      type: 'ice_ledge',
      oneWay: true,
      moving: true,
      baseX: 5280,
      moveRange: 48,
      moveSpeed: 1.55,
      dx: 0,
      dy: 0,
    },
    {
      x: 5460,
      y: 505,
      w: 135,
      h: 24,
      type: 'ice_ledge',
      oneWay: true,
      moving: true,
      baseX: 5460,
      moveRange: 42,
      moveSpeed: -1.65,
      dx: 0,
      dy: 0,
    },

    // ZONE 5 (5620..7100): Icicle Spire Ascent, High Secret Fish #2 & Crumbling Glacial Span
    { x: 5865, y: 390, w: 48, h: 240, type: 'ice_wall', oneWay: false, climbable: true },
    { x: 6015, y: 290, w: 48, h: 260, type: 'ice_wall', oneWay: false, climbable: true },
    { x: 6070, y: 380, w: 200, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 5915, y: 225, w: 160, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 6355, y: 495, w: 175, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 6560, y: 585, w: 108, h: 45, type: 'ice_bounce', oneWay: true, bouncy: true },
    // Sea Channel #5 (6720..7100): Twin Crumbling Ice Bridges
    { x: 6765, y: 550, w: 135, h: 22, type: 'ice_crumble', oneWay: true },
    { x: 6935, y: 525, w: 135, h: 22, type: 'ice_crumble', oneWay: true },

    // ZONE 6 (7100..8660): Twin Snowball Avalanche Decks & Wide Orca Ice-Floe Channel!
    { x: 7340, y: 535, w: 165, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 7585, y: 445, w: 210, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 7875, y: 525, w: 170, h: 24, type: 'ice_ledge', oneWay: true },
    // Wide Sea Channel #6 (8180..8660): 3 Bobbing Sinking Ice Floes over Orca territory!
    { x: 8220, y: 598, w: 122, h: 26, type: 'ice_floe', oneWay: true, slippery: true, phase: 0.0 },
    { x: 8375, y: 588, w: 122, h: 26, type: 'ice_floe', oneWay: true, slippery: true, phase: 1.8 },
    { x: 8525, y: 598, w: 118, h: 26, type: 'ice_floe', oneWay: true, slippery: true, phase: 3.4 },

    // ZONE 7 (8660..10120): Howling Blizzard Ridge & High Glacier Terrace (Fish #3!)
    { x: 8860, y: 260, w: 800, h: 370, type: 'blizzard_zone', oneWay: true, windDir: -1, windForce: 530, phase: 2.2 },
    { x: 8895, y: 545, w: 155, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 9125, y: 585, w: 108, h: 45, type: 'ice_bounce', oneWay: true, bouncy: true },
    { x: 9160, y: 365, w: 220, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 9445, y: 455, w: 195, h: 24, type: 'ice_ledge', oneWay: true },
    // Sea Channel #7 (9720..10120): Crumble + Moving Iceberg Combo
    { x: 9765, y: 550, w: 130, h: 22, type: 'ice_crumble', oneWay: true },
    {
      x: 9935,
      y: 525,
      w: 140,
      h: 24,
      type: 'ice_ledge',
      oneWay: true,
      moving: true,
      baseX: 9935,
      moveRange: 44,
      moveSpeed: 1.75,
      dx: 0,
      dy: 0,
    },

    // ZONE 8 (10120..11600): Arctic Summit Finale — Snowball Gauntlet, Icicles & Snow Castle Fortress!
    { x: 10380, y: 535, w: 165, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 10630, y: 450, w: 185, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 10925, y: 585, w: 108, h: 45, type: 'ice_bounce', oneWay: true, bouncy: true },
    { x: 11065, y: 440, w: 165, h: 24, type: 'ice_ledge', oneWay: true },
    { x: 11260, y: 390, w: 310, h: 240, type: 'ice_wall', oneWay: false, climbable: true },
  ];

  // 7 Freezing Arctic Sea Channels (Giant Orcas pass beneath!)
  const puddles = [
    { x: 940, y: 636, w: 320, h: 24 },
    { x: 2300, y: 636, w: 360, h: 24 },
    { x: 3720, y: 636, w: 420, h: 24 },
    { x: 5220, y: 636, w: 400, h: 24 },
    { x: 6720, y: 636, w: 380, h: 24 },
    { x: 8180, y: 636, w: 480, h: 24 },
    { x: 9720, y: 636, w: 400, h: 24 },
  ];

  const dogs = [];

  // Detailed Patrolling & Belly-Sliding Emperor Penguins (11 across 8 Zones!)
  const penguins = [
    { x: 540, y: 586, w: 42, h: 44, minX: 340, maxX: 675, vx: 96, facing: -1 },
    { x: 1840, y: 586, w: 42, h: 44, minX: 1710, maxX: 2220, vx: 104, facing: -1 },
    { x: 3210, y: 406, w: 42, h: 44, minX: 3155, maxX: 3280, vx: 72, facing: 1 },
    { x: 4580, y: 586, w: 42, h: 44, minX: 4380, maxX: 4820, vx: 106, facing: -1 },
    { x: 6140, y: 336, w: 42, h: 44, minX: 6080, maxX: 6225, vx: 76, facing: 1 },
    { x: 6360, y: 586, w: 42, h: 44, minX: 6140, maxX: 6525, vx: 112, facing: -1 },
    { x: 7650, y: 401, w: 42, h: 44, minX: 7595, maxX: 7745, vx: 78, facing: -1 },
    { x: 8970, y: 586, w: 42, h: 44, minX: 8870, maxX: 9095, vx: 108, facing: -1 },
    { x: 9240, y: 321, w: 42, h: 44, minX: 9170, maxX: 9335, vx: 78, facing: 1 },
    { x: 10540, y: 586, w: 42, h: 44, minX: 10360, maxX: 10870, vx: 116, facing: -1 },
    { x: 11110, y: 396, w: 42, h: 44, minX: 11070, maxX: 11185, vx: 74, facing: -1 },
  ];

  // Detailed Spotted Arctic Seals (8 across 8 Zones!)
  const seals = [
    { x: 1410, y: 590, w: 62, h: 40, minX: 1300, maxX: 1465, vx: 78, facing: 1 },
    { x: 3480, y: 590, w: 62, h: 40, minX: 3360, maxX: 3655, vx: 86, facing: -1 },
    { x: 5030, y: 590, w: 62, h: 40, minX: 4990, maxX: 5165, vx: 82, facing: -1 },
    { x: 5750, y: 590, w: 62, h: 40, minX: 5660, maxX: 5820, vx: 80, facing: 1 },
    { x: 7940, y: 590, w: 62, h: 40, minX: 7820, maxX: 8110, vx: 88, facing: -1 },
    { x: 9470, y: 590, w: 62, h: 40, minX: 9320, maxX: 9655, vx: 86, facing: -1 },
    { x: 10240, y: 590, w: 62, h: 40, minX: 10160, maxX: 10345, vx: 82, facing: 1 },
    { x: 11085, y: 590, w: 62, h: 40, minX: 11050, maxX: 11200, vx: 80, facing: -1 },
  ];

  // NEW CHALLENGE 1: Hanging Falling Crystal Icicles (shiver & glint when Mashmasha nears, then plummet!)
  const falling_icicles = [
    { x: 2975, y: 552, len: 42, floorY: 630, phase: 0.2 },
    { x: 3240, y: 472, len: 44, floorY: 630, phase: 1.1 },
    { x: 3500, y: 547, len: 40, floorY: 630, phase: 2.0 },
    { x: 4695, y: 487, len: 44, floorY: 630, phase: 0.6 },
    { x: 6165, y: 402, len: 46, floorY: 630, phase: 1.4 },
    { x: 6445, y: 517, len: 42, floorY: 630, phase: 2.3 },
    { x: 7690, y: 467, len: 44, floorY: 630, phase: 0.9 },
    { x: 9270, y: 387, len: 46, floorY: 630, phase: 1.7 },
    { x: 9540, y: 477, len: 44, floorY: 630, phase: 2.6 },
    { x: 10465, y: 557, len: 42, floorY: 630, phase: 0.5 },
    { x: 10725, y: 472, len: 46, floorY: 630, phase: 1.9 },
  ];

  // NEW CHALLENGE 2: Giant Rolling Snowballs barreling along glacial decks (flush on snow surface!)
  const snowballs = [
    { startX: 3560, minX: 2880, maxX: 3580, y: 608, r: 22, speed: 175, dir: -1, respawnDelay: 1.4 },
    { startX: 7980, minX: 7310, maxX: 8000, y: 606, r: 24, speed: 195, dir: -1, respawnDelay: 1.2 },
    { startX: 7770, minX: 7590, maxX: 7785, y: 428, r: 17, speed: 135, dir: -1, respawnDelay: 1.6 },
    { startX: 10910, minX: 10310, maxX: 10920, y: 605, r: 25, speed: 205, dir: -1, respawnDelay: 1.1 },
  ];

  // 7 Safe Snow-Covered Checkpoints (evenly spaced for fair progression across 11,600px!)
  const checkpoints = [
    { x: 1755, y: 353, activated: false },
    { x: 2735, y: 598, activated: false },
    { x: 4215, y: 598, activated: false },
    { x: 5695, y: 598, activated: false },
    { x: 7175, y: 598, activated: false },
    { x: 8735, y: 598, activated: false },
    { x: 10195, y: 598, activated: false },
  ];

  // 3 Collectible Arctic Fish Treats (2 hidden in day -> reveal with Night Vision!)
  const treats = [
    { x: 1632, y: 190, collected: false, hiddenInDay: true },
    { x: 5995, y: 185, collected: false, hiddenInDay: true },
    { x: 9270, y: 320, collected: false, hiddenInDay: false },
  ];

  const lamps = [
    170, 810, 1360, 2140, 2810, 3580, 4280, 5080, 5780, 6580, 7260, 8040, 8810, 9580, 10290, 10980, 11380,
  ];

  const goal = { x: 11435, y: 310, w: 72, h: 80 };

  return {
    stage: 16,
    theme: 'snow',
    winterOutfit: true,
    title: 'المرحلة 16',
    goalLabel: 'القلعة الثلجية ❄️',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    penguins,
    seals,
    falling_icicles,
    snowballs,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
