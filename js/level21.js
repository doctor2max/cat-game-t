window.Game = window.Game || {};

window.Game.createLevel21 = function () {
  // Stage 21: Venice Canals & Gondolas (قنوات البندقية الإيطالية — Adriatic Twilight)
  // 8 handcrafted Venetian canal, marble bridge & palazzo zones, 11,200px total length,
  // 7 safe checkpoints, 3 secret golden fish treats, 9 well-spaced Venetian enemies.
  // 5 BRAND-NEW VENETIAN OBSTACLE MECHANICS:
  //   1. gondola_boat       — Buoyant drifting Venetian Gondola that bobs on waves & dips dynamically under Mashmasha's weight!
  //   2. canal_tide_gate + canal_tide_raft — Brass Venetian Water-Lock Wheel that floods & lifts its linked floating raft upward!
  //   3. cafe_awning_fold   — Rhythmic folding striped Venetian café canopy (extended -> shudder warn -> retracted)!
  //   4. carnival_bell_swing — Swinging bronze Campanile church bell (crouch under edges or time the swing)!
  //   5. venice_water_spout — Ornate lion-head Venetian marble fountain erupting with periodic turquoise water columns!

  const platforms = [
    // === VENETIAN MARBLE QUAYS (FONDAMENTA) & GRAND CANAL SPANS ===
    { x: 0, y: 615, w: 1180, h: 105, type: 'venice_quay' },
    { x: 1480, y: 615, w: 1160, h: 105, type: 'venice_quay' },
    { x: 2940, y: 615, w: 1220, h: 105, type: 'venice_quay' },
    { x: 4480, y: 615, w: 1180, h: 105, type: 'venice_quay' },
    { x: 5980, y: 615, w: 1180, h: 105, type: 'venice_quay' },
    { x: 7480, y: 615, w: 1200, h: 105, type: 'venice_quay' },
    { x: 9000, y: 615, w: 1060, h: 105, type: 'venice_quay' },
    { x: 10300, y: 615, w: 900, h: 105, type: 'venice_quay' },

    // === ZONE 1 (0..1480): Fondamenta Entrance — Folding Café Awnings & First Gondola Canal ===
    { x: 380, y: 525, w: 140, h: 24, type: 'venice_balcony', oneWay: true },
    { x: 580, y: 455, w: 135, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 0.2 },
    { x: 785, y: 515, w: 140, h: 24, type: 'venice_balcony', oneWay: true },
    // Canal 1 (1180..1480): Drifting Buoyant Venetian Gondola!
    { x: 1235, y: 602, w: 150, h: 26, type: 'gondola_boat', oneWay: true, baseX: 1260, driftAmp: 62, driftSpeed: 1.25, phase: 0.1 },

    // === ZONE 2 (1480..2940): Murano Fountain Plaza (Secret Treat 1!) & Campanile Bell ===
    { x: 1730, y: 290, w: 100, h: 325, type: 'venice_water_spout', oneWay: false, phase: 0.3, liftForce: 1240 },
    { x: 1895, y: 315, w: 180, h: 24, type: 'venice_balcony', oneWay: true }, // Secret Treat 1 balcony!
    { x: 2145, y: 425, w: 135, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 1.2 },
    // Swinging bronze Campanile bell over the marble quay
    { x: 2370, y: 375, w: 80, h: 20, type: 'carnival_bell_swing', pivotX: 2410, pivotY: 375, chainLen: 182, maxAngle: 0.84, swingSpeed: 1.85, phase: 0.5, bobR: 23 },
    // Canal 2 (2640..2940): Drifting Gondola crossing
    { x: 2690, y: 602, w: 150, h: 26, type: 'gondola_boat', oneWay: true, baseX: 2715, driftAmp: 65, driftSpeed: 1.35, phase: 1.4 },

    // === ZONE 3 (2940..4480): Grand Water-Lock Canal — Sluice Wheel & Rising Tide Raft! ===
    { x: 3180, y: 557, w: 50, h: 58, type: 'canal_tide_gate', gateId: 'lock_3' },
    // Touching 'lock_3' wheel floods the lock & raises this floating timber raft up to the high bridge!
    { x: 3320, y: 570, w: 135, h: 24, type: 'canal_tide_raft', oneWay: true, gateId: 'lock_3', restY: 570, riseHeight: 155, raised: false },
    { x: 3530, y: 400, w: 165, h: 24, type: 'venice_balcony', oneWay: true },
    { x: 3770, y: 465, w: 135, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 2.0 },
    { x: 3975, y: 525, w: 140, h: 24, type: 'venice_balcony', oneWay: true },
    // Canal 3 (4160..4480): Double Gondola relay across wide canal!
    { x: 4200, y: 602, w: 130, h: 26, type: 'gondola_boat', oneWay: true, baseX: 4220, driftAmp: 36, driftSpeed: 1.4, phase: 0.3 },
    { x: 4345, y: 540, w: 115, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 0.8 },

    // === ZONE 4 (4480..5980): Palazzo Awning Walk & Twin Belfry Bells ===
    { x: 4720, y: 375, w: 80, h: 20, type: 'carnival_bell_swing', pivotX: 4760, pivotY: 375, chainLen: 182, maxAngle: 0.84, swingSpeed: 1.9, phase: 0.2, bobR: 23 },
    { x: 4960, y: 515, w: 135, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 0.4 },
    { x: 5165, y: 435, w: 135, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 2.1 },
    { x: 5380, y: 375, w: 80, h: 20, type: 'carnival_bell_swing', pivotX: 5420, pivotY: 375, chainLen: 182, maxAngle: 0.84, swingSpeed: 1.95, phase: 1.7, bobR: 23 },
    // Canal 4 (5660..5980): Gondola Crossing
    { x: 5720, y: 602, w: 150, h: 26, type: 'gondola_boat', oneWay: true, baseX: 5745, driftAmp: 66, driftSpeed: 1.4, phase: 2.2 },

    // === ZONE 5 (5980..7480): Doge's Lock Tower (Secret Treat 2!) ===
    { x: 6200, y: 557, w: 50, h: 58, type: 'canal_tide_gate', gateId: 'lock_5' },
    { x: 6340, y: 570, w: 135, h: 24, type: 'canal_tide_raft', oneWay: true, gateId: 'lock_5', restY: 570, riseHeight: 165, raised: false },
    { x: 6535, y: 385, w: 155, h: 24, type: 'venice_balcony', oneWay: true },
    { x: 6750, y: 295, w: 175, h: 24, type: 'venice_balcony', oneWay: true }, // Secret Treat 2 balcony!
    { x: 6990, y: 455, w: 135, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 1.5 },
    // Canal 5 (7160..7480): Gondola Crossing
    { x: 7220, y: 602, w: 150, h: 26, type: 'gondola_boat', oneWay: true, baseX: 7245, driftAmp: 65, driftSpeed: 1.45, phase: 0.9 },

    // === ZONE 6 (7480..9000): Rialto Fountain & Carnival Bell Arcade ===
    { x: 7710, y: 295, w: 100, h: 320, type: 'venice_water_spout', oneWay: false, phase: 1.1, liftForce: 1240 },
    { x: 7875, y: 350, w: 165, h: 24, type: 'venice_balcony', oneWay: true },
    { x: 8115, y: 450, w: 135, h: 24, type: 'cafe_awning_fold', oneWay: true, phase: 0.6 },
    { x: 8340, y: 375, w: 80, h: 20, type: 'carnival_bell_swing', pivotX: 8380, pivotY: 375, chainLen: 182, maxAngle: 0.86, swingSpeed: 2.0, phase: 1.1, bobR: 23 },
    // Canal 6 (8680..9000): Gondola Crossing
    { x: 8740, y: 602, w: 150, h: 26, type: 'gondola_boat', oneWay: true, baseX: 8765, driftAmp: 66, driftSpeed: 1.5, phase: 1.8 },

    // === ZONE 7 (9000..10300): Grand Lagoon Terrace (Secret Treat 3!) ===
    { x: 9220, y: 285, w: 100, h: 330, type: 'venice_water_spout', oneWay: false, phase: 0.5, liftForce: 1260 },
    { x: 9385, y: 310, w: 165, h: 24, type: 'venice_balcony', oneWay: true },
    { x: 9615, y: 245, w: 175, h: 24, type: 'venice_balcony', oneWay: true }, // Secret Treat 3 spire!
    { x: 9540, y: 557, w: 50, h: 58, type: 'canal_tide_gate', gateId: 'lock_7' },
    { x: 9680, y: 570, w: 135, h: 24, type: 'canal_tide_raft', oneWay: true, gateId: 'lock_7', restY: 570, riseHeight: 145, raised: false },
    // Canal 7 (10060..10300): Final Gondola ride into Piazza San Marco!
    { x: 10105, y: 602, w: 145, h: 26, type: 'gondola_boat', oneWay: true, baseX: 10115, driftAmp: 46, driftSpeed: 1.35, phase: 0.4 },

    // === ZONE 8 (10300..11200): Piazza San Marco Approach ===
    { x: 10480, y: 375, w: 80, h: 20, type: 'carnival_bell_swing', pivotX: 10520, pivotY: 375, chainLen: 182, maxAngle: 0.84, swingSpeed: 1.9, phase: 0.7, bobR: 23 },
    { x: 10680, y: 515, w: 150, h: 24, type: 'venice_balcony', oneWay: true },
  ];

  // Ornate Venetian wrought-iron canal streetlamps (plain X coordinates!)
  const lamps = [
    180, 920, 1540, 2240, 3010, 3840, 4540, 5260, 6040, 6820, 7540, 8260, 9060, 9840, 10360, 10820,
  ];

  // 7 Safe Marble Plaza Checkpoints (y=583 -> bottom=615 flush on quay!)
  const checkpoints = [
    { x: 1530, y: 583, reached: false },
    { x: 3000, y: 583, reached: false },
    { x: 4540, y: 583, reached: false },
    { x: 6040, y: 583, reached: false },
    { x: 7540, y: 583, reached: false },
    { x: 9060, y: 583, reached: false },
    { x: 10365, y: 583, reached: false },
  ];

  // 3 Secret Golden Fish Treats on high Venetian palazzo balconies
  const treats = [
    { x: 1985, y: 262, collected: false },
    { x: 6838, y: 242, collected: false },
    { x: 9702, y: 192, collected: false },
  ];

  // 9 Well-Spaced Authentic Venetian Enemies (ZERO clutter!)
  // 1. Masked Venetian Carnival Jesters (crouch-aware sight, walkDist-driven stride!)
  const carnival_jesters = [
    { x: 940, y: 553, w: 56, h: 62, minX: 820, maxX: 1100, facing: -1, vx: 78, phase: 0.3 },
    { x: 5120, y: 553, w: 56, h: 62, minX: 4960, maxX: 5280, facing: -1, vx: 82, phase: 1.4 },
    { x: 10680, y: 553, w: 56, h: 62, minX: 10580, maxX: 10840, facing: -1, vx: 82, phase: 0.8 },
  ];

  // 2. Lagoon Quay Stone Crabs (grounded flush at y=583, h=32 -> bottom=615!)
  const canal_crabs = [
    { x: 2050, y: 583, w: 48, h: 32, minX: 1880, maxX: 2260, facing: -1, vx: 72, phase: 0.5 },
    { x: 6780, y: 583, w: 48, h: 32, minX: 6580, maxX: 7020, facing: -1, vx: 76, phase: 1.6 },
    { x: 8040, y: 583, w: 48, h: 32, minX: 7880, maxX: 8220, facing: -1, vx: 78, phase: 2.1 },
  ];

  // 3. Calm High-Gliding Adriatic Lagoon Gulls (predictable smooth flight — NO sudden swooping!)
  const venice_gulls = [
    { x: 2020, y: 205, baseY: 205, w: 58, h: 30, minX: 1820, maxX: 2260, vx: -130, facing: -1, amp: 16, phase: 0.6 },
    { x: 6520, y: 195, baseY: 195, w: 58, h: 30, minX: 6280, maxX: 6780, vx: 135, facing: 1, amp: 16, phase: 1.5 },
    { x: 9520, y: 185, baseY: 185, w: 58, h: 30, minX: 9300, maxX: 9780, vx: -135, facing: -1, amp: 16, phase: 2.3 },
  ];

  return {
    stage: 21,
    title: 'المرحلة 21',
    width: 11200,
    height: 720,
    startX: 110,
    startY: 571,
    theme: 'venice',
    veniceOutfit: true,
    goal: { x: 10940, y: 485, w: 120, h: 130 },
    goalLabel: 'ساحة سان ماركو 🎭',
    platforms,
    lamps,
    checkpoints,
    treats,
    dogs: [],
    crows: [],
    puddles: [],
    spiders: [],
    carnival_jesters,
    canal_crabs,
    venice_gulls,
  };
};
