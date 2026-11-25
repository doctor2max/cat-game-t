/* ============================================================================
   LEVEL 26: BATTIR, BETHLEHEM & JERUSALEM (قرية بتّير • بيت لحم والقدس)
   UNESCO World Heritage "Land of Olives and Vines" — Rebuilt From Scratch:
     Ch.1 (0..2950):     حوش السبع أرامل والبلدة القديمة ومتحف بتّير البيئي
                         (Seven Widows Quarter, Qantara Wall-Jumps & Ma'dud Surge)
     Ch.2 (2950..5960):  نبع عين البلد والبركة الرومانية والحمام الروماني
                         (Ain al-Balad Grotto, 4m Roman Pool Water-Level Puzzle & Bath Steam)
     Ch.3 (5960..9280):  مدرجات الجنّان (السناسل الحجرية)، المناطير ومعصرة الزيتون الأثرية
                         (UNESCO Sanasel Terraces, Lever-Catapult Olive Press & Pulley Baskets)
     Ch.4 (9280..12300): وادي المخرور وسكة حديد القدس–يافا التاريخية ١٨٩٢ ومحطة بتّير
                         (1892 Ottoman Viaduct Handcars & Railway Semaphore Steam Shelters)
     Ch.5 (12300..15200):قلعة بتّير الأثرية (الخربة) ومقام أبو اليزيد ← قنطرة عين البلد الكبرى!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel26 = function createLevel26() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // CHAPTER 1 (0 .. 2950): حوش السبع أرامل والبلدة القديمة ومتحف بتّير البيئي
      // =====================================================================
      { x: 0, y: groundY, w: 680, h: groundH, type: 'battir_hosh_roof' },
      { x: 390, y: 518, w: 225, h: 26, type: 'battir_hosh_roof', oneWay: true },
      // Hanging Qantara Heritage Brass-Lantern Archway Swing across Old Town Alley (680 .. 1160)
      { x: 860, y: 515, w: 120, h: 22, type: 'battir_hosh_arch_swing', oneWay: true, ropeLen: 145, swingSpeed: 1.42, swingAmp: 0.56, phase: 0.2 },
      { x: 1160, y: groundY, w: 760, h: groundH, type: 'battir_hosh_roof' },
      // Climbable Old Town Qantara Stone Courtyard Shaft #1 (أزقة القناطر الحجرية)
      { x: 1470, y: 390, w: 34, h: 225, type: 'battir_alley_wall', climbable: true },
      { x: 1630, y: 390, w: 34, h: 225, type: 'battir_alley_wall', climbable: true },
      { x: 1315, y: 390, w: 165, h: 24, type: 'battir_hosh_roof', oneWay: true },
      { x: 1650, y: 390, w: 220, h: 24, type: 'battir_hosh_roof', oneWay: true },
      // Sun-Warmed Grapevine Pergola (عريشة الدوالي) stepping across courtyard gap (1920 .. 2220)
      { x: 2000, y: 545, w: 140, h: 22, type: 'battir_vine_trellis', oneWay: true },
      { x: 2220, y: groundY, w: 730, h: groundH, type: 'battir_terrace' },
      // Innovative Challenge #1A: Ma'dud Irrigation Canal Surge + Battiri Eggplant Sprint Boost!
      { x: 2280, y: groundY - 48, w: 250, h: 48, type: 'battir_aqueduct_surge', nonSolid: true, waveDir: 1, phase: 0.3 },

      // =====================================================================
      // CHAPTER 2 (2950 .. 5960): نبع عين البلد والبركة الرومانية والحمام الروماني
      // =====================================================================
      { x: 2950, y: groundY, w: 490, h: groundH, type: 'battir_terrace' },
      // Dynamic 4m Roman Pool Water-Level Puzzle #1 (نظام المعدود المائي العادل)
      { x: 3330, y: groundY - 64, w: 50, h: 64, type: 'battir_madud_gate', nonSolid: true, poolId: 'pool_1' },
      { x: 3500, y: 590, w: 170, h: 24, type: 'battir_pool_bridge', oneWay: true, poolId: 'pool_1', lowY: 592, highY: 465, waterLevel: 0 },
      { x: 3775, y: 590, w: 170, h: 24, type: 'battir_pool_bridge', oneWay: true, poolId: 'pool_1', lowY: 592, highY: 420, waterLevel: 0 },
      { x: 4050, y: 590, w: 170, h: 24, type: 'battir_pool_bridge', oneWay: true, poolId: 'pool_1', lowY: 592, highY: 470, waterLevel: 0 },
      // Elevated Roman Aqueduct Archway reward terrace reachable when Pool Water is raised!
      { x: 3745, y: 312, w: 230, h: 24, type: 'battir_terrace', oneWay: true },
      { x: 4320, y: groundY, w: 1640, h: groundH, type: 'battir_terrace' },
      // Ancient Roman Bathhouse Thermal Steam Chamber #1 (Meow near valve triggers super-steam lift!)
      { x: 4720, y: groundY - 260, w: 88, h: 260, type: 'battir_roman_bath_vent', nonSolid: true, liftForce: 1500, phase: 0.4 },
      { x: 4865, y: 378, w: 235, h: 24, type: 'battir_hosh_roof', oneWay: true },
      // Pressurized Ain al-Balad Spring Geyser Jet lifting to upper orchard pergola!
      { x: 5165, y: groundY - 245, w: 76, h: 245, type: 'battir_spring_geyser', nonSolid: true, liftForce: 1480, phase: 1.5 },
      { x: 5285, y: 392, w: 215, h: 24, type: 'battir_terrace', oneWay: true },
      // Ma'dud Irrigation Canal Surge + Battiri Eggplant Boost #2
      { x: 5340, y: groundY - 48, w: 255, h: 48, type: 'battir_aqueduct_surge', nonSolid: true, waveDir: -1, phase: 1.6 },

      // =====================================================================
      // CHAPTER 3 (5960 .. 9280): مدرجات الجنّان (السناسل)، المناطير ومعصرة الزيتون الأثرية
      // =====================================================================
      // Elastic Ancient Rumi Olive Tree Bough #1 launching across Terraced Orchard Gap (5960 .. 6360)
      { x: 6010, y: 565, w: 150, h: 24, type: 'battir_olive_bough', oneWay: true, bounceVy: -775 },
      { x: 6180, y: 415, w: 180, h: 24, type: 'battir_terrace', oneWay: true },
      { x: 6360, y: groundY, w: 1100, h: groundH, type: 'battir_terrace' },
      // Innovative Challenge #2A: Ancient Lever-and-Screw Olive Press (dodge slamming stone OR catapult off oak beam!)
      { x: 6680, y: groundY - 122, w: 162, h: 122, type: 'battir_olive_press', nonSolid: true, phase: 0.2 },
      // Secret Mintar Watchtower Roof reachable via the Olive-Press Lever Catapult!
      { x: 6590, y: 382, w: 220, h: 24, type: 'battir_terrace', oneWay: true },
      // Rolling Chiseled Limestone Olive Millstone patrolling upper orchard terrace
      { x: 7020, y: groundY - 52, w: 52, h: 52, type: 'battir_stone_roller', nonSolid: true, minX: 6920, maxX: 7220, speed: 128, dir: -1 },
      // Olive-Press Counterweight Pulley Pad + Woven Olive Basket Bridge #1 across (7460 .. 8000)
      { x: 7310, y: groundY - 20, w: 94, h: 20, type: 'battir_press_pad', oneWay: true, pressId: 'press_1', duration: 9.5 },
      { x: 7535, y: 595, w: 160, h: 24, type: 'battir_olive_basket', oneWay: true, pressId: 'press_1', lowY: 595, highY: 468, hoistAnim: 0 },
      { x: 7775, y: 505, w: 150, h: 22, type: 'battir_vine_trellis', oneWay: true },
      { x: 8000, y: groundY, w: 1280, h: groundH, type: 'battir_terrace' },
      // Ancient Lever-and-Screw Olive Press #2 + Elevated UNESCO Sanasel Terrace!
      { x: 8560, y: groundY - 122, w: 162, h: 122, type: 'battir_olive_press', nonSolid: true, phase: 1.9 },
      { x: 8480, y: 378, w: 235, h: 24, type: 'battir_terrace', oneWay: true },

      // =====================================================================
      // CHAPTER 4 (9280 .. 12300): وادي المخرور وسكة حديد القدس–يافا ١٨٩٢ ومحطة بتّير
      // =====================================================================
      // Ride-Triggered 1892 Ottoman Pumping Railway Handcar #1 across Wadi al-Makhrour Viaduct (9280 .. 9840)!
      { x: 9320, y: 585, w: 116, h: 20, type: 'battir_railway_handcar', oneWay: true, startX: 9320, endX: 9690, speed: 158 },
      { x: 9840, y: groundY, w: 720, h: groundH, type: 'battir_terrace' },
      // Innovative Challenge #3A: 1892 Ottoman Railway Semaphore & Sanasel Shelter Steam Jet (crouch or Meow!)
      { x: 10090, y: groundY - 130, w: 215, h: 130, type: 'battir_railway_semaphore', nonSolid: true, steamDir: -1, phase: 0.5 },
      // Dynamic Roman Pool Water-Level Puzzle #2 (10560 .. 11220)
      { x: 10455, y: groundY - 64, w: 50, h: 64, type: 'battir_madud_gate', nonSolid: true, poolId: 'pool_2' },
      { x: 10630, y: 590, w: 175, h: 24, type: 'battir_pool_bridge', oneWay: true, poolId: 'pool_2', lowY: 592, highY: 455, waterLevel: 0 },
      { x: 10925, y: 590, w: 175, h: 24, type: 'battir_pool_bridge', oneWay: true, poolId: 'pool_2', lowY: 592, highY: 430, waterLevel: 0 },
      { x: 10860, y: 320, w: 210, h: 24, type: 'battir_hosh_roof', oneWay: true },
      // Historic Battir Stone Station Island + Ottoman Pumping Railway Handcar #2 (11340 .. 11780)
      { x: 11220, y: groundY, w: 120, h: groundH, type: 'battir_hosh_roof' },
      { x: 11375, y: 585, w: 116, h: 20, type: 'battir_railway_handcar', oneWay: true, startX: 11375, endX: 11635, speed: 162 },
      { x: 11780, y: groundY, w: 520, h: groundH, type: 'battir_terrace' },
      // Ottoman Railway Semaphore #2 before Station Sanctuary Checkpoint
      { x: 11810, y: groundY - 130, w: 185, h: 130, type: 'battir_railway_semaphore', nonSolid: true, steamDir: -1, phase: 2.1 },

      // =====================================================================
      // CHAPTER 5 (12300 .. 15200): قلعة بتّير الأثرية (الخربة) ومقام أبو اليزيد ← قنطرة عين البلد
      // =====================================================================
      { x: 12300, y: groundY, w: 2900, h: groundH, type: 'battir_fortress_wall' },
      // Al-Khirbeh Citadel Climbable Stone Bastion Shaft #2
      { x: 12740, y: 385, w: 36, h: 230, type: 'battir_alley_wall', climbable: true },
      { x: 12905, y: 385, w: 36, h: 230, type: 'battir_alley_wall', climbable: true },
      { x: 12925, y: 385, w: 235, h: 24, type: 'battir_fortress_wall', oneWay: true },
      // Ancient Olive Press #3 inside the Citadel Courtyard
      { x: 13310, y: groundY - 122, w: 162, h: 122, type: 'battir_olive_press', nonSolid: true, phase: 1.1 },
      { x: 13250, y: 376, w: 225, h: 24, type: 'battir_fortress_wall', oneWay: true },
      // Ma'dud Irrigation Canal Surge + Battiri Eggplant Sprint Boost #3 toward Sanctuary
      { x: 13720, y: groundY - 48, w: 255, h: 48, type: 'battir_aqueduct_surge', nonSolid: true, waveDir: -1, phase: 0.8 },
      // Final Elastic Ancient Rumi Olive Bough #2 & Shrine Balcony before Grand Ain al-Balad Nymphaeum!
      { x: 14300, y: 548, w: 150, h: 24, type: 'battir_olive_bough', oneWay: true, bounceVy: -775 },
      { x: 14485, y: 405, w: 215, h: 24, type: 'battir_hosh_roof', oneWay: true },
    ];

    // 5 Bespoke Battir Dry-Stone Mintar Checkpoints in safe, hazard-free village sanctuaries
    const checkpoints = [
      { x: 2740, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 5760, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 8980, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 12130, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 14120, y: groundY - 32, w: 44, h: 32, activated: false },
    ];

    // 10 Collectible Fish Treats rewarding vertical rooftop, Roman Pool, Olive-Press Catapult & Citadel mastery
    const treats = [
      { x: 500, y: 470, collected: false },
      { x: 1755, y: 342, collected: false },
      { x: 3860, y: 264, collected: false },
      { x: 4980, y: 330, collected: false },
      { x: 6700, y: 334, collected: false },
      { x: 7615, y: 418, collected: false },
      { x: 8595, y: 330, collected: false },
      { x: 10965, y: 272, collected: false },
      { x: 13040, y: 338, collected: false },
      { x: 14590, y: 356, collected: false },
    ];

    // Native Battir & Judean Highland Wildlife — 100% flush on terrain (y + h === 615)
    // 1. Beloved Indian Crested Porcupines (النيص / القنفذ البري — banded flaring quills!)
    const battir_porcupines = [
      { x: 1260, y: groundY - 48, w: 68, h: 48, minX: 1200, maxX: 1410, speed: 74, facing: 1, walkDist: 0, bristle: 0 },
      { x: 4480, y: groundY - 48, w: 68, h: 48, minX: 4370, maxX: 4660, speed: 78, facing: -1, walkDist: 0, bristle: 0 },
      { x: 6480, y: groundY - 48, w: 68, h: 48, minX: 6390, maxX: 6620, speed: 76, facing: 1, walkDist: 0, bristle: 0 },
      { x: 8160, y: groundY - 48, w: 68, h: 48, minX: 8050, maxX: 8460, speed: 80, facing: -1, walkDist: 0, bristle: 0 },
      { x: 9920, y: groundY - 48, w: 68, h: 48, minX: 9860, maxX: 10040, speed: 78, facing: 1, walkDist: 0, bristle: 0 },
      { x: 12460, y: groundY - 48, w: 68, h: 48, minX: 12360, maxX: 12680, speed: 82, facing: 1, walkDist: 0, bristle: 0 },
    ];

    // 2. Palestinian Cliff Rock Hyraxes (الوبر الصخري الجبلي — nimble dry-stone Sanasel mammals!)
    const battir_hyraxes = [
      { x: 3060, y: groundY - 38, w: 54, h: 38, minX: 2990, maxX: 3260, speed: 94, facing: 1, walkDist: 0 },
      { x: 4980, y: groundY - 38, w: 54, h: 38, minX: 4860, maxX: 5110, speed: 96, facing: -1, walkDist: 0 },
      { x: 8780, y: groundY - 38, w: 54, h: 38, minX: 8740, maxX: 8900, speed: 96, facing: 1, walkDist: 0 },
      { x: 10340, y: groundY - 38, w: 54, h: 38, minX: 10315, maxX: 10425, speed: 92, facing: -1, walkDist: 0 },
      { x: 13020, y: groundY - 38, w: 54, h: 38, minX: 12965, maxX: 13240, speed: 100, facing: 1, walkDist: 0 },
      { x: 13540, y: groundY - 38, w: 54, h: 38, minX: 13490, maxX: 13680, speed: 102, facing: -1, walkDist: 0 },
    ];

    // 3. Lesser Kestrels / Palestine Falcons (صقر العوسق الفلسطيني — soaring over Wadi al-Makhrour)
    const battir_kestrels = [
      { x: 940, y: 310, baseY: 310, w: 56, h: 34, minX: 730, maxX: 1160, speed: 115, facing: 1, ampY: 22, phase: 0.2 },
      { x: 3860, y: 238, baseY: 238, w: 56, h: 34, minX: 3560, maxX: 4220, speed: 120, facing: -1, ampY: 22, phase: 1.1 },
      { x: 7640, y: 310, baseY: 310, w: 56, h: 34, minX: 7420, maxX: 7960, speed: 118, facing: 1, ampY: 22, phase: 2.0 },
      { x: 9560, y: 325, baseY: 325, w: 56, h: 34, minX: 9320, maxX: 9820, speed: 122, facing: -1, ampY: 24, phase: 2.8 },
      { x: 11480, y: 320, baseY: 320, w: 56, h: 34, minX: 11280, maxX: 11740, speed: 122, facing: 1, ampY: 22, phase: 3.6 },
      { x: 14380, y: 265, baseY: 265, w: 56, h: 34, minX: 14220, maxX: 14680, speed: 124, facing: -1, ampY: 22, phase: 4.5 },
    ];

    return {
      id: 26,
      stage: 26,
      name: 'قرية بتّير • بيت لحم والقدس',
      nameEn: 'Battir • Bethlehem & Jerusalem',
      subtitle: 'مدرجات اليونسكو، البركة الرومانية، سكة ١٨٩٢ وقلعة بتّير الأثرية',
      subtitleEn: 'UNESCO Terraces, Roman Pool, 1892 Railway & Ancient Battir Citadel',
      theme: 'battir',
      battirOutfit: true,
      width: 15200,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 14740, y: 495, w: 128, h: 120 },
      goalLabel: 'قنطرة عين البلد • بتّير',
      goalLabelEn: 'AIN AL-BALAD • BATTIR',
      platforms,
      checkpoints,
      treats,
      puddles: [],
      coins: [],
      rats: [],
      falcons: [],
      dogs: [],
      battir_porcupines,
      battir_hyraxes,
      battir_kestrels,
    };
  };
})();
