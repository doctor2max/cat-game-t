/* ============================================================================
   LEVEL 27: ISTANBUL, TURKEY (إسطنبول • جسر غلطة ومضيق البوسفور)
   Golden-Hour Bosphorus Sunset, Monumental Hagia Sophia & Blue Mosque Skyline,
   Galata Tower, Colorful Balat Cumba Houses, Riding the Red Istiklal Nostalgic
   Tram, Bobbing Bosphorus Vapur Ferries, Copper Tea Samovar Steam Updrafts,
   Springy Grand Bazaar Awnings, Friendly Simit Vendor (+1 Purple Heart!),
   and 3 Authentic Articulated Istanbul Enemies:
     • Anatolian Kangal Guard Dog (كلب كانغال التركي)
     • Grand Bazaar Spice Merchant (تاجر البازار الكبير)
     • Bosphorus Swooping Seagull (نورس البوسفور)
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel27 = function createLevel27() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // CHAPTER 1 (0 .. 2600): رصيف كاراكوي وجسر غلطة وبائع السميط
      // =====================================================================
      { x: 0, y: groundY, w: 960, h: groundH, type: 'istanbul_quay' },
      { x: 380, y: 505, w: 220, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      // Friendly Istanbul Simit Vendor granting Mashmasha +1 Purple Extra Life!
      { x: 640, y: groundY - 96, w: 118, h: 96, type: 'istanbul_simit_vendor', nonSolid: true },

      // Springy Striped Grand Bazaar Awning #1 over Karaköy Quay Inlet (960 .. 1240)
      { x: 1020, y: 562, w: 146, h: 26, type: 'istanbul_bazaar_awning', oneWay: true, bounceVy: -775 },
      { x: 1240, y: groundY, w: 1360, h: groundH, type: 'istanbul_quay' },

      // Ornate Copper Turkish Tea Samovar Steam Updraft #1 lifting to Upper Bridge Terrace
      { x: 1620, y: groundY - 76, w: 72, h: 76, type: 'istanbul_samovar_vent', nonSolid: true, phase: 0.2 },
      { x: 1580, y: 408, w: 240, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 1920, y: 492, w: 200, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // =====================================================================
      // CHAPTER 2 (2600 .. 5200): عبور مضيق البوسفور بعبّارة الفابور وبيوت بلاط
      // =====================================================================
      // Bobbing Bosphorus Vapur Passenger Ferry #1 across Harbor Channel (2600 .. 3320)
      { x: 2670, y: 586, w: 176, h: 28, type: 'istanbul_vapur_boat', oneWay: true, startX: 2670, endX: 3090, speed: 125, phase: 0.0 },
      { x: 3320, y: groundY, w: 1880, h: groundH, type: 'istanbul_quay' },

      // Climbable Balat Ottoman Timber-and-Stone Alley Shaft
      { x: 3760, y: 390, w: 36, h: 225, type: 'istanbul_balat_wall', climbable: true },
      { x: 3920, y: 390, w: 36, h: 225, type: 'istanbul_balat_wall', climbable: true },
      { x: 3945, y: 390, w: 250, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // Springy Bazaar Awning #2 + High Balat Panorama Balcony
      { x: 4460, y: 556, w: 146, h: 26, type: 'istanbul_bazaar_awning', oneWay: true, bounceVy: -775 },
      { x: 4630, y: 398, w: 240, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // =====================================================================
      // CHAPTER 3 (5200 .. 7800): شارع الاستقلال والترام الأحمر الكلاسيكي
      // =====================================================================
      // Classic Red Istiklal Nostalgic Tram #1 gliding across Karaköy Boulevard Gap (5200 .. 5960)
      { x: 5260, y: 572, w: 180, h: 30, type: 'istanbul_tram_car', oneWay: true, startX: 5260, endX: 5720, speed: 145, phase: 0.4 },
      { x: 5960, y: groundY, w: 1840, h: groundH, type: 'istanbul_bazaar_floor' },

      // Copper Samovar #2 + Elevated Istiklal Arcade Walkways
      { x: 6420, y: groundY - 76, w: 72, h: 76, type: 'istanbul_samovar_vent', nonSolid: true, phase: 1.4 },
      { x: 6380, y: 402, w: 240, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 6760, y: 486, w: 220, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 7160, y: 556, w: 146, h: 26, type: 'istanbul_bazaar_awning', oneWay: true, bounceVy: -775 },
      { x: 7340, y: 394, w: 230, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // =====================================================================
      // CHAPTER 4 (7800 .. 10200): البازار الكبير وسوق التوابل العثماني
      // =====================================================================
      // Bobbing Bosphorus Vapur Ferry #2 across Golden Horn Inlet (7800 .. 8520)
      { x: 7870, y: 586, w: 176, h: 28, type: 'istanbul_vapur_boat', oneWay: true, startX: 7870, endX: 8290, speed: 132, phase: 1.2 },
      { x: 8520, y: groundY, w: 1680, h: groundH, type: 'istanbul_bazaar_floor' },

      // Grand Bazaar Vaulted Mezzanine & Copper Samovar #3
      { x: 8960, y: groundY - 76, w: 72, h: 76, type: 'istanbul_samovar_vent', nonSolid: true, phase: 0.8 },
      { x: 8920, y: 400, w: 240, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 9340, y: 382, w: 36, h: 233, type: 'istanbul_balat_wall', climbable: true },
      { x: 9500, y: 382, w: 36, h: 233, type: 'istanbul_balat_wall', climbable: true },
      { x: 9525, y: 382, w: 250, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // =====================================================================
      // CHAPTER 5 (10200 .. 12600): صعود برج غلطة وبوابة البوسفور الكبرى
      // =====================================================================
      // Classic Red Istiklal Tram #2 gliding to Galata Tower Plaza (10200 .. 10940)
      { x: 10260, y: 572, w: 180, h: 30, type: 'istanbul_tram_car', oneWay: true, startX: 10260, endX: 10700, speed: 150, phase: 2.1 },
      { x: 10940, y: groundY, w: 1660, h: groundH, type: 'istanbul_quay' },

      // Final Awning Launch & Galata Viewing Terrace
      { x: 11460, y: 556, w: 146, h: 26, type: 'istanbul_bazaar_awning', oneWay: true, bounceVy: -775 },
      { x: 11640, y: 396, w: 240, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
    ];

    // 4 Safe Istanbul Stone Sanctuaries (well clear of all enemies & hazards)
    const checkpoints = [
      { x: 2420, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 5020, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 7620, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 10020, y: groundY - 32, w: 44, h: 32, activated: false },
    ];

    // 3 Golden Fish Treats rewarding Samovar, Balat Wall-Climb & Galata Terrace exploration
    const treats = [
      { x: 1700, y: 360, collected: false },
      { x: 4070, y: 342, collected: false },
      { x: 11760, y: 348, collected: false },
    ];

    // 1. Anatolian Kangal Guard Dogs (Stealth-aware behavioral AI + walkDist stride)
    const istanbul_kangals = [
      { x: 1380, y: groundY - 50, w: 72, h: 50, minX: 1290, maxX: 1560, speed: 84, facing: 1, walkDist: 0, state: 'patrol' },
      { x: 4220, y: groundY - 50, w: 72, h: 50, minX: 4100, maxX: 4420, speed: 88, facing: -1, walkDist: 0, state: 'patrol' },
      { x: 6820, y: groundY - 50, w: 72, h: 50, minX: 6680, maxX: 7060, speed: 92, facing: 1, walkDist: 0, state: 'patrol' },
      { x: 11180, y: groundY - 50, w: 72, h: 50, minX: 11040, maxX: 11400, speed: 94, facing: -1, walkDist: 0, state: 'patrol' },
    ];

    // 2. Grand Bazaar Spice Merchants (articulated walkDist stride)
    const istanbul_merchants = [
      { x: 2040, y: groundY - 58, w: 54, h: 58, minX: 1860, maxX: 2240, speed: 78, facing: -1, walkDist: 0 },
      { x: 6160, y: groundY - 58, w: 54, h: 58, minX: 6040, maxX: 6350, speed: 82, facing: 1, walkDist: 0 },
      { x: 8740, y: groundY - 58, w: 54, h: 58, minX: 8590, maxX: 8910, speed: 84, facing: 1, walkDist: 0 },
      { x: 9680, y: groundY - 58, w: 54, h: 58, minX: 9580, maxX: 9840, speed: 86, facing: -1, walkDist: 0 },
    ];

    // 3. Bosphorus Swooping Seagulls (articulated flapping wings over straits & plazas)
    const istanbul_gulls = [
      { x: 2960, y: 295, baseY: 295, w: 56, h: 36, minX: 2680, maxX: 3280, speed: 118, facing: 1, ampY: 28, phase: 0.4 },
      { x: 5580, y: 275, baseY: 275, w: 56, h: 36, minX: 5280, maxX: 5900, speed: 122, facing: -1, ampY: 26, phase: 1.5 },
      { x: 8160, y: 290, baseY: 290, w: 56, h: 36, minX: 7880, maxX: 8480, speed: 124, facing: 1, ampY: 28, phase: 2.3 },
      { x: 10580, y: 272, baseY: 272, w: 56, h: 36, minX: 10280, maxX: 10900, speed: 126, facing: -1, ampY: 26, phase: 3.1 },
    ];

    return {
      id: 27,
      stage: 27,
      name: 'إسطنبول • جسر غلطة والبوسفور',
      nameEn: 'Istanbul • Galata Bridge & Bosphorus',
      subtitle: 'غروب البوسفور، ترام الاستقلال الأحمر، عبّارات الفابور وبرج غلطة',
      subtitleEn: 'Bosphorus Sunset, Red Istiklal Tram, Vapur Ferries & Galata Tower',
      theme: 'istanbul',
      istanbulOutfit: true,
      width: 12600,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 12220, y: 495, w: 132, h: 120 },
      goalLabel: 'برج غلطة • إسطنبول',
      goalLabelEn: 'GALATA TOWER • ISTANBUL',
      platforms,
      checkpoints,
      treats,
      puddles: [],
      coins: [],
      rats: [],
      falcons: [],
      dogs: [],
      istanbul_kangals,
      istanbul_merchants,
      istanbul_gulls,
    };
  };
})();
