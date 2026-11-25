window.Game = window.Game || {};

window.Game.createLevel23 = function () {
  // =========================================================================
  // STAGE 23: MARRAKECH SOUK & KASBAH ROOFTOPS (أسواق مراكش وأسطح القصبة)
  // 14,800px | 6 Escalating Zones | 5 Moroccan Mechanics | 18 Enemies | 5 Checkpoints
  // Signature Mechanics:
  //   1. souk_carpet_bounce      — Tensioned Berber rug canopy that flexes & springs Mashmasha high!
  //   2. morocco_lantern_swing   — Giant swinging pierced-brass star chandelier with level platform!
  //   3. morocco_magic_carpet    — Gliding embroidered woven carpet carrying Mashmasha across souk alleys!
  //   4. morocco_cedar_lever + morocco_cedar_bridge — Bidirectional brass ring lever toggling cedarwood bridge!
  //   5. morocco_fountain_geyser — Octagonal Zellij Riad fountain with periodic buoyant turquoise water plume!
  // =========================================================================
  const groundY = 615;
  const groundH = 105;

  const platforms = [
    // === ZONE 1: Medina Gate & Carpet Souk Terraces (0 .. 2250) ===
    { x: 0, y: groundY, w: 660, h: groundH, type: 'kasbah_terrace' },
    { x: 300, y: 508, w: 126, h: 24, type: 'souk_carpet_bounce', oneWay: true, bouncy: true },
    { x: 470, y: 398, w: 185, h: 24, type: 'kasbah_terrace', oneWay: true },
    { x: 750, y: groundY, w: 580, h: groundH, type: 'kasbah_terrace' },
    { x: 880, y: 506, w: 126, h: 24, type: 'souk_carpet_bounce', oneWay: true, bouncy: true },
    { x: 1050, y: 392, w: 200, h: 24, type: 'kasbah_terrace', oneWay: true },
    // Gliding embroidered Berber carpet crossing the first Medina alley!
    { x: 1470, y: 545, w: 118, h: 20, type: 'morocco_magic_carpet', oneWay: true, baseX: 1490, baseY: 545, moveAmpX: 95, moveAmpY: 16, speed: 1.35, phase: 0.2 },
    { x: 1680, y: groundY, w: 570, h: groundH, type: 'kasbah_terrace' },

    // === ZONE 2: Brass Lantern Chandeliers & Riad Fountain Plaza (2250 .. 4650) ===
    { x: 2460, y: 245, w: 86, h: 18, type: 'morocco_lantern_swing', oneWay: true, ropeLen: 265, swingAmp: 0.44, swingSpeed: 1.45, phase: 0.1 },
    { x: 2680, y: groundY, w: 690, h: groundH, type: 'kasbah_terrace' },
    { x: 2840, y: 506, w: 126, h: 24, type: 'souk_carpet_bounce', oneWay: true, bouncy: true },
    { x: 3015, y: 388, w: 210, h: 24, type: 'kasbah_terrace', oneWay: true },
    // Octagonal Zellij Riad fountain geyser lifting across the courtyard!
    { x: 3435, y: 358, w: 94, h: 262, type: 'morocco_fountain_geyser', phase: 0.0, liftForce: 1250 },
    { x: 3600, y: 428, w: 200, h: 24, type: 'kasbah_terrace', oneWay: true },
    { x: 3600, y: groundY, w: 1050, h: groundH, type: 'kasbah_terrace' },
    { x: 4040, y: 506, w: 126, h: 24, type: 'souk_carpet_bounce', oneWay: true, bouncy: true },
    { x: 4215, y: 384, w: 220, h: 24, type: 'kasbah_terrace', oneWay: true },

    // === ZONE 3: Bidirectional Cedarwood Bridge & Spice Souk Gauntlet (4650 .. 7150) ===
    { x: 4525, y: groundY - 56, w: 46, h: 56, type: 'morocco_cedar_lever', bridgeId: 'bab_1', opened: false },
    { x: 4650, y: groundY - 8, w: 330, h: 22, type: 'morocco_cedar_bridge', bridgeId: 'bab_1', oneWay: true, lowered: false },
    { x: 4980, y: groundY, w: 680, h: groundH, type: 'kasbah_terrace' },
    { x: 5150, y: 506, w: 126, h: 24, type: 'souk_carpet_bounce', oneWay: true, bouncy: true },
    { x: 5330, y: 382, w: 230, h: 24, type: 'kasbah_terrace', oneWay: true },
    // Twin swinging brass star lanterns across the grand spice bazaar!
    { x: 5865, y: 240, w: 86, h: 18, type: 'morocco_lantern_swing', oneWay: true, ropeLen: 260, swingAmp: 0.46, swingSpeed: 1.55, phase: 0.4 },
    { x: 6205, y: 240, w: 86, h: 18, type: 'morocco_lantern_swing', oneWay: true, ropeLen: 260, swingAmp: 0.46, swingSpeed: 1.55, phase: 2.2 },
    { x: 6420, y: groundY, w: 730, h: groundH, type: 'kasbah_terrace' },

    // === ZONE 4: Floating Carpet Caravan & Riad Courtyard Fountains (7150 .. 9800) ===
    { x: 7320, y: 540, w: 118, h: 20, type: 'morocco_magic_carpet', oneWay: true, baseX: 7340, baseY: 540, moveAmpX: 90, moveAmpY: 22, speed: 1.45, phase: 0.0 },
    { x: 7660, y: 490, w: 118, h: 20, type: 'morocco_magic_carpet', oneWay: true, baseX: 7680, baseY: 490, moveAmpX: 90, moveAmpY: 24, speed: 1.50, phase: 1.7 },
    { x: 7920, y: groundY, w: 780, h: groundH, type: 'kasbah_terrace' },
    { x: 8140, y: 504, w: 126, h: 24, type: 'souk_carpet_bounce', oneWay: true, bouncy: true },
    { x: 8320, y: 380, w: 220, h: 24, type: 'kasbah_terrace', oneWay: true },
    // Rhythmic twin Riad fountain geysers!
    { x: 8780, y: 358, w: 94, h: 262, type: 'morocco_fountain_geyser', phase: 0.6, liftForce: 1260 },
    { x: 8990, y: 452, w: 170, h: 24, type: 'kasbah_terrace', oneWay: true },
    { x: 9235, y: 358, w: 94, h: 262, type: 'morocco_fountain_geyser', phase: 2.3, liftForce: 1260 },
    { x: 9395, y: groundY, w: 740, h: groundH, type: 'kasbah_terrace' },

    // === ZONE 5: Second Cedarwood Bridge & Kasbah Citadel Finale (9800 .. 13550) ===
    { x: 10010, y: groundY - 56, w: 46, h: 56, type: 'morocco_cedar_lever', bridgeId: 'bab_2', opened: false },
    { x: 10135, y: groundY - 8, w: 340, h: 22, type: 'morocco_cedar_bridge', bridgeId: 'bab_2', oneWay: true, lowered: false },
    { x: 10475, y: groundY, w: 660, h: groundH, type: 'kasbah_terrace' },
    { x: 10660, y: 504, w: 126, h: 24, type: 'souk_carpet_bounce', oneWay: true, bouncy: true },
    { x: 10840, y: 378, w: 230, h: 24, type: 'kasbah_terrace', oneWay: true },
    // Grand Lantern + Carpet + Fountain Finale Sequence!
    { x: 11340, y: 240, w: 86, h: 18, type: 'morocco_lantern_swing', oneWay: true, ropeLen: 260, swingAmp: 0.48, swingSpeed: 1.62, phase: 0.3 },
    { x: 11680, y: 530, w: 118, h: 20, type: 'morocco_magic_carpet', oneWay: true, baseX: 11700, baseY: 530, moveAmpX: 96, moveAmpY: 20, speed: 1.58, phase: 0.9 },
    { x: 11980, y: groundY, w: 640, h: groundH, type: 'kasbah_terrace' },
    { x: 12720, y: 358, w: 94, h: 262, type: 'morocco_fountain_geyser', phase: 1.1, liftForce: 1270 },
    { x: 12980, y: 240, w: 86, h: 18, type: 'morocco_lantern_swing', oneWay: true, ropeLen: 258, swingAmp: 0.48, swingSpeed: 1.65, phase: 1.6 },
    { x: 13260, y: 525, w: 118, h: 20, type: 'morocco_magic_carpet', oneWay: true, baseX: 13280, baseY: 525, moveAmpX: 88, moveAmpY: 18, speed: 1.60, phase: 2.1 },

    // === ZONE 6: Imperial Bab Mansour Courtyard Plaza (13550 .. 14800) ===
    { x: 13550, y: groundY, w: 1250, h: groundH, type: 'kasbah_terrace' },
  ];

  // 18 Authentic Moroccan Souk & Kasbah Enemies (6 Monkeys, 6 Merchants, 6 White Storks)
  const morocco_monkeys = [
    { x: 960, y: groundY - 40, w: 42, h: 40, minX: 800, maxX: 1270, speed: 108, dir: 1, facing: 1 },
    { x: 2920, y: groundY - 40, w: 42, h: 40, minX: 2730, maxX: 3300, speed: 112, dir: -1, facing: -1 },
    { x: 5260, y: groundY - 40, w: 42, h: 40, minX: 5040, maxX: 5580, speed: 116, dir: 1, facing: 1 },
    { x: 8220, y: groundY - 40, w: 42, h: 40, minX: 7980, maxX: 8620, speed: 118, dir: -1, facing: -1 },
    { x: 10720, y: groundY - 40, w: 42, h: 40, minX: 10520, maxX: 11060, speed: 122, dir: 1, facing: 1 },
    { x: 13920, y: groundY - 40, w: 42, h: 40, minX: 13680, maxX: 14180, speed: 124, dir: -1, facing: -1 },
  ];

  // True-to-Life Adult Marrakech Tea & Spice Merchants (w: 50, h: 76!)
  const morocco_merchants = [
    { x: 1920, y: groundY - 76, w: 50, h: 76, minX: 1730, maxX: 2180, speed: 92, dir: -1, facing: -1 },
    { x: 4080, y: groundY - 76, w: 50, h: 76, minX: 3820, maxX: 4420, speed: 96, dir: 1, facing: 1 },
    { x: 6720, y: groundY - 76, w: 50, h: 76, minX: 6480, maxX: 7060, speed: 100, dir: -1, facing: -1 },
    { x: 9680, y: groundY - 76, w: 50, h: 76, minX: 9460, maxX: 9940, speed: 102, dir: 1, facing: 1 },
    { x: 12260, y: groundY - 76, w: 50, h: 76, minX: 12040, maxX: 12540, speed: 106, dir: -1, facing: -1 },
    { x: 14180, y: groundY - 76, w: 50, h: 76, minX: 13920, maxX: 14340, speed: 108, dir: 1, facing: 1 },
  ];

  // Graceful White Moroccan Kasbah Storks (smooth predictable sine flight, NO swoop-diving!)
  const morocco_storks = [
    { x: 1560, y: 280, baseY: 280, w: 48, h: 28, minX: 1260, maxX: 1900, vx: 118, facing: 1, phase: 0.3, bobAmp: 14 },
    { x: 3480, y: 260, baseY: 260, w: 48, h: 28, minX: 3180, maxX: 3860, vx: -122, facing: -1, phase: 1.4, bobAmp: 15 },
    { x: 6040, y: 245, baseY: 245, w: 48, h: 28, minX: 5640, maxX: 6420, vx: 126, facing: 1, phase: 2.1, bobAmp: 14 },
    { x: 7520, y: 255, baseY: 255, w: 48, h: 28, minX: 7160, maxX: 7940, vx: -128, facing: -1, phase: 0.8, bobAmp: 15 },
    { x: 9060, y: 248, baseY: 248, w: 48, h: 28, minX: 8680, maxX: 9460, vx: 130, facing: 1, phase: 1.9, bobAmp: 14 },
    { x: 12960, y: 245, baseY: 245, w: 48, h: 28, minX: 12540, maxX: 13440, vx: -132, facing: -1, phase: 2.7, bobAmp: 15 },
  ];

  // 5 Safe Kasbah Checkpoints (y = groundY - 32 = 583 -> FLUSH on terrace!)
  const checkpoints = [
    { x: 3700, y: groundY - 32, reached: false },
    { x: 6520, y: groundY - 32, reached: false },
    { x: 9480, y: groundY - 32, reached: false },
    { x: 12060, y: groundY - 32, reached: false },
    { x: 13630, y: groundY - 32, reached: false },
  ];

  const treats = [
    { x: 560, y: 356, collected: false },
    { x: 1150, y: 350, collected: false },
    { x: 3120, y: 346, collected: false },
    { x: 4325, y: 342, collected: false },
    { x: 5445, y: 340, collected: false },
    { x: 6040, y: 390, collected: false },
    { x: 8430, y: 338, collected: false },
    { x: 9075, y: 410, collected: false },
    { x: 10955, y: 336, collected: false },
    { x: 13120, y: 380, collected: false },
  ];

  return {
    id: 23,
    theme: 'marrakech',
    moroccoOutfit: true,
    name: 'أسواق مراكش وأسطح القصبة',
    nameEn: 'Marrakech Souk & Kasbah Rooftops',
    goalLabel: 'باب منصور • مراكش',
    goalLabelEn: 'BAB MANSOUR • MARRAKECH',
    width: 14800,
    height: 720,
    startX: 110,
    startY: groundY - 50,
    goal: { x: 14380, y: groundY - 120, w: 128, h: 120 },
    platforms,
    puddles: [],
    checkpoints,
    treats,
    coins: [],
    dogs: [],
    rats: [],
    falcons: [],
    morocco_monkeys,
    morocco_merchants,
    morocco_storks,
  };
};
