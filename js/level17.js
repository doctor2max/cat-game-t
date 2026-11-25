window.Game = window.Game || {};

window.Game.createLevel17 = function () {
  const width = 11200;
  const height = 720;

  // Stage 17: Midnight Grand Circus (السيرك الليلي المضيء)
  // 8 Escalating Carnival Zones (11,200px) with:
  // - Hardwood circus ring decks (circus_deck), gilded balconies (circus_ledge), climbable striped tent poles (circus_wall)
  // - NEW: High-bounce Circus Trampolines (circus_trampoline) with coiled steel springs
  // - NEW: Braided Acrobatic High-Wire Tightropes (tightrope) that flex subtly under Mashmasha's paws
  // - NEW: Swinging Aerial Trapeze Bars (trapeze_swing) suspended from overhead rigging cables
  // - NEW ENEMIES & HAZARDS: Unicycling Acrobat Monkeys, Wind-Up Jester Clown-Bots, Flaming Fire Hoops & Stealth Sleeping Circus Lions!
  const platforms = [
    // 8 Illuminated Circus Ring Ground Spans separated by 7 Spotlight Carnival Abyss Gaps
    { x: 0, y: 630, w: 980, h: 90, type: 'circus_deck', climbable: false },
    { x: 1300, y: 630, w: 1020, h: 90, type: 'circus_deck', climbable: false },
    { x: 2680, y: 630, w: 1040, h: 90, type: 'circus_deck', climbable: false },
    { x: 4080, y: 630, w: 1060, h: 90, type: 'circus_deck', climbable: false },
    { x: 5500, y: 630, w: 1060, h: 90, type: 'circus_deck', climbable: false },
    { x: 6940, y: 630, w: 1040, h: 90, type: 'circus_deck', climbable: false },
    { x: 8360, y: 630, w: 1040, h: 90, type: 'circus_deck', climbable: false },
    { x: 9760, y: 630, w: 1440, h: 90, type: 'circus_deck', climbable: false },

    // ZONE 1 (0..1300): Grand Entry Ring — Circus Trampoline Intro & First Tightrope Crossing
    { x: 310, y: 550, w: 145, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 560, y: 586, w: 112, h: 44, type: 'circus_trampoline', oneWay: true, bouncy: true },
    { x: 700, y: 425, w: 175, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 1010, y: 545, w: 255, h: 16, type: 'tightrope', oneWay: true },

    // ZONE 2 (1300..2680): Striped Tent-Pole Chimney (Secret Fish #1!) & Aerial Trapeze Gap
    { x: 1525, y: 395, w: 48, h: 235, type: 'circus_wall', oneWay: false, climbable: true },
    { x: 1675, y: 295, w: 48, h: 255, type: 'circus_wall', oneWay: false, climbable: true },
    { x: 1730, y: 385, w: 195, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 1585, y: 230, w: 155, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 2030, y: 515, w: 175, h: 24, type: 'circus_ledge', oneWay: true },
    // Abyss #2 (2320..2680): Swinging Trapeze Bars
    {
      x: 2375,
      y: 530,
      w: 112,
      h: 18,
      type: 'trapeze_swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 2375,
      baseY: 530,
      moveRange: 42,
      moveSpeed: 1.65,
      dx: 0,
      dy: 0,
    },
    {
      x: 2535,
      y: 500,
      w: 112,
      h: 18,
      type: 'trapeze_swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 2535,
      baseY: 500,
      moveRange: 40,
      moveSpeed: -1.7,
      dx: 0,
      dy: 0,
    },

    // ZONE 3 (2680..4080): Sleeping Lion Stealth Den, Flaming Hoops & Double High-Wire!
    { x: 2930, y: 525, w: 155, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 3175, y: 445, w: 190, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 3470, y: 586, w: 112, h: 44, type: 'circus_trampoline', oneWay: true, bouncy: true },
    // Abyss #3 (3720..4080): Long High-Wire Tightrope
    { x: 3745, y: 530, w: 310, h: 16, type: 'tightrope', oneWay: true },

    // ZONE 4 (4080..5500): Unicycle Acrobat Arena & Triple Trampoline Sky-Vault!
    { x: 4320, y: 540, w: 160, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 4585, y: 586, w: 112, h: 44, type: 'circus_trampoline', oneWay: true, bouncy: true },
    { x: 4725, y: 410, w: 185, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 4970, y: 500, w: 145, h: 24, type: 'circus_ledge', oneWay: true },
    // Abyss #4 (5140..5500): Trapeze + Tightrope Combo
    {
      x: 5190,
      y: 525,
      w: 112,
      h: 18,
      type: 'trapeze_swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 5190,
      baseY: 525,
      moveRange: 44,
      moveSpeed: 1.75,
      dx: 0,
      dy: 0,
    },
    { x: 5340, y: 525, w: 145, h: 16, type: 'tightrope', oneWay: true },

    // ZONE 5 (5500..6940): High Big-Top Rigging Ascent (Secret Fish #2!) & Fire Hoop Gauntlet
    { x: 5755, y: 390, w: 48, h: 240, type: 'circus_wall', oneWay: false, climbable: true },
    { x: 5905, y: 290, w: 48, h: 260, type: 'circus_wall', oneWay: false, climbable: true },
    { x: 5960, y: 380, w: 205, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 5805, y: 225, w: 160, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 6250, y: 495, w: 185, h: 24, type: 'circus_ledge', oneWay: true },
    // Abyss #5 (6560..6940): Twin Swinging Aerial Trapezes
    {
      x: 6615,
      y: 525,
      w: 112,
      h: 18,
      type: 'trapeze_swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 6615,
      baseY: 525,
      moveRange: 46,
      moveSpeed: 1.8,
      dx: 0,
      dy: 0,
    },
    {
      x: 6780,
      y: 490,
      w: 112,
      h: 18,
      type: 'trapeze_swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 6780,
      baseY: 490,
      moveRange: 44,
      moveSpeed: -1.85,
      dx: 0,
      dy: 0,
    },

    // ZONE 6 (6940..8360): Twin Sleeping Lions Stealth Run & Elevated High-Wire Gallery
    { x: 7180, y: 530, w: 165, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 7420, y: 440, w: 215, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 7710, y: 520, w: 185, h: 24, type: 'circus_ledge', oneWay: true },
    // Abyss #6 (7980..8360): Elevated High-Wire Tightrope Span
    { x: 8005, y: 535, w: 330, h: 16, type: 'tightrope', oneWay: true },

    // ZONE 7 (8360..9760): Grand Acrobat Sky-Ring (Fish #3!) & Fire-Hoop Trampoline Leap
    { x: 8600, y: 586, w: 112, h: 44, type: 'circus_trampoline', oneWay: true, bouncy: true },
    { x: 8745, y: 385, w: 215, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 9040, y: 465, w: 195, h: 24, type: 'circus_ledge', oneWay: true },
    // Abyss #7 (9400..9760): Final Aerial Trapeze Duo
    {
      x: 9455,
      y: 525,
      w: 112,
      h: 18,
      type: 'trapeze_swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 9455,
      baseY: 525,
      moveRange: 45,
      moveSpeed: 1.85,
      dx: 0,
      dy: 0,
    },
    {
      x: 9615,
      y: 495,
      w: 112,
      h: 18,
      type: 'trapeze_swing',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 9615,
      baseY: 495,
      moveRange: 42,
      moveSpeed: -1.9,
      dx: 0,
      dy: 0,
    },

    // ZONE 8 (9760..11200): Grand Big-Top Finale — Ringmaster Gauntlet & Tent Fortress!
    { x: 10020, y: 535, w: 165, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 10275, y: 450, w: 185, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 10545, y: 586, w: 112, h: 44, type: 'circus_trampoline', oneWay: true, bouncy: true },
    { x: 10685, y: 435, w: 165, h: 24, type: 'circus_ledge', oneWay: true },
    { x: 10860, y: 390, w: 310, h: 240, type: 'circus_wall', oneWay: false, climbable: true },
  ];

  // 7 Carnival Pit Gaps (glowing safety-net/spotlight abysses — fall hazard)
  const puddles = [
    { x: 980, y: 696, w: 320, h: 24 },
    { x: 2320, y: 696, w: 360, h: 24 },
    { x: 3720, y: 696, w: 360, h: 24 },
    { x: 5140, y: 696, w: 360, h: 24 },
    { x: 6560, y: 696, w: 380, h: 24 },
    { x: 7980, y: 696, w: 380, h: 24 },
    { x: 9400, y: 696, w: 360, h: 24 },
  ];

  const dogs = [];

  // NEW ENEMY 1: Unicycling Acrobat Monkeys (y + h === floorY -> 576 + 54 === 630!)
  const unicycle_monkeys = [
    { x: 440, y: 576, w: 44, h: 54, minX: 290, maxX: 525, vx: 98, facing: -1 },
    { x: 1920, y: 576, w: 44, h: 54, minX: 1750, maxX: 2240, vx: 106, facing: -1 },
    { x: 3250, y: 391, w: 44, h: 54, minX: 3180, maxX: 3320, vx: 74, facing: 1 },
    { x: 4450, y: 576, w: 44, h: 54, minX: 4300, maxX: 4545, vx: 108, facing: -1 },
    { x: 6040, y: 326, w: 44, h: 54, minX: 5970, maxX: 6115, vx: 76, facing: 1 },
    { x: 6280, y: 576, w: 44, h: 54, minX: 6080, maxX: 6490, vx: 112, facing: -1 },
    { x: 7510, y: 386, w: 44, h: 54, minX: 7430, maxX: 7585, vx: 78, facing: -1 },
    { x: 8830, y: 331, w: 44, h: 54, minX: 8755, maxX: 8910, vx: 80, facing: 1 },
    { x: 10220, y: 576, w: 44, h: 54, minX: 10040, maxX: 10490, vx: 116, facing: -1 },
  ];

  // NEW ENEMY 2: Vintage Wind-Up Rolling Jester Clown-Bots (y + h === 630 -> 574 + 56 === 630!)
  const circus_clowns = [
    { x: 820, y: 574, w: 46, h: 56, minX: 700, maxX: 930, vx: 86, facing: -1 },
    { x: 3560, y: 574, w: 46, h: 56, minX: 3440, maxX: 3665, vx: 90, facing: -1 },
    { x: 4920, y: 574, w: 46, h: 56, minX: 4740, maxX: 5080, vx: 96, facing: -1 },
    { x: 5650, y: 574, w: 46, h: 56, minX: 5560, maxX: 5705, vx: 84, facing: 1 },
    { x: 9160, y: 574, w: 46, h: 56, minX: 8980, maxX: 9335, vx: 98, facing: -1 },
    { x: 10720, y: 574, w: 46, h: 56, minX: 10680, maxX: 10805, vx: 88, facing: -1 },
  ];

  // NEW ENEMY 3: Majestic Sleeping Circus Lions on Velvet Cushions (y + h === 630 -> 564 + 66 === 630!)
  // Stealth Challenge: Sneak (Down) quietly past them while they nap; running loudly wakes them up!
  const sleeping_lions = [
    { x: 1390, y: 564, w: 102, h: 66, homeX: 1390, minX: 1315, maxX: 1455, facing: -1, phase: 0.2 },
    { x: 3040, y: 564, w: 102, h: 66, homeX: 3040, minX: 2920, maxX: 3200, facing: -1, phase: 1.1 },
    { x: 4770, y: 564, w: 102, h: 66, homeX: 4770, minX: 4680, maxX: 4880, facing: -1, phase: 0.7 },
    { x: 7390, y: 564, w: 102, h: 66, homeX: 7390, minX: 7240, maxX: 7545, facing: -1, phase: 1.8 },
    { x: 7760, y: 564, w: 102, h: 66, homeX: 7760, minX: 7640, maxX: 7885, facing: -1, phase: 0.4 },
    { x: 8800, y: 564, w: 102, h: 66, homeX: 8800, minX: 8720, maxX: 8935, facing: -1, phase: 2.1 },
  ];

  // NEW HAZARD 4: Flaming Circus Fire Hoops (Periodic flare cycle: calm amber embers -> telegraph -> roaring fire ring!)
  const fire_hoops = [
    { x: 1135, y: 492, r: 44, phase: 0.0 },
    { x: 3375, y: 565, r: 44, phase: 1.2 },
    { x: 3900, y: 478, r: 46, phase: 2.1 },
    { x: 5410, y: 472, r: 44, phase: 0.7 },
    { x: 6410, y: 565, r: 44, phase: 1.6 },
    { x: 8170, y: 482, r: 46, phase: 0.4 },
    { x: 10440, y: 565, r: 46, phase: 1.9 },
  ];

  // 7 Safe Hazard-Free Checkpoints
  const checkpoints = [
    { x: 1785, y: 353, activated: false },
    { x: 2755, y: 598, activated: false },
    { x: 4155, y: 598, activated: false },
    { x: 5575, y: 598, activated: false },
    { x: 7015, y: 598, activated: false },
    { x: 8435, y: 598, activated: false },
    { x: 9835, y: 598, activated: false },
  ];

  // 3 Collectible Golden Circus Fish Treats (2 hidden in day -> reveal with Night Vision!)
  const treats = [
    { x: 1660, y: 190, collected: false, hiddenInDay: true },
    { x: 5885, y: 185, collected: false, hiddenInDay: true },
    { x: 8850, y: 338, collected: false, hiddenInDay: false },
  ];

  const lamps = [
    170, 840, 1390, 2160, 2830, 3580, 4220, 5010, 5660, 6440, 7110, 7860, 8510, 9260, 9920, 10600, 10980,
  ];

  const goal = { x: 11035, y: 310, w: 72, h: 80 };

  return {
    stage: 17,
    theme: 'circus',
    circusOutfit: true,
    title: 'المرحلة 17',
    goalLabel: 'خيمة العرض الكبرى 🎪',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    unicycle_monkeys,
    circus_clowns,
    sleeping_lions,
    fire_hoops,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
