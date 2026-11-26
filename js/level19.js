window.Game = window.Game || {};

window.Game.createLevel19 = function () {
  // Stage 19: Traditional Japanese Old Town (حي اليابان الشعبي — Kyoto Twilight Alley)
  // 8 handcrafted Kyoto zones, 11,220px total length, 7 checkpoints, 3 secret fish treats.
  // 6 BRAND-NEW, GENUINELY INNOVATIVE OBSTACLE MECHANICS (zero reskins!):
  //   1. crushing_lantern  — Carved Kyoto granite drop-block: trembles, slams down, pauses & winches up (ride top as elevator!)
  //   2. pendulum_censer   — Heavy bronze temple fire censer swinging in a sinusoidal arc (crouch under or jump over!)
  //   3. jump_flip_panel   — Red (group 0) & Blue (group 1) Shoji panels that flip solid/ghost on EVERY real jump!
  //   4. waterwheel_arm    — 4 horizontal timber gondolas orbiting a rotating spoked Kyoto cedar waterwheel hub!
  //   5. wagasa_ricochet   — Tilted 45° Japanese Wagasa umbrellas launching Mashmasha DIAGONALLY in pinball chains!
  //   6. pinch_wall        — Opposing sliding Yakisugi/Shoji walls (climbable wall-jump chimneys & crushing ground gates!)

  // Helper to spawn a complete 4-arm rotating Kyoto waterwheel lift
  function makeWaterwheel(hubX, hubY, radius, rotSpeed, platW) {
    const w = platW || 86;
    const h = 20;
    return [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((armAngle, idx) => ({
      x: hubX + Math.cos(armAngle) * radius - w / 2,
      y: hubY + Math.sin(armAngle) * radius - h / 2,
      w,
      h,
      type: 'waterwheel_arm',
      oneWay: true,
      hubX,
      hubY,
      radius,
      armAngle,
      rotSpeed,
      isHubArm: idx === 0,
    }));
  }

  const platforms = [
    // === GROUND COBBLE STREET (ISHIDATAMI) & KOI CANAL SPANS ===
    { x: 0, y: 630, w: 1220, h: 90, type: 'japan_deck' },
    { x: 1460, y: 630, w: 1180, h: 90, type: 'japan_deck' },
    { x: 2920, y: 630, w: 1260, h: 90, type: 'japan_deck' },
    { x: 4460, y: 630, w: 1220, h: 90, type: 'japan_deck' },
    { x: 5980, y: 630, w: 1200, h: 90, type: 'japan_deck' },
    { x: 7460, y: 630, w: 1240, h: 90, type: 'japan_deck' },
    { x: 8980, y: 630, w: 1080, h: 90, type: 'japan_deck' },
    { x: 10280, y: 630, w: 940, h: 90, type: 'japan_deck' },

    // === ZONE 1 (0..1460): Intro — Pendulum Censer, Jump-Flip Stairs & Canal 1 Waterwheel ===
    { x: 470, y: 390, w: 80, h: 20, type: 'pendulum_censer', pivotX: 510, pivotY: 390, chainLen: 185, maxAngle: 0.86, swingSpeed: 1.9, phase: 0.2, bobR: 22 },
    // Jump-Flip intro over safe ground (starts Blue on jump 1 -> Red on jump 2 -> Blue on jump 3!)
    { x: 720, y: 540, w: 120, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 1 },
    { x: 880, y: 465, w: 120, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 0 },
    { x: 1040, y: 525, w: 120, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 1 },
    // Canal 1 (1220..1460): Rotating 4-Arm Kyoto Waterwheel!
    ...makeWaterwheel(1340, 540, 88, 0.88, 86),

    // === ZONE 2 (1460..2920): Crushing Shrine Drop-Blocks & Secret Treat 1 Elevator! ===
    { x: 1755, y: 445, w: 88, h: 76, type: 'crushing_lantern', restY: 445, dropY: 554 },
    // Ride the rising crushing_lantern to reach Secret Treat 1 rooftop!
    { x: 1915, y: 365, w: 175, h: 24, type: 'shoji_tile_roof', oneWay: true },
    { x: 2150, y: 465, w: 140, h: 24, type: 'shoji_tile_roof', oneWay: true },
    { x: 2350, y: 445, w: 88, h: 76, type: 'crushing_lantern', restY: 445, dropY: 554 },
    // Canal 2 (2640..2920): Tilted 45° Wagasa Pinball Ricochet right across the canal!
    { x: 2610, y: 555, w: 84, h: 36, type: 'wagasa_ricochet', launchDir: 1, launchVx: 530, launchVy: 715 },

    // === ZONE 3 (2920..4460): Wagasa Pinball Chain, Pendulum Plaza & Jump-Flip Canal ===
    { x: 3170, y: 555, w: 84, h: 36, type: 'wagasa_ricochet', launchDir: 1, launchVx: 430, launchVy: 715 },
    { x: 3440, y: 495, w: 84, h: 36, type: 'wagasa_ricochet', launchDir: 1, launchVx: 445, launchVy: 725 },
    { x: 3710, y: 455, w: 155, h: 24, type: 'shoji_tile_roof', oneWay: true },
    { x: 3940, y: 390, w: 80, h: 20, type: 'pendulum_censer', pivotX: 3980, pivotY: 390, chainLen: 185, maxAngle: 0.88, swingSpeed: 2.05, phase: 1.4, bobR: 22 },
    // Canal 3 (4180..4460): Alternating Jump-Flip Canal Bridge
    { x: 4205, y: 555, w: 112, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 1 },
    { x: 4335, y: 515, w: 112, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 0 },

    // === ZONE 4 (4460..5980): Sliding Pinch-Wall Chimney, Ground Pinch Gate & Canal 4 Waterwheel ===
    // Climbable sliding Pinch-Wall Chimney (slides close together so Mashmasha wall-jumps up!)
    { x: 4700, y: 385, w: 42, h: 245, type: 'pinch_wall', climbable: true, canCrush: false, baseX: 4700, slideDir: 1, slideDist: 52, phase: 0.2 },
    { x: 4920, y: 385, w: 42, h: 245, type: 'pinch_wall', climbable: true, canCrush: false, baseX: 4920, slideDir: -1, slideDist: 52, phase: 0.2 },
    { x: 5005, y: 380, w: 170, h: 24, type: 'shoji_tile_roof', oneWay: true },
    // Opposing Crushing Ground Pinch Gate on the street!
    { x: 5300, y: 510, w: 42, h: 120, type: 'pinch_wall', climbable: false, canCrush: true, baseX: 5300, slideDir: 1, slideDist: 62, phase: 1.8 },
    { x: 5490, y: 510, w: 42, h: 120, type: 'pinch_wall', climbable: false, canCrush: true, baseX: 5490, slideDir: -1, slideDist: 62, phase: 1.8 },
    // Canal 4 (5680..5980): Grand Rotating Kyoto Waterwheel
    ...makeWaterwheel(5830, 535, 96, 0.92, 86),

    // === ZONE 5 (5980..7460): Twin Pendulums, Pinch-Wall Spire (Secret Treat 2!) & Wagasa Canal ===
    { x: 6220, y: 390, w: 80, h: 20, type: 'pendulum_censer', pivotX: 6260, pivotY: 390, chainLen: 185, maxAngle: 0.86, swingSpeed: 2.0, phase: 0.1, bobR: 22 },
    { x: 6510, y: 390, w: 80, h: 20, type: 'pendulum_censer', pivotX: 6550, pivotY: 390, chainLen: 185, maxAngle: 0.86, swingSpeed: 2.0, phase: 2.2, bobR: 22 },
    // Tall Pinch-Wall Chimney leading to Secret Treat 2 pagoda balcony!
    { x: 6765, y: 345, w: 42, h: 285, type: 'pinch_wall', climbable: true, canCrush: false, baseX: 6765, slideDir: 1, slideDist: 50, phase: 1.0 },
    { x: 6980, y: 345, w: 42, h: 285, type: 'pinch_wall', climbable: true, canCrush: false, baseX: 6980, slideDir: -1, slideDist: 50, phase: 1.0 },
    { x: 6810, y: 315, w: 170, h: 24, type: 'shoji_tile_roof', oneWay: true }, // Secret Treat 2 balcony!
    // Canal 5 (7180..7460): Wagasa Ricochet Launch
    { x: 7150, y: 555, w: 84, h: 36, type: 'wagasa_ricochet', launchDir: 1, launchVx: 530, launchVy: 715 },

    // === ZONE 6 (7460..8980): Crushing Gauntlet, Pinch Gate, Jump-Flip & Reverse Waterwheel ===
    { x: 7710, y: 445, w: 88, h: 76, type: 'crushing_lantern', restY: 445, dropY: 554 },
    { x: 7980, y: 510, w: 42, h: 120, type: 'pinch_wall', climbable: false, canCrush: true, baseX: 7980, slideDir: 1, slideDist: 62, phase: 0.6 },
    { x: 8170, y: 510, w: 42, h: 120, type: 'pinch_wall', climbable: false, canCrush: true, baseX: 8170, slideDir: -1, slideDist: 62, phase: 0.6 },
    // Elevated Jump-Flip sequence
    { x: 8360, y: 530, w: 118, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 1 },
    { x: 8520, y: 455, w: 118, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 0 },
    // Canal 6 (8700..8980): Counter-Rotating Waterwheel!
    ...makeWaterwheel(8840, 535, 94, -0.94, 86),

    // === ZONE 7 (8980..10280): Kyoto Finale Mix — Wagasa Spire (Secret Treat 3!), Crusher & Pendulum ===
    { x: 9200, y: 555, w: 84, h: 36, type: 'wagasa_ricochet', launchDir: 1, launchVx: 415, launchVy: 760 },
    { x: 9465, y: 445, w: 84, h: 36, type: 'wagasa_ricochet', launchDir: 1, launchVx: 425, launchVy: 775 },
    { x: 9710, y: 315, w: 175, h: 24, type: 'shoji_tile_roof', oneWay: true }, // Secret Treat 3 festival spire!
    // Lower street challenge path
    { x: 9540, y: 445, w: 88, h: 76, type: 'crushing_lantern', restY: 445, dropY: 554 },
    { x: 9810, y: 390, w: 80, h: 20, type: 'pendulum_censer', pivotX: 9850, pivotY: 390, chainLen: 185, maxAngle: 0.88, swingSpeed: 2.1, phase: 0.9, bobR: 22 },
    // Canal 7 (10060..10280): Jump-Flip Finale Crossing
    { x: 10070, y: 550, w: 108, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 1 },
    { x: 10180, y: 505, w: 108, h: 22, type: 'jump_flip_panel', oneWay: true, flipGroup: 0 },

    // === ZONE 8 (10280..11220): Grand Vermilion Torii Sanctuary Approach ===
    { x: 10470, y: 390, w: 80, h: 20, type: 'pendulum_censer', pivotX: 10510, pivotY: 390, chainLen: 185, maxAngle: 0.86, swingSpeed: 2.0, phase: 1.5, bobR: 22 },
    { x: 10715, y: 445, w: 88, h: 76, type: 'crushing_lantern', restY: 445, dropY: 554 },
  ];

  // Authentic Kyoto Twilight Street Lamps (plain X coordinates matching drawStreetlamps)
  const lamps = [
    190, 880, 1540, 2260, 3010, 3680, 4530, 5280, 6060, 6780, 7540, 8260, 9060, 9780, 10360, 10840,
  ];

  // 7 Fair Checkpoints placed in hazard-free Machiya alley plazas
  const checkpoints = [
    { x: 1510, y: 598, reached: false },
    { x: 2985, y: 598, reached: false },
    { x: 4525, y: 598, reached: false },
    { x: 6045, y: 598, reached: false },
    { x: 7525, y: 598, reached: false },
    { x: 9045, y: 598, reached: false },
    { x: 10355, y: 598, reached: false },
  ];

  // 3 Secret Golden Fish Treats rewarding clever use of the new mechanics!
  // Treat 1: Ride the rising Crushing Lantern elevator (Zone 2)
  // Treat 2: Wall-jump up the closing Pinch-Wall Chimney (Zone 5)
  // Treat 3: Ride the double Wagasa Pinball Ricochet chain (Zone 7)
  const treats = [
    { x: 2002, y: 312, collected: false },
    { x: 6895, y: 262, collected: false },
    { x: 9798, y: 262, collected: false },
  ];

  // 1. Mischievous Leaf-Disguised Tanuki Rascals (trimmed to 3 well-spaced encounters)
  const tanuki_rascals = [
    { x: 660, y: 588, w: 58, h: 42, minX: 550, maxX: 840, facing: -1, phase: 0.4 },
    { x: 5120, y: 588, w: 58, h: 42, minX: 5000, maxX: 5240, facing: -1, phase: 0.9 },
    { x: 9380, y: 588, w: 58, h: 42, minX: 9280, maxX: 9490, facing: -1, phase: 0.6 },
  ];

  // 2. Alert Shiba Inu Street Guards (trimmed to 2 clear alley guards)
  const shiba_guards = [
    { x: 3420, y: 584, w: 64, h: 46, minX: 3280, maxX: 3620, facing: -1, vx: 80, phase: 1.2 },
    { x: 10610, y: 584, w: 64, h: 46, minX: 10540, maxX: 10680, facing: -1, vx: 82, phase: 0.8 },
  ];

  // 3. Swooping Kyoto Karasu Crows (trimmed to 3 high-eave patrols, away from canal jumps)
  const samurai_crows = [
    { x: 2150, y: 245, baseY: 245, w: 58, h: 32, minX: 1960, maxX: 2340, vx: -140, facing: -1, amp: 20, phase: 1.4 },
    { x: 6380, y: 245, baseY: 245, w: 58, h: 32, minX: 6180, maxX: 6620, vx: 145, facing: 1, amp: 22, phase: 1.8 },
    { x: 9660, y: 250, baseY: 250, w: 58, h: 32, minX: 9460, maxX: 9900, vx: -145, facing: -1, amp: 20, phase: 1.1 },
  ];

  // 4. Rolling Red Lacquered Daruma Dolls (trimmed to 2, clear of crushing blocks)
  const daruma_rollers = [
    { startX: 2540, y: 608, r: 22, minX: 2000, maxX: 2560, speed: 152, dir: -1, respawnDelay: 1.6 },
    { startX: 8580, y: 608, r: 22, minX: 8250, maxX: 8600, speed: 162, dir: -1, respawnDelay: 1.5 },
  ];

  return {
    stage: 19,
    title: 'المرحلة 19',
    width: 11220,
    height: 720,
    startX: 110,
    startY: 586,
    theme: 'japan',
    japanOutfit: true,
    hasJumpFlip: true,
    jumpParity: 0,
    goal: { x: 10940, y: 500, w: 120, h: 130 },
    goalLabel: 'بوابة كيوتو الشعبية ⛩️',
    platforms,
    lamps,
    checkpoints,
    treats,
    dogs: [],
    crows: [],
    puddles: [],
    spiders: [],
    tanuki_rascals,
    shiba_guards,
    samurai_crows,
    daruma_rollers,
  };
};
