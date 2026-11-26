/* ============================================================================
   LEVEL 26: BATTIR, BETHLEHEM & JERUSALEM (قرية بتّير • جوهرة الجبل الغربي)
   COMPLETELY REDESIGNED FROM SCRATCH — Sunset Limestone Gorge, Stacked Hill-Town
   Qantara Arcades, Rotating Wooden Waterwheels (نواعير عين البلد), Overhead Vineyard
   Harvest Ziplines (سلال قطاف العنب), Clay Taboon Bread Ovens (أفران الطابون),
   Prickly-Pear Sabr Hedges (الصبر الفلسطيني), Roman Aqueduct Cascades (قناطر المعدود),
   Live 1892 Ottoman Train Crossings (معبر قطار القدس–يافا), and Brand-New Wildlife:
     • Beloved Crested Porcupine (النيص البري — preserved intact!)
     • Wild Wadi Boar (الخنزير البري الجبلي)
     • Crowned Palestinian Hoopoe (طائر الهدهد الفلسطيني المتوّج)
     • Golden Cliff Scorpion (عقرب الصخور الجبلي)
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel26 = function createLevel26() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // CHAPTER 1 (0 .. 3050): عقود وحارات السبع أرامل المتراكبة وأفران الطابون
      // =====================================================================
      { x: 0, y: groundY, w: 760, h: groundH, type: 'battir_qantara_arcade' },
      { x: 350, y: 505, w: 220, h: 24, type: 'battir_qantara_arcade', oneWay: true },
      // Traditional Clay Taboon Bread Oven #1 in the courtyard
      { x: 635, y: groundY - 90, w: 94, h: 90, type: 'battir_taboon_oven', nonSolid: true, phase: 0.3 },

      // Giant Rotating Ain al-Balad Wooden Waterwheel #1 spanning Old Town Gorge (760 .. 1120)!
      { x: 940, y: 530, w: 16, h: 16, type: 'battir_noria_wheel', radius: 108, rotSpeed: 0.78, phase: 0.2 },
      { x: 1120, y: groundY, w: 1040, h: groundH, type: 'battir_qantara_arcade' },
      { x: 1140, y: 398, w: 230, h: 24, type: 'battir_qantara_arcade', oneWay: true },

      // Climbable Stacked Qantara Stone Courtyard Shaft #1
      { x: 1530, y: 385, w: 36, h: 230, type: 'battir_alley_wall', climbable: true },
      { x: 1690, y: 385, w: 36, h: 230, type: 'battir_alley_wall', climbable: true },
      { x: 1710, y: 385, w: 225, h: 24, type: 'battir_qantara_arcade', oneWay: true },

      // Thorny Palestinian Prickly-Pear Sabr Hedge #1 (Meow to harvest sweet golden Sabr boost!)
      { x: 1965, y: groundY - 46, w: 86, h: 46, type: 'battir_sabr_hedge', nonSolid: true },

      // Elastic Broad-Leafed Palestinian Fig Tree Canopy #1 across Ravine (2160 .. 2440)!
      { x: 2225, y: 560, w: 148, h: 26, type: 'battir_fig_canopy', oneWay: true, bounceVy: -785 },
      { x: 2440, y: groundY, w: 610, h: groundH, type: 'battir_cliff_terrace' },

      // =====================================================================
      // CHAPTER 2 (3050 .. 6100): شلالات عين البلد، قنطرة المعدود وناعورة السقي
      // =====================================================================
      { x: 3050, y: groundY, w: 870, h: groundH, type: 'battir_cliff_terrace' },
      // Overhead Arched Roman Aqueduct Cascade #1 (sprint between cascades or Meow to shut!)
      { x: 3405, y: 512, w: 112, h: 22, type: 'battir_cliff_terrace', oneWay: true },
      { x: 3560, y: groundY - 165, w: 190, h: 165, type: 'battir_flash_sluice', nonSolid: true, phase: 0.5 },
      { x: 3510, y: 412, w: 225, h: 24, type: 'battir_cliff_terrace', oneWay: true },

      // Counterbalanced Stone Well-Sweep + Giant Rotating Waterwheel #2 across Spring Gorge (3920 .. 4540)!
      { x: 3975, y: 585, w: 145, h: 20, type: 'battir_shadoof_beam', oneWay: true, liftHeight: 118 },
      { x: 4335, y: 520, w: 16, h: 16, type: 'battir_noria_wheel', radius: 110, rotSpeed: -0.80, phase: 1.1 },
      // High Roman Aqueduct Crown Terrace above Waterwheel #2!
      { x: 4220, y: 308, w: 235, h: 24, type: 'battir_qantara_arcade', oneWay: true },

      { x: 4540, y: groundY, w: 1560, h: groundH, type: 'battir_cliff_terrace' },
      // Clay Taboon Bread Oven #2 + Fig Tree Canopy #2 lifting to Pomegranate Terrace
      { x: 5030, y: groundY - 90, w: 94, h: 90, type: 'battir_taboon_oven', nonSolid: true, phase: 1.8 },
      { x: 5250, y: 545, w: 148, h: 26, type: 'battir_fig_canopy', oneWay: true, bounceVy: -785 },
      { x: 5435, y: 388, w: 240, h: 24, type: 'battir_cliff_terrace', oneWay: true },

      // =====================================================================
      // CHAPTER 3 (6100 .. 9300): مدرجات الجرف الأحمر، الصبر وسلال قطاف العنب المعلّقة
      // =====================================================================
      // Overhead Vineyard Harvest Basket Zipline #1 gliding diagonally across Gorge (6100 .. 6780)!
      { x: 6120, y: 576, w: 136, h: 22, type: 'battir_grape_zipline', oneWay: true, startX: 6120, startY: 576, endX: 6610, endY: 496, zipSpeed: 0.30 },
      { x: 6780, y: groundY, w: 1480, h: groundH, type: 'battir_cliff_terrace' },
      // Sabr Prickly-Pear Hedge #2 + Overhead Roman Aqueduct Cascade #2
      { x: 7260, y: groundY - 46, w: 86, h: 46, type: 'battir_sabr_hedge', nonSolid: true },
      { x: 7510, y: groundY - 165, w: 190, h: 165, type: 'battir_flash_sluice', nonSolid: true, phase: 2.1 },
      // Fig Canopy #3 launching to Conical Mintar Watchtower Ledge!
      { x: 8065, y: 548, w: 148, h: 26, type: 'battir_fig_canopy', oneWay: true, bounceVy: -785 },
      { x: 7940, y: 375, w: 235, h: 24, type: 'battir_cliff_terrace', oneWay: true },

      // Rotating Wooden Waterwheel #3 across Orchard Ravine (8260 .. 8640)
      { x: 8450, y: 528, w: 16, h: 16, type: 'battir_noria_wheel', radius: 108, rotSpeed: 0.82, phase: 2.4 },
      { x: 8640, y: groundY, w: 660, h: groundH, type: 'battir_cliff_terrace' },

      // =====================================================================
      // CHAPTER 4 (9300 .. 12350): معبر قطار بتّير ١٨٩٢ السريع وجسر وادي المخرور الشاهق
      // =====================================================================
      { x: 9300, y: groundY, w: 1160, h: groundH, type: 'battir_qantara_arcade' },
      // Wooden Mountain Beehives & Circling Swarm #1 + Brass Beekeeper Smoker + Overhead Stone Footbridge!
      { x: 9540, y: groundY - 115, w: 320, h: 115, type: 'battir_beehive_swarm', nonSolid: true, phase: 0.4 },
      { x: 9435, y: 505, w: 130, h: 22, type: 'battir_qantara_arcade', oneWay: true },
      { x: 9590, y: 425, w: 230, h: 22, type: 'battir_qantara_arcade', oneWay: true },
      { x: 9855, y: 505, w: 130, h: 22, type: 'battir_qantara_arcade', oneWay: true },

      // Overhead Vineyard Harvest Basket Zipline #2 soaring over Wadi al-Makhrour Gorge (10460 .. 11180)!
      { x: 10480, y: 574, w: 136, h: 22, type: 'battir_grape_zipline', oneWay: true, startX: 10480, startY: 574, endX: 11015, endY: 498, zipSpeed: 0.30 },
      { x: 11180, y: groundY, w: 1170, h: groundH, type: 'battir_cliff_terrace' },
      { x: 11310, y: groundY - 90, w: 94, h: 90, type: 'battir_taboon_oven', nonSolid: true, phase: 0.9 },
      { x: 11850, y: groundY - 46, w: 86, h: 46, type: 'battir_sabr_hedge', nonSolid: true },

      // =====================================================================
      // CHAPTER 5 (12350 .. 15200): قلعة بتّير (خربة اليهود) ← رواق عين البلد الملكي
      // =====================================================================
      { x: 12350, y: groundY, w: 2850, h: groundH, type: 'battir_fortress_wall' },
      // Climbable Citadel Megalithic Bastion Shaft #2
      { x: 12800, y: 382, w: 36, h: 233, type: 'battir_alley_wall', climbable: true },
      { x: 12965, y: 382, w: 36, h: 233, type: 'battir_alley_wall', climbable: true },
      { x: 12985, y: 382, w: 245, h: 24, type: 'battir_fortress_wall', oneWay: true },

      // Wooden Mountain Beehives & Circling Swarm #2 + Brass Beekeeper Smoker + Citadel Stone Footbridge!
      { x: 13350, y: groundY - 115, w: 320, h: 115, type: 'battir_beehive_swarm', nonSolid: true, phase: 2.6 },
      { x: 13255, y: 505, w: 125, h: 22, type: 'battir_fortress_wall', oneWay: true },
      { x: 13405, y: 422, w: 225, h: 22, type: 'battir_fortress_wall', oneWay: true },
      { x: 13660, y: 505, w: 125, h: 22, type: 'battir_fortress_wall', oneWay: true },

      // Final Elastic Fig Canopy #4 before Grand Ain al-Balad Royal Riwaq Gate!
      { x: 14460, y: 548, w: 148, h: 26, type: 'battir_fig_canopy', oneWay: true, bounceVy: -785 },
      { x: 14580, y: 396, w: 210, h: 24, type: 'battir_qantara_arcade', oneWay: true },
    ];

    // 5 Safe Village Mintar Sanctuaries
    const checkpoints = [
      { x: 2780, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 5860, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 9080, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 12140, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 14130, y: groundY - 32, w: 44, h: 32, activated: false },
    ];

    // 10 Collectible Fish Treats rewarding Waterwheel, Zipline, Fig Canopy & Footbridge mastery
    const treats = [
      { x: 460, y: 458, collected: false },
      { x: 1820, y: 338, collected: false },
      { x: 3620, y: 364, collected: false },
      { x: 4335, y: 260, collected: false },
      { x: 5555, y: 340, collected: false },
      { x: 6405, y: 478, collected: false },
      { x: 8055, y: 328, collected: false },
      { x: 9705, y: 376, collected: false },
      { x: 13105, y: 334, collected: false },
      { x: 14680, y: 348, collected: false },
    ];

    // 1. Beloved Indian Crested Porcupines (النيص البري — KEPT 100% INTACT!)
    const battir_porcupines = [
      { x: 1280, y: groundY - 48, w: 68, h: 48, minX: 1180, maxX: 1460, speed: 75, facing: 1, walkDist: 0, bristle: 0 },
      { x: 4680, y: groundY - 48, w: 68, h: 48, minX: 4590, maxX: 4920, speed: 78, facing: -1, walkDist: 0, bristle: 0 },
      { x: 8760, y: groundY - 48, w: 68, h: 48, minX: 8690, maxX: 8940, speed: 78, facing: 1, walkDist: 0, bristle: 0 },
      { x: 11560, y: groundY - 48, w: 68, h: 48, minX: 11460, maxX: 11780, speed: 80, facing: -1, walkDist: 0, bristle: 0 },
      { x: 14320, y: groundY - 48, w: 68, h: 48, minX: 14250, maxX: 14430, speed: 82, facing: 1, walkDist: 0, bristle: 0 },
    ];

    // 2. NEW: Wild Wadi Boars (الخنزير البري الجبلي في وادي المخرور — tusks & bristle mane!)
    const battir_boars = [
      { x: 3220, y: groundY - 52, w: 76, h: 52, minX: 3110, maxX: 3460, speed: 94, facing: 1, walkDist: 0 },
      { x: 6960, y: groundY - 52, w: 76, h: 52, minX: 6840, maxX: 7180, speed: 98, facing: -1, walkDist: 0 },
      { x: 10140, y: groundY - 52, w: 76, h: 52, minX: 10020, maxX: 10380, speed: 100, facing: 1, walkDist: 0 },
      { x: 13840, y: groundY - 52, w: 76, h: 52, minX: 13780, maxX: 13990, speed: 102, facing: -1, walkDist: 0 },
    ];

    // 3. NEW: Crowned Palestinian Hoopoes (طائر الهدهد الفلسطيني المتوّج — fan crest & zebra wings!)
    const battir_hoopoes = [
      { x: 960, y: 275, baseY: 275, w: 58, h: 38, minX: 740, maxX: 1220, speed: 112, facing: 1, ampY: 24, phase: 0.3 },
      { x: 4340, y: 215, baseY: 215, w: 58, h: 38, minX: 4020, maxX: 4620, speed: 116, facing: -1, ampY: 24, phase: 1.4 },
      { x: 6420, y: 290, baseY: 290, w: 58, h: 38, minX: 6160, maxX: 6760, speed: 118, facing: 1, ampY: 26, phase: 2.2 },
      { x: 10760, y: 285, baseY: 285, w: 58, h: 38, minX: 10520, maxX: 11120, speed: 122, facing: -1, ampY: 26, phase: 3.1 },
      { x: 13520, y: 255, baseY: 255, w: 58, h: 38, minX: 13260, maxX: 13840, speed: 124, facing: 1, ampY: 24, phase: 4.0 },
    ];

    // 4. NEW: Palestinian Golden Cliff Scorpions (عقرب الصخور الجبلي في المدرجات والخربة!)
    const battir_scorpions = [
      { x: 2560, y: groundY - 34, w: 54, h: 34, minX: 2480, maxX: 2660, speed: 86, facing: 1, walkDist: 0 },
      { x: 7840, y: groundY - 34, w: 54, h: 34, minX: 7740, maxX: 8010, speed: 90, facing: -1, walkDist: 0 },
      { x: 12540, y: groundY - 34, w: 54, h: 34, minX: 12420, maxX: 12720, speed: 92, facing: 1, walkDist: 0 },
    ];

    return {
      id: 26,
      stage: 26,
      name: 'قرية بتّير • بيت لحم والقدس',
      nameEn: 'Battir • Bethlehem & Jerusalem',
      subtitle: 'غروب الجبل المدرج، نواعير عين البلد، قناطر السبع أرامل ومعبر قطار ١٨٩٢',
      subtitleEn: 'Sunset Terraced Gorge, Ain al-Balad Waterwheels, Qantara Alleys & 1892 Train',
      theme: 'battir',
      battirOutfit: true,
      width: 15200,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 14790, y: 495, w: 128, h: 120 },
      goalLabel: 'رواق عين البلد • بتّير',
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
      battir_boars,
      battir_hoopoes,
      battir_scorpions,
    };
  };
})();
