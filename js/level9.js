window.Game = window.Game || {};

window.Game.createLevel9 = function () {
  const width = 5600;
  const height = 720;

  // Stage 9: Grand Night Museum (المتحف الكلاسيكي الملكي)
  // Signature New Obstacles: Swinging Crystal Chandeliers, Phase-Shifting Glass Bridges, Relic Display Cases, Laser Grids
  // Signature New Enemies: Armored Museum Security Bots & Ceiling Sweeping Laser Turrets
  const platforms = [
    { x: 0, y: 630, w: 880, h: 90, type: 'marble', climbable: false },
    { x: 1180, y: 630, w: 940, h: 90, type: 'marble', climbable: false },
    { x: 2460, y: 630, w: 980, h: 90, type: 'marble', climbable: false },
    { x: 3780, y: 630, w: 880, h: 90, type: 'marble', climbable: false },
    { x: 4960, y: 630, w: 640, h: 90, type: 'marble', climbable: false },

    // Zone 1: Fossil Hall -> Relic Display Cases, Laser Gate & Swinging Crystal Chandelier
    { x: 240, y: 550, w: 105, h: 80, type: 'display_case', oneWay: false },
    { x: 470, y: 616, w: 135, h: 14, type: 'laser_grid', oneWay: false, phase: 0.2 },
    { x: 675, y: 530, w: 110, h: 100, type: 'display_case', oneWay: false },
    {
      x: 945,
      y: 520,
      w: 145,
      h: 22,
      type: 'chandelier',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 945,
      baseY: 520,
      moveRange: 80,
      moveSpeed: 1.6,
      dx: 0,
      dy: 0,
    },

    // Zone 2: Mona-Cat Gallery -> Display Cases, Phase-Shifting Glass Bridge & Secret Fish #1
    { x: 1320, y: 545, w: 100, h: 85, type: 'display_case', oneWay: false },
    { x: 1490, y: 455, w: 145, h: 20, type: 'phase_platform', oneWay: true, phase: 0.0 },
    { x: 1715, y: 390, w: 155, h: 20, type: 'phase_platform', oneWay: true, phase: 1.2 },
    { x: 1525, y: 275, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 1935, y: 535, w: 105, h: 95, type: 'display_case', oneWay: false },

    // Gap 2 Crossing -> Twin Phase Glass Bridges!
    { x: 2170, y: 530, w: 120, h: 20, type: 'phase_platform', oneWay: true, phase: 0.4 },
    { x: 2325, y: 495, w: 115, h: 20, type: 'phase_platform', oneWay: true, phase: 1.8 },

    // Zone 3: Grand Rotunda -> Wall-Jump Marble Columns, Ornate Museum Balcony (Fish #2) & Laser Gate
    { x: 2630, y: 380, w: 46, h: 250, type: 'marble', oneWay: false, climbable: true },
    { x: 2775, y: 290, w: 46, h: 260, type: 'marble', oneWay: false, climbable: true },
    { x: 2825, y: 375, w: 185, h: 24, type: 'museum_balcony', oneWay: true },
    { x: 3080, y: 616, w: 145, h: 14, type: 'laser_grid', oneWay: false, phase: 1.3 },
    { x: 3290, y: 535, w: 105, h: 95, type: 'display_case', oneWay: false },

    // Gap 3 Crossing -> Swinging Crystal Chandelier #2
    {
      x: 3530,
      y: 475,
      w: 150,
      h: 22,
      type: 'chandelier',
      oneWay: true,
      moving: true,
      swing: true,
      baseX: 3530,
      baseY: 475,
      moveRange: 85,
      moveSpeed: -1.65,
      dx: 0,
      dy: 0,
    },

    // Zone 4: Treasure Vault -> Display Case Ascent, Phase Ledge to Secret Fish #3
    { x: 3960, y: 540, w: 105, h: 90, type: 'display_case', oneWay: false },
    { x: 4145, y: 445, w: 140, h: 20, type: 'phase_platform', oneWay: true, phase: 0.5 },
    { x: 4140, y: 325, w: 145, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },
    { x: 4380, y: 616, w: 140, h: 14, type: 'laser_grid', oneWay: false, phase: 0.8 },

    // Gap 4 Crossing -> Phase Bridge + Final Grand Marble Staircase
    { x: 4735, y: 530, w: 145, h: 20, type: 'phase_platform', oneWay: true, phase: 0.2 },
    { x: 5080, y: 545, w: 105, h: 85, type: 'display_case', oneWay: false },
    { x: 5255, y: 455, w: 280, h: 175, type: 'marble', oneWay: false },
  ];

  const puddles = [];
  const dogs = [];

  // Brand-New Museum Armored Security Bots
  const security_bots = [
    { x: 1620, y: 582, w: 46, h: 48, minX: 1445, maxX: 1900, vx: 95, facing: -1 },
    { x: 2940, y: 582, w: 46, h: 48, minX: 2840, maxX: 3060, vx: 100, facing: 1 },
    { x: 4220, y: 582, w: 46, h: 48, minX: 4090, maxX: 4360, vx: 105, facing: -1 },
  ];

  // Brand-New Ceiling Sweeping Laser Turrets!
  const sweeping_lasers = [
    { x: 560, y: 345, len: 245, sweep: 0.55, speed: 1.3, phase: 0.3 },
    { x: 2295, y: 240, len: 230, sweep: 0.52, speed: 1.45, phase: 1.2 },
    { x: 3590, y: 245, len: 235, sweep: 0.55, speed: 1.35, phase: 0.7 },
    { x: 4815, y: 255, len: 230, sweep: 0.52, speed: 1.4, phase: 2.0 },
  ];

  const checkpoints = [
    { x: 1230, y: 598, activated: false },
    { x: 2875, y: 343, activated: false },
    { x: 3835, y: 598, activated: false },
  ];

  const treats = [
    { x: 1598, y: 235, collected: false, hiddenInDay: true },
    { x: 2935, y: 335, collected: false, hiddenInDay: false },
    { x: 4212, y: 285, collected: false, hiddenInDay: true },
  ];

  // Indoor museum uses brass wall sconces & crystal chandeliers (no outdoor streetlamps!)
  const lamps = [];
  const goal = { x: 5385, y: 375, w: 72, h: 80 };

  return {
    stage: 9,
    theme: 'museum',
    title: 'المرحلة 9',
    goalLabel: 'بوابة الجسر 🌉',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    security_bots,
    sweeping_lasers,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
