/* ============================================================================
   LEVEL 29: INTERNATIONAL AIRPORT (المطار الدولي • صالة المسافرين ومدرج الطائرات)
   CURATED 6-CHAPTER TWO-WORLD JOURNEY (20,400px):
     • PART 1 (0 .. 9,650): INSIDE THE GRAND AIRPORT TERMINAL BUILDING
       - Check-In Hall & Moving Luggage Conveyors (سيور الحقائب المتحركة)
       - VIP First-Class Flight Attendant Lounge (+1 💜 & +30 🪙)
       - Duty-Free Mezzanines, Bellhop Suitcase Bounce Carts & Security Scanners
       - Friendly VIP Ragdoll Travel Cat Companions & Autonomous Security Rovers
       - Airside Glass Exit Portal at x = 9,650!
     • PART 2 (9,650 .. 20,400): ACTIVE AIRCRAFT APRON & RUNWAY TARMAC
       - Open-Air Runway Apron, Baggage Tug Shuttles & Hydraulic Cargo Lifts
       - Jet-Blast Test Pods, Quadcopter Inspection Drones & Tarmac Marshallers
       - GRAND GOAL GATE (x = 19,860): Open Yellow Airport Baggage Cart Parked at
         the Belt-Loader Ramp Directly in Front of a Wide-Body Passenger Airliner
         with Its Lower-Deck Cargo Hold Wide Open!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel29 = function createLevel29() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // PART 1 — CHAPTER 1 (0 .. 3,250): قاعة تسجيل السفر، كشك الـ VIP وسيور الأمتعة
      // =====================================================================
      { x: 0, y: groundY, w: 1220, h: groundH, type: 'airport_terminal_floor' },
      // Friendly First-Class VIP Flight Attendant Counter (+1 💜 & +30 🪙)
      { x: 960, y: groundY - 88, w: 112, h: 88, type: 'airport_coffee_kiosk', nonSolid: true },

      // Crossing #1 (1220 .. 1760): Twin Moving Airport Baggage Conveyor Belts over Baggage Pit!
      { x: 1290, y: 562, w: 185, h: 22, type: 'airport_conveyor_belt', beltDir: 1, beltSpeed: 92 },
      { x: 1535, y: 534, w: 185, h: 22, type: 'airport_conveyor_belt', beltDir: 1, beltSpeed: 96 },

      { x: 1760, y: groundY, w: 1490, h: groundH, type: 'airport_terminal_floor' },
      // Bellhop Suitcase Bounce #1 -> Elevated Duty-Free Mezzanine Balcony (Treat #1!)
      { x: 2180, y: 580, w: 112, h: 26, type: 'airport_suitcase_bounce', oneWay: true, bounceVy: -775 },
      { x: 2345, y: 422, w: 250, h: 22, type: 'airport_mezzanine_deck', oneWay: true },
      // Security Laser Scanner #1 (cleanly clear of Checkpoint #1 at 3040!)
      { x: 2685, y: groundY - 126, w: 68, h: 126, type: 'airport_security_scanner', nonSolid: true, phase: 0.3 },

      // =====================================================================
      // PART 1 — CHAPTER 2 (3,250 .. 6,450): السوق الحرة، القطة المسافرة وشرفات الصالة
      // =====================================================================
      // Crossing #2 (3250 .. 3920): Baggage Shuttle #1 gliding across Sub-Terminal Sorting Bay
      { x: 3315, y: 560, w: 170, h: 24, type: 'airport_baggage_shuttle', oneWay: true, startX: 3315, endX: 3685, speed: 132, phase: 0.0 },

      { x: 3920, y: groundY, w: 2530, h: groundH, type: 'airport_terminal_floor' },
      // Friendly Ragdoll Travel Cat #1 (3965..4125) -> Speed Conveyor Boost + Mezzanine Run (Treat #2!)
      { x: 4540, y: 532, w: 210, h: 22, type: 'airport_conveyor_belt', beltDir: 1, beltSpeed: 105 },
      { x: 4815, y: 448, w: 245, h: 22, type: 'airport_mezzanine_deck', oneWay: true },
      // Security Scanner #2 + Bellhop Bounce #2 -> High Concourse Gallery (Treat #3!)
      { x: 5210, y: groundY - 126, w: 68, h: 126, type: 'airport_security_scanner', nonSolid: true, phase: 1.4 },
      { x: 5440, y: 580, w: 112, h: 26, type: 'airport_suitcase_bounce', oneWay: true, bounceVy: -775 },
      { x: 5610, y: 416, w: 240, h: 22, type: 'airport_mezzanine_deck', oneWay: true },

      // =====================================================================
      // PART 1 — CHAPTER 3 (6,450 .. 9,650): بوابات السفر ← الخروج إلى المدرج الخارجي!
      // =====================================================================
      // Crossing #3 (6450 .. 7080): Alternating Luggage Conveyors over Sorting Chute
      { x: 6525, y: 558, w: 190, h: 22, type: 'airport_conveyor_belt', beltDir: 1, beltSpeed: 98 },
      { x: 6805, y: 528, w: 195, h: 22, type: 'airport_conveyor_belt', beltDir: -1, beltSpeed: 78 },

      { x: 7080, y: groundY, w: 2570, h: groundH, type: 'airport_terminal_floor' },
      // Mezzanine Bypass above Customs K9 #2 + Security Scanner #3
      { x: 7580, y: 504, w: 215, h: 22, type: 'airport_mezzanine_deck', oneWay: true },
      { x: 8340, y: groundY - 126, w: 68, h: 126, type: 'airport_security_scanner', nonSolid: true, phase: 2.3 },
      // Checkpoint #3 at 9260 -> Monumental Glass Airside Exit Portal at x = 9585..9715!
      { x: 9585, y: groundY - 240, w: 130, h: 240, type: 'airport_exit_portal', nonSolid: true },

      // =====================================================================
      // PART 2 — CHAPTER 4 (9,650 .. 13,250): الخروج إلى مدرج الطائرات المفتوح!
      // =====================================================================
      { x: 9650, y: groundY, w: 1720, h: groundH, type: 'airport_tarmac_deck' },
      // Jet-Blast Pod #1 (with reachable elevated Jetway Maintenance Catwalk above it for Treat #4!)
      { x: 10390, y: 502, w: 240, h: 22, type: 'airport_jetway_deck', oneWay: true },
      { x: 10560, y: groundY - 62, w: 72, h: 62, type: 'airport_jet_blast', nonSolid: true, blastDir: -1, phase: 0.4 },

      // Crossing #4 (11370 .. 12120): Apron Baggage Tug Shuttle #2 across Tarmac Trench
      { x: 11440, y: 556, w: 178, h: 24, type: 'airport_baggage_shuttle', oneWay: true, startX: 11440, endX: 11880, speed: 138, phase: 0.7 },

      { x: 12120, y: groundY, w: 1130, h: groundH, type: 'airport_tarmac_deck' },
      // Hydraulic Cargo Scissor Lift #1 -> High Jetway Roof (Treat #5!) -> Clear of Checkpoint #4 (13020)
      { x: 12440, y: 556, w: 128, h: 22, type: 'airport_cargo_scissor_lift', oneWay: true, startX: 12440, endX: 12440, startY: 568, endY: 432, speed: 1.85, phase: 0.2 },
      { x: 12605, y: 428, w: 230, h: 22, type: 'airport_jetway_deck', oneWay: true },

      // =====================================================================
      // PART 2 — CHAPTER 5 (13,250 .. 16,850): ساحة الشحن الجوي، التوربينات وعربات القطر
      // =====================================================================
      // Crossing #5 (13250 .. 14040): Twin Baggage Tug Shuttles across Wide Apron Service Channel
      { x: 13315, y: 558, w: 168, h: 24, type: 'airport_baggage_shuttle', oneWay: true, startX: 13315, endX: 13580, speed: 134, phase: 0.0 },
      { x: 13665, y: 536, w: 168, h: 24, type: 'airport_baggage_shuttle', oneWay: true, startX: 13665, endX: 13815, speed: 128, phase: 1.5 },

      { x: 14040, y: groundY, w: 2810, h: groundH, type: 'airport_tarmac_deck' },
      // Friendly Ragdoll Travel Cat #2 on Apron (14100..14260) -> Suitcase Bounce #3 -> Jetway Deck (Treat #6!)
      { x: 14740, y: 580, w: 112, h: 26, type: 'airport_suitcase_bounce', oneWay: true, bounceVy: -780 },
      { x: 14905, y: 418, w: 245, h: 22, type: 'airport_jetway_deck', oneWay: true },
      // Jet-Blast Pod #2 + Reachable Overhead Catwalk -> Clear of Checkpoint #5 (16580)
      { x: 15640, y: 502, w: 235, h: 22, type: 'airport_jetway_deck', oneWay: true },
      { x: 15800, y: groundY - 62, w: 72, h: 62, type: 'airport_jet_blast', nonSolid: true, blastDir: -1, phase: 1.6 },

      // =====================================================================
      // PART 2 — CHAPTER 6 (16,850 .. 20,400): مدرج الطائرة الكبرى ← عربة الحقائب ومخزن الطائرة!
      // =====================================================================
      // Crossing #6 (16850 .. 17620): Baggage Shuttle #3 + Hydraulic Cargo Scissor Lift #2
      { x: 16920, y: 556, w: 176, h: 24, type: 'airport_baggage_shuttle', oneWay: true, startX: 16920, endX: 17370, speed: 140, phase: 0.9 },

      { x: 17620, y: groundY, w: 2780, h: groundH, type: 'airport_tarmac_deck' },
      // Checkpoint #6 at 17760 -> Hydraulic Scissor Lift #2 -> Final Jetway Overlook (Treat #7!)
      { x: 18380, y: 556, w: 128, h: 22, type: 'airport_cargo_scissor_lift', oneWay: true, startX: 18380, endX: 18380, startY: 568, endY: 428, speed: 1.9, phase: 1.1 },
      { x: 18545, y: 424, w: 245, h: 22, type: 'airport_jetway_deck', oneWay: true },
      // Friendly Ragdoll Travel Cat #3 bidding Mashmasha bon-voyage before the Baggage Cart & Open Airliner Cargo Hold!
    ];

    // Sub-terminal baggage pits & tarmac service drainage channels beneath crossings
    const puddles = [
      { x: 1220, y: 656, w: 540, h: 64 },
      { x: 3250, y: 656, w: 670, h: 64 },
      { x: 6450, y: 656, w: 630, h: 64 },
      { x: 11370, y: 656, w: 750, h: 64 },
      { x: 13250, y: 656, w: 790, h: 64 },
      { x: 16850, y: 656, w: 770, h: 64 },
    ];

    // 6 Self-Boarding Gate Kiosk Checkpoints in 100% safe sanctuary zones
    const checkpoints = [
      { x: 3040, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 6240, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 9260, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 13020, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 16580, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 17760, y: groundY - 32, w: 44, h: 32, activated: false },
    ];

    // 7 Golden Fish Treats placed cleanly along rewarding elevated mezzanine & jetway routes
    const treats = [
      { x: 2470, y: 374, collected: false },
      { x: 4938, y: 400, collected: false },
      { x: 5730, y: 368, collected: false },
      { x: 10510, y: 454, collected: false },
      { x: 12720, y: 380, collected: false },
      { x: 15028, y: 370, collected: false },
      { x: 18668, y: 376, collected: false },
    ];

    // 74 Curated Gold Coins guiding conveyors, luggage bounces, shuttles, scissor lifts & the final boarding run!
    const coinCoords = [
      // Ch.1: Check-In Hall, Twin Conveyors & Duty-Free Mezzanine
      [340, 575], [410, 575], [480, 575],
      [1350, 520], [1425, 505], [1595, 492], [1670, 492],
      [2236, 488], [2290, 434], [2410, 386], [2530, 386],
      [2840, 575], [2910, 575],
      // Ch.2: Shuttle #1, Conveyor Mezzanine & Suitcase Bounce #2
      [3460, 514], [3560, 514], [3660, 514],
      [4605, 492], [4685, 492], [4880, 412], [4995, 412],
      [5496, 485], [5555, 430], [5675, 380], [5785, 380],
      [6040, 575], [6110, 575],
      // Ch.3: Sorting Conveyors, Mezzanine & Airside Exit Portal Run!
      [6590, 516], [6665, 502], [6870, 486], [6945, 486],
      [7640, 468], [7735, 468],
      [8840, 575], [8920, 575], [9440, 575], [9520, 575],
      // Ch.4: Open Tarmac! Jetway Catwalk #1, Baggage Shuttle #2 & Scissor Lift #1
      [9840, 575], [9920, 575],
      [10455, 466], [10565, 466],
      [11590, 510], [11705, 510], [11820, 510],
      [12504, 490], [12504, 436], [12665, 392], [12775, 392],
      // Ch.5: Twin Shuttles, Suitcase Bounce #3 & Jet-Blast Catwalk #2
      [13420, 512], [13530, 512], [13720, 490], [13810, 490],
      [14796, 485], [14850, 432], [14970, 382], [15085, 382],
      [15705, 466], [15810, 466], [16340, 575], [16420, 575],
      // Ch.6: Shuttle #3, Scissor Lift #2 & Grand Approach to the Baggage Cart + Airliner!
      [17080, 510], [17195, 510], [17310, 510],
      [18444, 488], [18444, 434], [18610, 388], [18725, 388],
      [19420, 575], [19490, 575], [19720, 575], [19790, 575],
    ];
    const coins = coinCoords.map(([cx, cy], idx) => ({
      x: cx,
      y: cy,
      collected: false,
      phase: idx * 0.35,
    }));

    // 1. Autonomous Terminal Security Rovers (Indoor concourse patrol; Meow puts into cute heart-standby!)
    const airport_luggage_bots = [
      { x: 640, y: groundY - 46, w: 54, h: 46, minX: 540, maxX: 840, speed: 88, facing: 1, walkDist: 0 },
      { x: 4320, y: groundY - 46, w: 54, h: 46, minX: 4190, maxX: 4475, speed: 94, facing: -1, walkDist: 0 },
      { x: 8040, y: groundY - 46, w: 54, h: 46, minX: 7890, maxX: 8220, speed: 96, facing: 1, walkDist: 0 },
    ];

    // 2. Runaway Motorized Smart-Suitcases (Indoor & Tarmac zipping priority luggage!)
    const airport_runaway_carts = [
      { x: 1960, y: groundY - 42, w: 46, h: 42, minX: 1830, maxX: 2110, speed: 118, facing: -1, walkDist: 0 },
      { x: 5980, y: groundY - 42, w: 46, h: 42, minX: 5865, maxX: 6085, speed: 122, facing: 1, walkDist: 0 },
      { x: 15280, y: groundY - 42, w: 46, h: 42, minX: 15180, maxX: 15490, speed: 126, facing: -1, walkDist: 0 },
    ];

    // 3. Uniformed Airport Customs K9 Dogs in High-Vis Vest (Sneak shrinks sight; Meow distracts/repels!)
    const airport_customs_dogs = [
      { x: 7310, y: groundY - 44, w: 62, h: 44, minX: 7160, maxX: 7510, speed: 94, facing: -1, walkDist: 0, state: 'patrol' },
      { x: 8680, y: groundY - 44, w: 62, h: 44, minX: 8510, maxX: 8810, speed: 96, facing: 1, walkDist: 0, state: 'patrol' },
      { x: 18060, y: groundY - 44, w: 62, h: 44, minX: 17910, maxX: 18260, speed: 98, facing: -1, walkDist: 0, state: 'patrol' },
    ];

    // 4. Airfield Quadcopter Inspection Drones (Hovering over tarmac crossings & high lanes)
    const airport_tarmac_drones = [
      { x: 11680, y: 318, baseY: 318, w: 64, h: 36, minX: 11410, maxX: 12060, speed: 118, facing: 1, phase: 0.4 },
      { x: 13580, y: 312, baseY: 312, w: 64, h: 36, minX: 13290, maxX: 13980, speed: 122, facing: -1, phase: 1.5 },
      { x: 17160, y: 316, baseY: 316, w: 64, h: 36, minX: 16890, maxX: 17560, speed: 126, facing: 1, phase: 2.3 },
    ];

    // 5. Tarmac Ground-Crew Marshallers with Glowing Orange LED Wands (Outdoor tarmac patrol)
    const airport_ground_marshals = [
      { x: 10090, y: groundY - 66, w: 48, h: 66, minX: 9970, maxX: 10260, speed: 84, facing: -1, walkDist: 0 },
      { x: 16140, y: groundY - 66, w: 48, h: 66, minX: 16010, maxX: 16290, speed: 88, facing: 1, walkDist: 0 },
      { x: 19060, y: groundY - 66, w: 48, h: 66, minX: 18910, maxX: 19240, speed: 90, facing: -1, walkDist: 0 },
    ];

    // 6. Friendly VIP Ragdoll Travel Cat Companions (Greeting purr + sit-and-play together on Meow!)
    const airport_travel_cats = [
      { x: 4030, y: groundY - 40, w: 54, h: 40, minX: 3965, maxX: 4125, facing: -1 },
      { x: 14165, y: groundY - 40, w: 54, h: 40, minX: 14100, maxX: 14260, facing: -1 },
      { x: 19580, y: groundY - 40, w: 54, h: 40, minX: 19520, maxX: 19690, facing: -1 },
    ];

    return {
      id: 29,
      stage: 29,
      name: 'المطار الدولي • صالة السفر ومدرج الطائرات',
      nameEn: 'International Airport • Terminal & Tarmac',
      subtitle: 'سيور الحقائب، بوابات الليزر، ساحة الطائرات وعربة الحقائب إلى مخزن الطائرة',
      subtitleEn: 'Conveyor Belts, Security Scanners, Active Tarmac & Baggage Cart to Open Airliner Hold',
      theme: 'airport',
      width: 20400,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 19860, y: 525, w: 136, h: 90 },
      goalLabel: '🧳 عربة الحقائب ← إلى مخزن الطائرة ✈',
      goalLabelEn: '🧳 BAGGAGE CART → CARGO HOLD ✈',
      platforms,
      checkpoints,
      treats,
      puddles,
      coins,
      rats: [],
      falcons: [],
      dogs: [],
      airport_luggage_bots,
      airport_runaway_carts,
      airport_customs_dogs,
      airport_tarmac_drones,
      airport_ground_marshals,
      airport_travel_cats,
    };
  };
})();
