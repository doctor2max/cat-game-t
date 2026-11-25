/* ============================================================================
   LEVEL 26: BATTIR, PALESTINE (قرية بتّير • أرض الزيتون والكروم)
   UNESCO World Heritage Cultural Landscape — 100% Authentic Battir Mechanics:
     1. battir_terrace        — Dry-stone Jerusalem limestone terraces (السلاسل الحجرية / الجنّان) with Battiri eggplants & olive shoots!
     2. battir_water_sluice + battir_canal_raft — Ancient Roman Ma'dud 8-Family Irrigation Sluice Gate & buoyant Canal Raft!
     3. battir_spring_geyser  — Pressurized Ain al-Balad Roman aqueduct spring-water updraft!
     4. battir_olive_bough    — Elastic ancient olive tree bough that flexes & launches Mashmasha skyward!
     5. battir_vine_trellis   — Sun-warmed grapevine pergola (عريشة الدوالي) that creaks & drops after 0.9s!
     6. battir_railway_handcar — 1905 Ottoman Jaffa–Jerusalem Railway pumping handcar across the valley viaduct!
     7. battir_stone_roller   — Carved limestone Olive-Press Millstone (حجر المعصرة) rolling rhythmically with ground-rumble telegraph!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel26 = function createLevel26() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // ZONE 1 (0 .. 2520): Al-Jinan Terraces (الجنّان), Battiri Eggplants & Ma'dud Sluice #1
      // =====================================================================
      { x: 0, y: groundY, w: 1120, h: groundH, type: 'battir_terrace' },
      // Immediate Screen-1 Battir Showcase: Ancient Ma'dud Water-Balance Seesaw + Seven Widows Lantern Archway + Roman Bath Steam!
      { x: 340, y: 528, w: 174, h: 22, type: 'battir_madud_scale', oneWay: true },
      { x: 640, y: 468, w: 116, h: 22, type: 'battir_hosh_arch_swing', oneWay: true, ropeLen: 138, swingSpeed: 1.45, swingAmp: 0.54, phase: 0.3 },
      { x: 780, y: 356, w: 220, h: 24, type: 'battir_terrace', oneWay: true },
      { x: 915, y: groundY - 260, w: 84, h: 260, type: 'battir_roman_bath_vent', nonSolid: true, liftForce: 1420, phase: 0.2 },
      // Ancient Ma'dud Water Sluice #1 -> releases spring water & glides Canal Raft inside Stone Aqueduct (1120 .. 1560)!
      { x: 1020, y: groundY - 60, w: 48, h: 60, type: 'battir_water_sluice', nonSolid: true, canalId: 'bt_can_1', duration: 11.0 },
      { x: 1140, y: 584, w: 132, h: 24, type: 'battir_canal_raft', oneWay: true, canalId: 'bt_can_1', startX: 1140, endX: 1410, speed: 155, activeTimer: 0 },
      { x: 1560, y: groundY, w: 960, h: groundH, type: 'battir_terrace' },
      // Upper Stone Terrace reached via Grapevine Trellis
      { x: 1710, y: 540, w: 130, h: 22, type: 'battir_vine_trellis', oneWay: true },
      { x: 1890, y: 468, w: 174, h: 22, type: 'battir_madud_scale', oneWay: true },
      // Olive Press Millstone #1 rolling across lower stone courtyard (1900 .. 2240)
      { x: 2200, y: groundY - 52, w: 52, h: 52, type: 'battir_stone_roller', nonSolid: true, minX: 1920, maxX: 2230, speed: 125, dir: -1 },

      // =====================================================================
      // ZONE 2 (2520 .. 5140): 1905 Ottoman Railway Viaduct & Ain al-Balad Spring Updraft #1
      // =====================================================================
      // Historic Jaffa-Jerusalem Railway Handcar #1 across Wadi al-Makhrour Viaduct (2520 .. 3180)!
      { x: 2560, y: 576, w: 130, h: 24, type: 'battir_railway_handcar', oneWay: true, startX: 2560, endX: 3030, speed: 175 },
      { x: 3180, y: groundY, w: 1060, h: groundH, type: 'battir_terrace' },
      // Pressurized Ain al-Balad Spring Geyser #1 lifting to High Manatir Watchtower Terrace (y = 370)!
      { x: 3560, y: groundY - 270, w: 74, h: 270, type: 'battir_spring_geyser', nonSolid: true, liftHeight: 270, liftForce: 1320, phase: 0.25 },
      { x: 3710, y: 370, w: 235, h: 24, type: 'battir_terrace', oneWay: true },
      // Olive Press Millstone #2 patrolling below the watchtower
      { x: 4080, y: groundY - 52, w: 52, h: 52, type: 'battir_stone_roller', nonSolid: true, minX: 3790, maxX: 4140, speed: 135, dir: -1 },
      // Stepped Grapevine Trellises over Valley Gorge 2B (4240 .. 4660)
      { x: 4290, y: 565, w: 128, h: 22, type: 'battir_vine_trellis', oneWay: true },
      { x: 4480, y: 535, w: 128, h: 22, type: 'battir_vine_trellis', oneWay: true },
      { x: 4660, y: groundY, w: 480, h: groundH, type: 'battir_terrace' },

      // =====================================================================
      // ZONE 3 (5140 .. 7760): The Roman Pool (البركة الرومانية), Olive Boughs & Canal Raft #2
      // =====================================================================
      // Seven Widows Quarter (حوش السبع أرامل) Hanging Heritage Lantern Archway Pendulum across Courtyard Gap (5140 .. 5640)
      { x: 5330, y: 525, w: 116, h: 22, type: 'battir_hosh_arch_swing', oneWay: true, ropeLen: 145, swingSpeed: 1.45, swingAmp: 0.62, phase: 0.2 },
      { x: 5390, y: 405, w: 185, h: 24, type: 'battir_terrace', oneWay: true },
      { x: 5640, y: groundY, w: 1220, h: groundH, type: 'battir_terrace' },
      // Ancient Ma'dud Water-Balance Seesaw overlooking the Old Town & Eco-Museum
      { x: 6140, y: 505, w: 174, h: 22, type: 'battir_madud_scale', oneWay: true },
      // Olive Press Millstone #3 beneath the Pergola Balcony
      { x: 6410, y: groundY - 52, w: 52, h: 52, type: 'battir_stone_roller', nonSolid: true, minX: 6080, maxX: 6460, speed: 140, dir: -1 },
      // Ma'dud Water Sluice #2 -> Canal Raft #2 across Roman Aqueduct Basin (6860 .. 7360)
      { x: 6760, y: groundY - 60, w: 48, h: 60, type: 'battir_water_sluice', nonSolid: true, canalId: 'bt_can_2', duration: 11.5 },
      { x: 6885, y: 580, w: 132, h: 24, type: 'battir_canal_raft', oneWay: true, canalId: 'bt_can_2', startX: 6885, endX: 7205, speed: 165, activeTimer: 0 },
      { x: 7360, y: groundY, w: 400, h: groundH, type: 'battir_terrace' },

      // =====================================================================
      // ZONE 4 (7760 .. 10340): Ain Jama Springs (عين جامع) & Twin Terraced Valleys
      // =====================================================================
      { x: 7815, y: 582, w: 124, h: 22, type: 'battir_vine_trellis', oneWay: true },
      // Grounded Stone Spring Pier supporting Ain Jama Geyser #2 (never floating!)
      { x: 7950, y: groundY, w: 160, h: groundH, type: 'battir_terrace' },
      { x: 7988, y: groundY - 265, w: 84, h: 265, type: 'battir_roman_bath_vent', nonSolid: true, liftForce: 1420, phase: 0.7 },
      { x: 8140, y: 385, w: 215, h: 24, type: 'battir_terrace', oneWay: true },
      { x: 8405, y: 470, w: 130, h: 22, type: 'battir_vine_trellis', oneWay: true },
      { x: 8580, y: groundY, w: 1760, h: groundH, type: 'battir_terrace' },
      // Roman Bath Courtyard & High Balcony reached via Thermal Steam Vent #2 (Meow boosts steam!)
      { x: 9240, y: 505, w: 215, h: 24, type: 'battir_terrace', oneWay: true },
      { x: 9555, y: groundY - 265, w: 84, h: 265, type: 'battir_roman_bath_vent', nonSolid: true, liftForce: 1420, phase: 1.6 },
      { x: 9705, y: 375, w: 210, h: 24, type: 'battir_terrace', oneWay: true },
      // Olive Press Millstone #4 (well clear of Checkpoint #4 at 10180!)
      { x: 9920, y: groundY - 52, w: 52, h: 52, type: 'battir_stone_roller', nonSolid: true, minX: 9660, maxX: 9990, speed: 145, dir: -1 },

      // =====================================================================
      // ZONE 5 (10340 .. 12480): Grand Makhrour Viaduct Handcar #2 & Olive Bough Chain
      // =====================================================================
      // 1905 Railway Handcar #2 across Grand Makhrour Valley Bridge (10340 .. 11040)
      { x: 10380, y: 572, w: 130, h: 24, type: 'battir_railway_handcar', oneWay: true, startX: 10380, endX: 10890, speed: 185 },
      { x: 11040, y: groundY, w: 780, h: groundH, type: 'battir_terrace' },
      // Ma'dud Sluice #3 + Canal Raft + Vine Trellis crossing over Terraced Ravine 5B (11820 .. 12480)
      { x: 11720, y: groundY - 60, w: 48, h: 60, type: 'battir_water_sluice', nonSolid: true, canalId: 'bt_can_3', duration: 12.0 },
      { x: 11845, y: 578, w: 132, h: 24, type: 'battir_canal_raft', oneWay: true, canalId: 'bt_can_3', startX: 11845, endX: 12120, speed: 170, activeTimer: 0 },
      { x: 12260, y: 530, w: 116, h: 22, type: 'battir_hosh_arch_swing', oneWay: true, ropeLen: 140, swingSpeed: 1.5, swingAmp: 0.55, phase: 1.1 },

      // =====================================================================
      // ZONE 6 (12480 .. 15000): Old Stone Village (البلدة القديمة) & Ain al-Balad Heritage Archway!
      // =====================================================================
      { x: 12480, y: groundY, w: 2520, h: groundH, type: 'battir_terrace' },
      // Elastic Olive Bough #3 launching up to the Golden Olive Harvest Roof Terrace!
      { x: 13440, y: 545, w: 150, h: 24, type: 'battir_olive_bough', oneWay: true, bounceVy: -770 },
      { x: 13670, y: 390, w: 250, h: 24, type: 'battir_terrace', oneWay: true },
      // Old Village Vaulted Stone Balcony
      { x: 14030, y: 500, w: 174, h: 22, type: 'battir_madud_scale', oneWay: true },
      // Final Olive Press Millstone #5 before the Ain al-Balad Heritage Archway!
      { x: 14350, y: groundY - 52, w: 52, h: 52, type: 'battir_stone_roller', nonSolid: true, minX: 14080, maxX: 14410, speed: 145, dir: -1 },
    ];

    // 5 Safe Stone Village Checkpoints (y = 583, 100% hazard-free & enemy-free!)
    const checkpoints = [
      { x: 2380, y: 583, w: 44, h: 32, activated: false },
      { x: 4920, y: 583, w: 44, h: 32, activated: false },
      { x: 7580, y: 583, w: 44, h: 32, activated: false },
      { x: 10180, y: 583, w: 44, h: 32, activated: false },
      { x: 13080, y: 583, w: 44, h: 32, activated: false },
    ];

    // 10 Collectible Fish Treats across Battir's terraces, arbors & railway spans!
    const treats = [
      { x: 750, y: 332, collected: false },
      { x: 1995, y: 418, collected: false },
      { x: 2860, y: 510, collected: false },
      { x: 3825, y: 322, collected: false },
      { x: 5480, y: 368, collected: false },
      { x: 6235, y: 458, collected: false },
      { x: 8245, y: 338, collected: false },
      { x: 9810, y: 328, collected: false },
      { x: 10700, y: 505, collected: false },
      { x: 13795, y: 342, collected: false },
    ];

    // 6 Wild Crested Porcupines (النيص البري — flush at y=567, h=48 -> 615, walkDist-driven gait!)
    const battir_porcupines = [
      { x: 740, y: 567, w: 68, h: 48, minX: 590, maxX: 930, speed: 84, facing: 1, walkDist: 0, bristle: 0 },
      { x: 3360, y: 567, w: 68, h: 48, minX: 3230, maxX: 3500, speed: 88, facing: -1, walkDist: 0, bristle: 0 },
      { x: 5880, y: 567, w: 68, h: 48, minX: 5710, maxX: 6040, speed: 92, facing: 1, walkDist: 0, bristle: 0 },
      { x: 8780, y: 567, w: 68, h: 48, minX: 8630, maxX: 8960, speed: 95, facing: -1, walkDist: 0, bristle: 0 },
      { x: 11240, y: 567, w: 68, h: 48, minX: 11090, maxX: 11420, speed: 98, facing: 1, walkDist: 0, bristle: 0 },
      { x: 13680, y: 567, w: 68, h: 48, minX: 13580, maxX: 13880, speed: 100, facing: -1, walkDist: 0, bristle: 0 },
    ];

    // 6 Palestinian Rock Hyraxes (الوبر الصخري — flush at y=577, h=38 -> 615, quick stone-ledge scurries!)
    const battir_hyraxes = [
      { x: 1760, y: 577, w: 52, h: 38, minX: 1610, maxX: 1870, speed: 108, facing: -1, walkDist: 0 },
      { x: 3740, y: 577, w: 52, h: 38, minX: 3650, maxX: 3790, speed: 112, facing: 1, walkDist: 0 },
      { x: 6560, y: 577, w: 52, h: 38, minX: 6490, maxX: 6710, speed: 116, facing: -1, walkDist: 0 },
      { x: 9320, y: 577, w: 52, h: 38, minX: 9120, maxX: 9480, speed: 118, facing: 1, walkDist: 0 },
      { x: 12720, y: 577, w: 52, h: 38, minX: 12540, maxX: 12920, speed: 122, facing: -1, walkDist: 0 },
      { x: 14120, y: 577, w: 52, h: 38, minX: 13960, maxX: 14060, speed: 120, facing: 1, walkDist: 0 },
    ];

    // 6 Valley Kestrels (العوسق / الصقر الجبلي — graceful soaring glides over Wadi al-Makhrour!)
    const battir_kestrels = [
      { x: 1340, y: 245, w: 52, h: 32, minX: 1120, maxX: 1560, baseY: 245, ampY: 20, speed: 112, facing: 1, phase: 0.3 },
      { x: 2860, y: 235, w: 52, h: 32, minX: 2560, maxX: 3140, baseY: 235, ampY: 22, speed: 116, facing: -1, phase: 1.4 },
      { x: 5380, y: 225, w: 52, h: 32, minX: 5160, maxX: 5620, baseY: 225, ampY: 20, speed: 120, facing: 1, phase: 2.1 },
      { x: 7110, y: 240, w: 52, h: 32, minX: 6860, maxX: 7340, baseY: 240, ampY: 22, speed: 124, facing: -1, phase: 0.9 },
      { x: 10680, y: 230, w: 52, h: 32, minX: 10360, maxX: 11000, baseY: 230, ampY: 22, speed: 128, facing: 1, phase: 1.8 },
      { x: 12160, y: 235, w: 52, h: 32, minX: 11840, maxX: 12460, baseY: 235, ampY: 20, speed: 130, facing: -1, phase: 2.6 },
    ];

    return {
      id: 26,
      name: 'قرية بتّير • أرض الزيتون والكروم',
      nameEn: 'Battir • Land of Olives & Vines',
      subtitle: 'السلاسل الحجرية وعين البلد وسكة القطار',
      subtitleEn: 'UNESCO Terraces, Roman Pool & Old Railway',
      theme: 'battir',
      battirOutfit: true,
      width: 15000,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 14580, y: 495, w: 128, h: 120 },
      goalLabel: 'عين البلد • بتّير',
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
