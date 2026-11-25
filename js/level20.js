window.Game = window.Game || {};

window.Game.createLevel20 = function () {
  // Stage 20: Alpine Steam Express (مرحلة القطارات البخارية — Monumental 280px-Tall Victorian Locomotives & Carriages!)
  // Carriage roof deck at y=440 (h=280px -> 440..720) for breathtaking true-to-life locomotive,
  // 64px-wide vestibule door, and 60px spoked wheel scale!

  const platforms = [
    // === MONUMENTAL 280px-TALL VICTORIAN STEAM LOCOMOTIVES & PULLMAN CARRIAGES (y: 440..720) ===
    { x: 0, y: 440, w: 1220, h: 280, type: 'steam_car_deck' },
    { x: 1460, y: 440, w: 1200, h: 280, type: 'steam_car_deck' },
    { x: 2920, y: 440, w: 1260, h: 280, type: 'steam_car_deck' },
    { x: 4460, y: 440, w: 1220, h: 280, type: 'steam_car_deck' },
    { x: 5980, y: 440, w: 1200, h: 280, type: 'steam_car_deck' },
    { x: 7460, y: 440, w: 1240, h: 280, type: 'steam_car_deck' },
    { x: 8980, y: 440, w: 1080, h: 280, type: 'steam_car_deck' },
    { x: 10280, y: 440, w: 920, h: 280, type: 'steam_car_deck' },

    // === ZONE 1 (0..1460): Departure Platform — Low Stone Overpass Bridge & Coal Conveyor ===
    { x: 440, y: 315, w: 165, h: 90, type: 'tunnel_clearance' },
    { x: 760, y: 355, w: 230, h: 24, type: 'coal_hopper_conveyor', oneWay: true, conveyorSpeed: 155 },
    // Coupling 1 (1220..1460): Weight-reactive tilting iron drawbridge
    { x: 1235, y: 400, w: 210, h: 20, type: 'coupling_drawbridge', oneWay: true },

    // === ZONE 2 (1460..2920): Boiler Car — Hydraulic Steam Piston Lift & Secret Treat 1 ===
    { x: 1710, y: 375, w: 96, h: 65, type: 'steam_piston_lift', restY: 375, liftHeight: 150, phase: 0.2 },
    { x: 1875, y: 195, w: 185, h: 24, type: 'brass_rail_roof', oneWay: true }, // Secret Treat 1!
    { x: 2130, y: 285, w: 150, h: 24, type: 'brass_rail_roof', oneWay: true },
    { x: 2370, y: 360, w: 54, h: 80, type: 'pressure_boiler_valve', blastDir: -1, blastLen: 155, phase: 0.4 },
    // Coupling 2 (2660..2920): Fast forward coal belt -> clean jump onto Carriage 3
    { x: 2635, y: 385, w: 210, h: 24, type: 'coal_hopper_conveyor', oneWay: true, conveyorSpeed: 175 },

    // === ZONE 3 (2920..4460): Signal Yard — Interactive Railway Switch & Truss Bridge ===
    { x: 3180, y: 315, w: 180, h: 90, type: 'tunnel_clearance' },
    { x: 3560, y: 384, w: 46, h: 56, type: 'track_switch_lever', switchId: 'bridge_3' },
    { x: 3680, y: 340, w: 165, h: 24, type: 'brass_rail_roof', oneWay: true },
    { x: 3930, y: 360, w: 54, h: 80, type: 'pressure_boiler_valve', blastDir: 1, blastLen: 150, phase: 1.5 },
    // Coupling 3 (4180..4460): Retractable Iron Truss Bridge activated by 'bridge_3'
    { x: 4185, y: 400, w: 270, h: 22, type: 'switch_rail_bridge', oneWay: true, switchId: 'bridge_3', extended: false },

    // === ZONE 4 (4460..5980): Coal Freighter — Opposing Belts & Twin Pistons ===
    { x: 4680, y: 360, w: 220, h: 24, type: 'coal_hopper_conveyor', oneWay: true, conveyorSpeed: -145 },
    { x: 4990, y: 375, w: 96, h: 65, type: 'steam_piston_lift', restY: 375, liftHeight: 145, phase: 1.1 },
    { x: 5155, y: 215, w: 175, h: 24, type: 'brass_rail_roof', oneWay: true },
    { x: 5400, y: 315, w: 165, h: 90, type: 'tunnel_clearance' },
    // Coupling 4 (5680..5980): Twin tilting coupling drawbridges
    { x: 5700, y: 395, w: 135, h: 20, type: 'coupling_drawbridge', oneWay: true },
    { x: 5845, y: 360, w: 130, h: 20, type: 'coupling_drawbridge', oneWay: true },

    // === ZONE 5 (5980..7460): Upper Pullman Switch & Secret Treat 2 ===
    { x: 6190, y: 375, w: 96, h: 65, type: 'steam_piston_lift', restY: 375, liftHeight: 150, phase: 0.6 },
    { x: 6355, y: 200, w: 155, h: 24, type: 'brass_rail_roof', oneWay: true },
    { x: 6410, y: 144, w: 46, h: 56, type: 'track_switch_lever', switchId: 'treat_2_bridge' },
    { x: 6535, y: 165, w: 225, h: 22, type: 'switch_rail_bridge', oneWay: true, switchId: 'treat_2_bridge', extended: false },
    { x: 6785, y: 145, w: 165, h: 24, type: 'brass_rail_roof', oneWay: true }, // Secret Treat 2!
    { x: 6680, y: 360, w: 54, h: 80, type: 'pressure_boiler_valve', blastDir: -1, blastLen: 155, phase: 2.0 },
    // Coupling 5 (7180..7460): Forward coal belt bridge
    { x: 7195, y: 385, w: 245, h: 24, type: 'coal_hopper_conveyor', oneWay: true, conveyorSpeed: 165 },

    // === ZONE 6 (7460..8980): Alpine Tunnel Gauntlet — Double Overpasses & Valves ===
    { x: 7690, y: 315, w: 175, h: 90, type: 'tunnel_clearance' },
    { x: 7970, y: 360, w: 54, h: 80, type: 'pressure_boiler_valve', blastDir: 1, blastLen: 150, phase: 0.3 },
    { x: 8220, y: 315, w: 175, h: 90, type: 'tunnel_clearance' },
    { x: 8480, y: 384, w: 46, h: 56, type: 'track_switch_lever', switchId: 'bridge_6' },
    // Coupling 6 (8700..8980): Switch-activated Truss Bridge
    { x: 8705, y: 398, w: 270, h: 22, type: 'switch_rail_bridge', oneWay: true, switchId: 'bridge_6', extended: false },

    // === ZONE 7 (8980..10280): Grand Locomotive Finale & Secret Treat 3 ===
    { x: 9170, y: 375, w: 96, h: 65, type: 'steam_piston_lift', restY: 375, liftHeight: 155, phase: 0.9 },
    { x: 9325, y: 200, w: 220, h: 24, type: 'coal_hopper_conveyor', oneWay: true, conveyorSpeed: 175 },
    { x: 9625, y: 125, w: 175, h: 24, type: 'brass_rail_roof', oneWay: true }, // Secret Treat 3!
    { x: 9510, y: 315, w: 165, h: 90, type: 'tunnel_clearance' },
    { x: 9810, y: 360, w: 54, h: 80, type: 'pressure_boiler_valve', blastDir: -1, blastLen: 150, phase: 1.2 },
    // Coupling 7 (10060..10280): Final tilting iron coupling drawbridge
    { x: 10070, y: 398, w: 200, h: 20, type: 'coupling_drawbridge', oneWay: true },

    // === ZONE 8 (10280..11200): Grand Central Steam Terminal Arrival ===
    { x: 10460, y: 315, w: 160, h: 90, type: 'tunnel_clearance' },
    { x: 10710, y: 355, w: 155, h: 24, type: 'brass_rail_roof', oneWay: true },
  ];

  const lamps = [];

  // 7 Fair Checkpoints placed flush on carriage roofs (y=408 -> bottom=440)
  const checkpoints = [
    { x: 1515, y: 408, reached: false },
    { x: 2985, y: 408, reached: false },
    { x: 4525, y: 408, reached: false },
    { x: 6045, y: 408, reached: false },
    { x: 7525, y: 408, reached: false },
    { x: 9045, y: 408, reached: false },
    { x: 10355, y: 408, reached: false },
  ];

  // 3 Secret Golden Fish Treats on high Pullman roofs
  const treats = [
    { x: 1965, y: 142, collected: false },
    { x: 6865, y: 92, collected: false },
    { x: 9712, y: 72, collected: false },
  ];

  // 9 Well-Spaced Authentic Railway Enemies (all grounded flush on y=440!)
  // Victorian Railway Lamp Inspectors scaled to lifelike human proportions (60x66)
  const rail_inspectors = [
    { x: 1020, y: 374, w: 60, h: 66, minX: 920, maxX: 1160, facing: -1, vx: 76, phase: 0.3 },
    { x: 5220, y: 374, w: 60, h: 66, minX: 5080, maxX: 5360, facing: -1, vx: 80, phase: 1.4 },
    { x: 10720, y: 374, w: 60, h: 66, minX: 10640, maxX: 10860, facing: -1, vx: 82, phase: 0.8 },
  ];

  const coal_sparks = [
    { startX: 2260, y: 421, r: 19, minX: 1860, maxX: 2300, speed: 148, dir: -1, respawnDelay: 1.7 },
    { startX: 7060, y: 421, r: 19, minX: 6780, maxX: 7100, speed: 155, dir: -1, respawnDelay: 1.6 },
    { startX: 8560, y: 421, r: 19, minX: 8400, maxX: 8620, speed: 158, dir: -1, respawnDelay: 1.6 },
  ];

  const mail_owls = [
    { x: 2050, y: 100, baseY: 100, w: 58, h: 34, minX: 1850, maxX: 2280, vx: -135, facing: -1, amp: 14, phase: 0.7 },
    { x: 6420, y: 95, baseY: 95, w: 58, h: 34, minX: 6200, maxX: 6680, vx: 140, facing: 1, amp: 14, phase: 1.9 },
    { x: 9600, y: 100, baseY: 100, w: 58, h: 34, minX: 9380, maxX: 9840, vx: -142, facing: -1, amp: 14, phase: 1.2 },
  ];

  return {
    stage: 20,
    title: 'المرحلة 20',
    width: 11200,
    height: 720,
    startX: 110,
    startY: 396,
    theme: 'steam_train',
    conductorOutfit: true,
    goal: { x: 10940, y: 310, w: 120, h: 130 },
    goalLabel: 'محطة القطار الكبرى 🚂',
    platforms,
    lamps,
    checkpoints,
    treats,
    dogs: [],
    crows: [],
    puddles: [],
    spiders: [],
    rail_inspectors,
    coal_sparks,
    mail_owls,
  };
};
