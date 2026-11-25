window.Game = window.Game || {};

window.Game.createLevel22 = function () {
  // =========================================================================
  // STAGE 22: PARIS ROOFTOPS & EIFFEL TOWER (أسطح باريس وبرج إيفل — Grand Extended Edition)
  // 15,400px | 7 Escalating Zones | 6 Windmills | 3 Drawbridges | 22 Enemies | 5 Checkpoints
  // =========================================================================
  const groundY = 615;
  const groundH = 105;

  const platforms = [
    // === ZONE 1: Montmartre Terrace & Luxury Boutique Rooftops (0 .. 2050) ===
    { x: 0, y: groundY, w: 640, h: groundH, type: 'paris_zinc_roof' },
    { x: 300, y: 508, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 465, y: 400, w: 175, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 740, y: groundY, w: 540, h: groundH, type: 'paris_zinc_roof' },
    { x: 860, y: 508, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 1030, y: 390, w: 200, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 1280, y: 538, w: 240, h: 16, type: 'paris_laundry_line', oneWay: true },
    { x: 1520, y: groundY, w: 530, h: groundH, type: 'paris_zinc_roof' },
    { x: 1650, y: 506, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 1820, y: 390, w: 185, h: 24, type: 'paris_zinc_roof', oneWay: true },

    // === ZONE 2: First Montmartre Windmill & Warm Bakery Chimneys (2050 .. 4350) ===
    { x: 2290, y: 470, w: 260, h: 260, type: 'moulin_sail_wheel', radius: 130, rotSpeed: 0.84, phase: 0.2 },
    { x: 2530, y: 390, w: 260, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 2520, y: groundY, w: 680, h: groundH, type: 'paris_zinc_roof' },
    { x: 3255, y: 360, w: 92, h: 260, type: 'paris_chimney_updraft', phase: 0.0, liftForce: 1230 },
    { x: 3410, y: 425, w: 200, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 3420, y: groundY, w: 930, h: groundH, type: 'paris_zinc_roof' },
    { x: 3820, y: 504, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 3990, y: 382, w: 220, h: 24, type: 'paris_zinc_roof', oneWay: true },

    // === ZONE 3: First Drawbridge & Rue Saint-Honoré Couture Run (4350 .. 6750) ===
    { x: 4235, y: groundY - 56, w: 46, h: 56, type: 'paris_bridge_crank', bridgeId: 'pont_1', opened: false },
    { x: 4350, y: groundY - 8, w: 320, h: 22, type: 'paris_balcony_drawbridge', bridgeId: 'pont_1', oneWay: true, lowered: false },
    { x: 4670, y: groundY, w: 640, h: groundH, type: 'paris_zinc_roof' },
    { x: 4840, y: 506, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 5010, y: 382, w: 240, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 5310, y: 530, w: 230, h: 16, type: 'paris_laundry_line', oneWay: true },
    { x: 5610, y: 360, w: 92, h: 260, type: 'paris_chimney_updraft', phase: 1.4, liftForce: 1245 },
    { x: 5765, y: 420, w: 210, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 5765, y: groundY, w: 985, h: groundH, type: 'paris_zinc_roof' },
    { x: 6260, y: 465, w: 260, h: 260, type: 'moulin_sail_wheel', radius: 128, rotSpeed: -0.90, phase: 1.1 },
    { x: 6470, y: 346, w: 240, h: 24, type: 'paris_zinc_roof', oneWay: true },

    // === ZONE 4: Second Drawbridge & Counter-Rotating Twin Windmill Gauntlet (6750 .. 9400) ===
    { x: 6620, y: groundY - 56, w: 46, h: 56, type: 'paris_bridge_crank', bridgeId: 'pont_2', opened: false },
    { x: 6750, y: groundY - 8, w: 330, h: 22, type: 'paris_balcony_drawbridge', bridgeId: 'pont_2', oneWay: true, lowered: false },
    { x: 7080, y: groundY, w: 740, h: groundH, type: 'paris_zinc_roof' },
    { x: 7260, y: 504, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 7440, y: 382, w: 230, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 7820, y: 535, w: 230, h: 16, type: 'paris_laundry_line', oneWay: true },
    { x: 8115, y: 360, w: 92, h: 260, type: 'paris_chimney_updraft', phase: 2.2, liftForce: 1260 },
    { x: 8385, y: 465, w: 260, h: 260, type: 'moulin_sail_wheel', radius: 126, rotSpeed: 0.92, phase: 0.4 },
    { x: 8665, y: 455, w: 260, h: 260, type: 'moulin_sail_wheel', radius: 126, rotSpeed: -0.92, phase: 1.9 },
    { x: 8860, y: groundY, w: 540, h: groundH, type: 'paris_zinc_roof' },

    // === ZONE 5: Perfumerie Row & High-Altitude Thermal Crossing (9400 .. 11850) ===
    { x: 9400, y: 528, w: 230, h: 16, type: 'paris_laundry_line', oneWay: true },
    { x: 9630, y: groundY, w: 620, h: groundH, type: 'paris_zinc_roof' },
    { x: 9770, y: 504, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 9945, y: 380, w: 220, h: 24, type: 'paris_zinc_roof', oneWay: true },
    // Rhythmic twin chimney updrafts over the grand perfume boulevard!
    { x: 10315, y: 358, w: 92, h: 262, type: 'paris_chimney_updraft', phase: 0.5, liftForce: 1265 },
    { x: 10520, y: 455, w: 170, h: 24, type: 'paris_zinc_roof', oneWay: true },
    { x: 10755, y: 358, w: 92, h: 262, type: 'paris_chimney_updraft', phase: 2.4, liftForce: 1265 },
    { x: 10910, y: groundY, w: 940, h: groundH, type: 'paris_zinc_roof' },
    { x: 11260, y: 504, w: 120, h: 24, type: 'paris_awning_spring', oneWay: true, bouncy: true },
    { x: 11440, y: 376, w: 230, h: 24, type: 'paris_zinc_roof', oneWay: true },

    // === ZONE 6: Third Drawbridge & Grand Twin-Windmill Champs-Élysées Finale (11850 .. 14450) ===
    { x: 11720, y: groundY - 56, w: 46, h: 56, type: 'paris_bridge_crank', bridgeId: 'pont_3', opened: false },
    { x: 11850, y: groundY - 8, w: 340, h: 22, type: 'paris_balcony_drawbridge', bridgeId: 'pont_3', oneWay: true, lowered: false },
    { x: 12190, y: groundY, w: 580, h: groundH, type: 'paris_zinc_roof' },
    { x: 12770, y: 525, w: 230, h: 16, type: 'paris_laundry_line', oneWay: true },
    // High-speed counter-rotating windmill duo + final chimney launch into Arc de Triomphe Plaza!
    { x: 13170, y: 460, w: 260, h: 260, type: 'moulin_sail_wheel', radius: 128, rotSpeed: 0.98, phase: 0.1 },
    { x: 13460, y: 445, w: 260, h: 260, type: 'moulin_sail_wheel', radius: 128, rotSpeed: -0.98, phase: 1.6 },
    { x: 13720, y: 525, w: 220, h: 16, type: 'paris_laundry_line', oneWay: true },
    { x: 14015, y: 358, w: 92, h: 262, type: 'paris_chimney_updraft', phase: 1.1, liftForce: 1270 },

    // === ZONE 7: Place Charles de Gaulle & Arc de Triomphe Plaza (14170 .. 15400) ===
    { x: 14170, y: groundY, w: 1230, h: groundH, type: 'paris_zinc_roof' },
  ];

  // Challenging 22-Enemy Parisian Roster (8 Poodles, 7 Enlarged Chefs, 7 Pigeons)
  const paris_poodles = [
    { x: 940, y: groundY - 38, w: 46, h: 38, minX: 780, maxX: 1220, speed: 100, dir: 1, facing: 1 },
    { x: 2740, y: groundY - 38, w: 46, h: 38, minX: 2560, maxX: 3140, speed: 108, dir: -1, facing: -1 },
    { x: 3920, y: groundY - 38, w: 46, h: 38, minX: 3740, maxX: 4180, speed: 110, dir: 1, facing: 1 },
    { x: 4920, y: groundY - 38, w: 46, h: 38, minX: 4720, maxX: 5250, speed: 112, dir: 1, facing: 1 },
    { x: 7340, y: groundY - 38, w: 46, h: 38, minX: 7130, maxX: 7760, speed: 116, dir: -1, facing: -1 },
    { x: 9080, y: groundY - 38, w: 46, h: 38, minX: 8910, maxX: 9350, speed: 118, dir: 1, facing: 1 },
    { x: 11360, y: groundY - 38, w: 46, h: 38, minX: 11120, maxX: 11660, speed: 120, dir: -1, facing: -1 },
    { x: 14460, y: groundY - 38, w: 46, h: 38, minX: 14260, maxX: 14780, speed: 122, dir: 1, facing: 1 },
  ];

  const paris_bakers = [
    { x: 1750, y: groundY - 78, w: 52, h: 78, minX: 1560, maxX: 1990, speed: 94, dir: 1, facing: 1 },
    { x: 2950, y: groundY - 78, w: 52, h: 78, minX: 2620, maxX: 3140, speed: 98, dir: -1, facing: -1 },
    { x: 6040, y: groundY - 78, w: 52, h: 78, minX: 5810, maxX: 6520, speed: 100, dir: -1, facing: -1 },
    { x: 7540, y: groundY - 78, w: 52, h: 78, minX: 7140, maxX: 7750, speed: 104, dir: 1, facing: 1 },
    { x: 9880, y: groundY - 78, w: 52, h: 78, minX: 9680, maxX: 10180, speed: 106, dir: -1, facing: -1 },
    { x: 12440, y: groundY - 78, w: 52, h: 78, minX: 12230, maxX: 12710, speed: 108, dir: 1, facing: 1 },
    { x: 14680, y: groundY - 78, w: 52, h: 78, minX: 14420, maxX: 14880, speed: 110, dir: -1, facing: -1 },
  ];

  const paris_pigeons = [
    { x: 1410, y: 310, baseY: 310, w: 40, h: 26, minX: 1180, maxX: 1680, vx: 118, facing: 1, phase: 0.2, bobAmp: 14 },
    { x: 2450, y: 268, baseY: 268, w: 40, h: 26, minX: 2140, maxX: 2880, vx: 122, facing: 1, phase: 0.8, bobAmp: 14 },
    { x: 5520, y: 262, baseY: 262, w: 40, h: 26, minX: 5200, maxX: 5980, vx: -126, facing: -1, phase: 1.8, bobAmp: 15 },
    { x: 8480, y: 248, baseY: 248, w: 40, h: 26, minX: 8080, maxX: 8920, vx: 130, facing: 1, phase: 2.4, bobAmp: 14 },
    { x: 10540, y: 265, baseY: 265, w: 40, h: 26, minX: 10160, maxX: 10940, vx: -130, facing: -1, phase: 0.9, bobAmp: 15 },
    { x: 13320, y: 242, baseY: 242, w: 40, h: 26, minX: 12920, maxX: 13780, vx: 134, facing: 1, phase: 1.5, bobAmp: 15 },
    { x: 14120, y: 270, baseY: 270, w: 40, h: 26, minX: 13840, maxX: 14480, vx: -132, facing: -1, phase: 2.9, bobAmp: 14 },
  ];

  // 5 Safe Rooftop Checkpoints (y = groundY - 32 = 583 -> bottom = 615 FLUSH on roof!)
  const checkpoints = [
    { x: 3560, y: groundY - 32, reached: false },
    { x: 5880, y: groundY - 32, reached: false },
    { x: 8930, y: groundY - 32, reached: false },
    { x: 11020, y: groundY - 32, reached: false },
    { x: 14230, y: groundY - 32, reached: false },
  ];

  const treats = [
    { x: 550, y: 360, collected: false },
    { x: 1130, y: 350, collected: false },
    { x: 1905, y: 350, collected: false },
    { x: 2660, y: 350, collected: false },
    { x: 4090, y: 342, collected: false },
    { x: 5130, y: 342, collected: false },
    { x: 6580, y: 306, collected: false },
    { x: 7550, y: 342, collected: false },
    { x: 10055, y: 340, collected: false },
    { x: 10605, y: 412, collected: false },
    { x: 11555, y: 336, collected: false },
    { x: 13460, y: 295, collected: false },
  ];

  return {
    id: 22,
    theme: 'paris',
    parisOutfit: true,
    name: 'أسطح باريس وبرج إيفل',
    nameEn: 'Paris Rooftops & Eiffel Tower',
    goalLabel: 'قوس النصر • باريس',
    goalLabelEn: 'ARC DE TRIOMPHE • PARIS',
    width: 15400,
    height: 720,
    startX: 110,
    startY: groundY - 50,
    goal: { x: 14960, y: groundY - 120, w: 124, h: 120 },
    platforms,
    puddles: [],
    checkpoints,
    treats,
    coins: [],
    dogs: [],
    rats: [],
    falcons: [],
    paris_poodles,
    paris_bakers,
    paris_pigeons,
  };
};
