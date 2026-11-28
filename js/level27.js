/* ============================================================================
   LEVEL 27: ISTANBUL, TURKEY (إسطنبول • نهار البوسفور، جسر غلطة والبازار الكبير)
   CURATED 7-CHAPTER DAYTIME MARITIME ADVENTURE (20,600px) — Balanced Rhythmic Pacing,
   Zero Overlapping Obstacles/Enemies, Grounded Ablaq Arches & Chandelier Gantries,
   Basilica Cistern Inverted Medusa Columns, 76 Curated Gold Coins & Loving White Cats:
     1. Maraş Dondurma Trickster Cart & Sweeping Brass Paddle (عربة بوظة مرعش)
     2. Istiklal Kestane Kebap Roasted-Chestnut Ember Cart (عربة الكستناء المشوية)
     3. Buoyant Bosphorus Cedar Floating Pontoons with Nazar Amulet (الأرصفة العائمة)
     4. Sultanahmet Marble Tulip Fountains & Rising Water-Jet Discs (نوافير اللاله)
     5. Sizzling Eminönü Balık-Ekmek Charcoal Braziers (مشواة رصيف البوسفور)
     6. Twin-Leaf Rotating Galata Bascule Drawbridges + Steamer Funnel (جسر غلطة المزدوج)
     7. Grounded Ablaq Stone Archways & Swinging Tombak Brass Censers (مبخرة البازار)
     8. Basilica Cistern Inverted Marble Medusa Columns & Surge Waves (صهريج ميدوسا)
     9. Ottoman Copper Tea Samovars & Hammam Steam Lifts (سماور الشاي والحمام العثماني)
    10. Rideable Şehir Hatları Vapur Ferries, Viaduct Tram, Simitçi & White Angora Cats!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel27 = function createLevel27() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // CHAPTER 1 (0 .. 3100): رصيف كاراكوي وأمينونو، القطة البيضاء، السماور وبوظة مرعش
      // =====================================================================
      { x: 0, y: groundY, w: 980, h: groundH, type: 'istanbul_quay' },
      // Warm welcome promenade: White Angora Cat #1 (280..540) + Friendly Simitçi (🥨 +❤️ & +30 🪙) at 690
      { x: 690, y: groundY - 104, w: 120, h: 104, type: 'istanbul_simit_vendor', nonSolid: true },

      // Crossing #1 (980 .. 1360): Galata Pier Angler hoisting Carved Wooden Taka Skiff #1
      { x: 1105, y: 572, w: 132, h: 24, type: 'istanbul_fishing_float', oneWay: true, baseY: 572, liftH: 130, phase: 0.2 },
      { x: 1360, y: groundY, w: 1740, h: groundH, type: 'istanbul_quay' },

      // Beat 1A: Kangal Dog patrol (1430..1665) -> Open-sky Copper Samovar #1 (1770) lifting onto High Cumba Balcony (1895..2115) over Balık Grill #1 (1980)
      { x: 1770, y: groundY - 78, w: 74, h: 78, type: 'istanbul_samovar_vent', nonSolid: true, phase: 0.2 },
      { x: 1895, y: 446, w: 220, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 1980, y: groundY - 96, w: 96, h: 96, type: 'istanbul_balik_grill', nonSolid: true, phase: 0.4 },

      // Beat 1B: Maraş Dondurma Trickster #1 (2215) -> Meow bounce cleanly arcs up onto Treat #1 Balcony (2350..2565, y:418), clear of Merchant #1 & Checkpoint #1 (2890)!
      { x: 2215, y: groundY - 114, w: 104, h: 114, type: 'istanbul_dondurma_trick', nonSolid: true, paddleDir: -1, phase: 0.3 },
      { x: 2350, y: 418, w: 215, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // =====================================================================
      // CHAPTER 2 (3100 .. 6200): عبّارة البوسفور، حارات بلاط، عربة الكستناء والبازار
      // =====================================================================
      // Crossing #2 (3100 .. 3840): Rideable Şehir Hatları Vapur Ferry #1
      { x: 3160, y: 586, w: 190, h: 28, type: 'istanbul_vapur_boat', oneWay: true, startX: 3160, endX: 3590, speed: 128, phase: 0.0 },
      { x: 3840, y: groundY, w: 2360, h: groundH, type: 'istanbul_quay' },

      // Beat 2A: Safe White Cat #2 welcome (3890..4110) -> Climbable Almaşık Tower Shaft #1 (4210 / 4375) -> Upper Terrace (4413..4658, Treat #2)
      { x: 4210, y: 392, w: 38, h: 223, type: 'istanbul_balat_wall', climbable: true },
      { x: 4375, y: 392, w: 38, h: 223, type: 'istanbul_balat_wall', climbable: true },
      { x: 4413, y: 392, w: 245, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // Beat 2B: Istiklal Roasted-Chestnut Cart #1 (4800) with generous spacing
      { x: 4800, y: groundY - 114, w: 96, h: 114, type: 'istanbul_kestane_cart', nonSolid: true, phase: 0.4 },

      // Beat 2C: Kilim Spring Awning #1 (5080) -> High Safe Cumba Balcony (5265..5485) -> Grounded Ablaq Arch & Tombak Censer #1 (5660)
      { x: 5080, y: 548, w: 142, h: 26, type: 'istanbul_bazaar_awning', oneWay: true, bounceVy: -760 },
      { x: 5265, y: 420, w: 220, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 5660, y: 375, w: 60, h: 24, type: 'istanbul_whirling_censer', nonSolid: true, chainLen: 162, swingSpeed: 1.92, swingAmp: 0.88, phase: 0.3 },

      // =====================================================================
      // CHAPTER 3 (6200 .. 9400): الأرصفة العائمة، جسر غلطة المزدوج وصهريج ميدوسا
      // =====================================================================
      // Crossing #3 (6200 .. 6960): 3 Buoyant Bosphorus Cedar Floating Pontoons
      { x: 6305, y: 598, w: 138, h: 24, type: 'istanbul_floating_pontoon', oneWay: true, phase: 0.0 },
      { x: 6545, y: 594, w: 138, h: 24, type: 'istanbul_floating_pontoon', oneWay: true, phase: 1.2 },
      { x: 6780, y: 598, w: 138, h: 24, type: 'istanbul_floating_pontoon', oneWay: true, phase: 2.4 },
      { x: 6960, y: groundY, w: 860, h: groundH, type: 'istanbul_bazaar_floor' },

      // Beat 3A: Janissary Guard #2 (7015..7245) with optional Cumba Balcony -> Grounded Swinging Censer #2 (7480)
      { x: 7030, y: 486, w: 195, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 7480, y: 375, w: 60, h: 24, type: 'istanbul_whirling_censer', nonSolid: true, chainLen: 162, swingSpeed: 2.0, swingAmp: 0.90, phase: 0.5 },

      // Crossing #4 (7820 .. 8240): Twin-Leaf Rotating Galata Bascule Drawbridge #1 + Overhead Watch Balcony (Treat #3)
      { x: 7828, y: groundY, w: 404, h: 26, type: 'istanbul_drawbridge_leaf', oneWay: true, baseY: groundY, liftH: 158, phase: 0.3 },
      { x: 7920, y: 382, w: 220, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 8240, y: groundY, w: 1160, h: groundH, type: 'istanbul_quay' },

      // Beat 3B: Kangal #2 (8310..8560) -> Basilica Cistern Inverted Marble Medusa Column #1 (8750) -> Cleanly spaced before Checkpoint #3 (9160)
      { x: 8750, y: groundY - 134, w: 64, h: 134, type: 'istanbul_medusa_cistern', nonSolid: true, phase: 0.6 },

      // =====================================================================
      // CHAPTER 4 (9400 .. 12550): ثريات الفسيفساء، الحمام العثماني ونافورة اللاله
      // =====================================================================
      // Crossing #5 (9400 .. 10180): Grounded Overwater Mosaic Chandeliers #1 & #2
      { x: 9560, y: 545, w: 136, h: 22, type: 'istanbul_mosaic_chandelier', oneWay: true, chainLen: 165, swingSpeed: 1.42, swingAmp: 0.48, phase: 0.0 },
      { x: 9920, y: 525, w: 136, h: 22, type: 'istanbul_mosaic_chandelier', oneWay: true, chainLen: 160, swingSpeed: 1.48, swingAmp: 0.46, phase: 1.6 },
      { x: 10180, y: groundY, w: 2370, h: groundH, type: 'istanbul_bazaar_floor' },

      // Beat 4A: Grounded Swinging Grand Bazaar Tombak Censer #3 (10420)
      { x: 10420, y: 375, w: 60, h: 24, type: 'istanbul_whirling_censer', nonSolid: true, chainLen: 162, swingSpeed: 2.05, swingAmp: 0.92, phase: 0.4 },

      // Beat 4B: Ottoman Hammam Puzzle — Brass Kurna Valve (10720) -> Marble Steam Lift (10815) -> Almaşık Wall (11000) -> Terrace (11042..11282, Treat #4) -> Kangal #3 (11330..11500)
      { x: 10720, y: groundY - 70, w: 58, h: 70, type: 'istanbul_hammam_valve', nonSolid: true, valveId: 'hammam_1', active: false },
      { x: 10815, y: 584, w: 156, h: 24, type: 'istanbul_hammam_lift', oneWay: true, valveId: 'hammam_1', baseY: 584, liftH: 164 },
      { x: 11000, y: 428, w: 42, h: 187, type: 'istanbul_balat_wall', climbable: true },
      { x: 11042, y: 428, w: 240, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // Beat 4C: Sultanahmet Marble Tulip Fountain #1 (11575) -> High Gallery (11735..11965, Treat #5) -> Kestane Cart #2 (12050)
      { x: 11575, y: 576, w: 128, h: 22, type: 'istanbul_tulip_fountain', oneWay: true, baseY: 576, liftH: 152, phase: 0.5 },
      { x: 11735, y: 414, w: 230, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 12050, y: groundY - 114, w: 96, h: 114, type: 'istanbul_kestane_cart', nonSolid: true, phase: 1.9 },

      // =====================================================================
      // CHAPTER 5 (12550 .. 15600): جسر الترام المعلّق وساحة قصر توبكابي
      // =====================================================================
      // Crossing #6 (12550 .. 13310): Rideable Nostalgic Red Istiklal Tram on Stationary Viaduct Bridge
      { x: 12610, y: 572, w: 190, h: 30, type: 'istanbul_tram_car', oneWay: true, startX: 12610, endX: 13060, speed: 140, phase: 0.4 },
      { x: 13310, y: groundY, w: 2290, h: groundH, type: 'istanbul_quay' },

      // Beat 5A: White Cat #3 (13360..13580) -> Janissary #3 (13670..13920) -> Merchant #2 (13995..14265) with High Walkway (13860)
      { x: 13860, y: 492, w: 215, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // Beat 5B: Climbable Topkapı Twin Tower Shaft #2 (14370 / 14535) -> Upper Watch Terrace (14573..14808)
      { x: 14370, y: 392, w: 38, h: 223, type: 'istanbul_balat_wall', climbable: true },
      { x: 14535, y: 392, w: 38, h: 223, type: 'istanbul_balat_wall', climbable: true },
      { x: 14573, y: 392, w: 235, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // Beat 5C: Open-sky Copper Samovar #2 (14890) lifting onto High Balcony (15010..15225) over Balık Grill #2 (15095)
      { x: 14890, y: groundY - 78, w: 74, h: 78, type: 'istanbul_samovar_vent', nonSolid: true, phase: 1.3 },
      { x: 15010, y: 446, w: 215, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 15095, y: groundY - 96, w: 96, h: 96, type: 'istanbul_balik_grill', nonSolid: true, phase: 2.1 },

      // =====================================================================
      // CHAPTER 6 (15600 .. 18400): معبر القرن الذهبي، بازار التوابل وميدوسا الثانية
      // =====================================================================
      // Crossing #7 (15600 .. 16620): Vapur Ferry #2 + Buoyant Cedar Pontoon #4 Relay
      { x: 15660, y: 586, w: 190, h: 28, type: 'istanbul_vapur_boat', oneWay: true, startX: 15660, endX: 16080, speed: 134, phase: 1.0 },
      { x: 16385, y: 596, w: 142, h: 24, type: 'istanbul_floating_pontoon', oneWay: true, phase: 0.8 },
      { x: 16620, y: groundY, w: 1360, h: groundH, type: 'istanbul_bazaar_floor' },

      // Beat 6A: Tulip Fountain #2 (16750) -> High Iznik Gallery (16910..17155, Treat #6) above Spice Merchant #3 (16920..17170)
      { x: 16750, y: 576, w: 128, h: 22, type: 'istanbul_tulip_fountain', oneWay: true, baseY: 576, liftH: 154, phase: 2.0 },
      { x: 16910, y: 412, w: 245, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // Beat 6B: Basilica Cistern Inverted Medusa Column #2 (17345) -> Copper Samovar #3 (17555) -> Balcony (17665..17855)
      { x: 17345, y: groundY - 134, w: 64, h: 134, type: 'istanbul_medusa_cistern', nonSolid: true, phase: 1.8 },
      { x: 17555, y: groundY - 78, w: 74, h: 78, type: 'istanbul_samovar_vent', nonSolid: true, phase: 1.7 },
      { x: 17665, y: 454, w: 190, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },

      // Crossing #8 (17980 .. 18400): Twin-Leaf Rotating Galata Bascule Drawbridge #2
      { x: 17988, y: groundY, w: 404, h: 26, type: 'istanbul_drawbridge_leaf', oneWay: true, baseY: groundY, liftH: 158, phase: 1.9 },

      // =====================================================================
      // CHAPTER 7 (18400 .. 20600): جادة الاستقلال الكبرى ← بوابة برج غلطة الأثري
      // =====================================================================
      { x: 18400, y: groundY, w: 2200, h: groundH, type: 'istanbul_quay' },

      // Beat 7A: Maraş Dondurma Trickster #2 (18765) -> Bounce Balcony (18900..19085) -> Kestane Kebap Cart #3 (19165)
      { x: 18765, y: groundY - 114, w: 104, h: 114, type: 'istanbul_dondurma_trick', nonSolid: true, paddleDir: -1, phase: 0.9 },
      { x: 18900, y: 432, w: 185, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 19165, y: groundY - 114, w: 96, h: 114, type: 'istanbul_kestane_cart', nonSolid: true, phase: 2.6 },

      // Beat 7B: Final Kilim Spring Awning #2 (19380) -> Galata Watch Balcony (19545..19745, Treat #7) -> Final Grounded Censer #4 (19850) -> White Cat #4 & Galata Gate!
      { x: 19380, y: 548, w: 142, h: 26, type: 'istanbul_bazaar_awning', oneWay: true, bounceVy: -770 },
      { x: 19545, y: 416, w: 200, h: 24, type: 'istanbul_bazaar_floor', oneWay: true },
      { x: 19850, y: 375, w: 60, h: 24, type: 'istanbul_whirling_censer', nonSolid: true, chainLen: 155, swingSpeed: 2.0, swingAmp: 0.80, phase: 2.1 },
    ];

    // Sparkling Cool Daytime Bosphorus Sea Channels beneath every water crossing!
    const puddles = [
      { x: 980, y: 656, w: 380, h: 64 },
      { x: 3100, y: 656, w: 740, h: 64 },
      { x: 6200, y: 656, w: 760, h: 64 },
      { x: 7820, y: 656, w: 420, h: 64 },
      { x: 9400, y: 656, w: 780, h: 64 },
      { x: 12550, y: 656, w: 760, h: 64 },
      { x: 15600, y: 656, w: 1020, h: 64 },
      { x: 17980, y: 656, w: 420, h: 64 },
    ];

    // 6 Ornate Ottoman Marble Sebil Fountain Checkpoints in clear sanctuary zones
    const checkpoints = [
      { x: 2890, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 5980, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 9160, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 12330, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 15410, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 18530, y: groundY - 32, w: 44, h: 32, activated: false },
    ];

    // 7 Golden Fish Treats placed cleanly above every rewarding high route!
    const treats = [
      { x: 2458, y: 370, collected: false },
      { x: 4535, y: 344, collected: false },
      { x: 8030, y: 334, collected: false },
      { x: 11162, y: 380, collected: false },
      { x: 11850, y: 366, collected: false },
      { x: 17032, y: 364, collected: false },
      { x: 19645, y: 368, collected: false },
    ];

    // 76 Curated Gold Coins guiding jumps across Bosphorus skiffs, ferries, pontoons, awnings, steam lifts & galleries!
    const coinCoords = [
      // Ch.1: Taka Skiff #1, Samovar Balcony #1 & Maraş Dondurma Balcony
      [1130, 488], [1171, 452], [1212, 488],
      [1807, 495], [1807, 442], [1955, 410], [2055, 410],
      [2267, 492], [2315, 430], [2405, 382], [2510, 382],
      // Ch.2: Vapur Ferry #1, Balat Terrace, Kestane arc & Kilim Awning #1
      [3330, 540], [3440, 540], [3550, 540],
      [4475, 356], [4595, 356],
      [4810, 486], [4848, 468], [4886, 486],
      [5151, 464], [5210, 412], [5325, 384], [5425, 384],
      // Ch.3: Floating Pontoons, Cumba Balcony, Galata Drawbridge #1 & Medusa #1 jump arcs
      [6374, 552], [6614, 548], [6849, 552],
      [7085, 450], [7170, 450],
      [7975, 346], [8085, 346],
      [8690, 548], [8870, 548],
      // Ch.4: Mosaic Chandeliers, Hammam Steam Lift, Tulip Fountain #1 & Gallery
      [9628, 498], [9810, 468], [9988, 478],
      [10893, 495], [10893, 440], [11105, 392], [11220, 392],
      [11639, 482], [11639, 428], [11795, 378], [11905, 378],
      // Ch.5: Viaduct Tram, Topkapı Walkway, Twin Tower Terrace & Samovar #2
      [12775, 526], [12890, 526], [13005, 526],
      [13920, 456], [14015, 456],
      [14635, 356], [14745, 356],
      [14927, 495], [14927, 442], [15070, 410], [15165, 410],
      // Ch.6: Vapur #2 + Pontoon #4, Tulip Fountain #2 Gallery, Medusa #2 & Drawbridge #2
      [15835, 540], [15965, 540], [16456, 550],
      [16814, 480], [16814, 426], [16975, 376], [17090, 376],
      [17285, 548], [17470, 548], [17592, 492], [17720, 418], [17805, 418],
      [18130, 535], [18250, 535],
      // Ch.7: Dondurma #2 Balcony, Kilim Awning #2 Balcony & Grand Approach to Galata Gate!
      [18817, 496], [18955, 396], [19030, 396],
      [19451, 462], [19505, 412], [19600, 380], [19690, 380], [20125, 575],
    ];
    const coins = coinCoords.map(([cx, cy], idx) => ({
      x: cx,
      y: cy,
      collected: false,
      phase: idx * 0.35,
    }));

    // 1. Anatolian Kangal Shepherd Guard Dogs — Zero overlap with balconies, grills, carts, or checkpoints!
    const istanbul_kangals = [
      { x: 1520, y: groundY - 52, w: 78, h: 52, minX: 1430, maxX: 1665, speed: 84, facing: 1, walkDist: 0, state: 'patrol' },
      { x: 8420, y: groundY - 52, w: 78, h: 52, minX: 8310, maxX: 8560, speed: 88, facing: 1, walkDist: 0, state: 'patrol' },
      { x: 11400, y: groundY - 52, w: 78, h: 52, minX: 11325, maxX: 11495, speed: 88, facing: -1, walkDist: 0, state: 'patrol' },
    ];

    // 2. Grand Bazaar Tea & Spice Merchants — Cleanly spaced in open ground segments!
    const istanbul_merchants = [
      { x: 2680, y: groundY - 62, w: 56, h: 62, minX: 2605, maxX: 2770, speed: 80, facing: -1, walkDist: 0 },
      { x: 14090, y: groundY - 62, w: 56, h: 62, minX: 13995, maxX: 14265, speed: 84, facing: 1, walkDist: 0 },
      { x: 17030, y: groundY - 62, w: 56, h: 62, minX: 16920, maxX: 17165, speed: 84, facing: -1, walkDist: 0 },
    ];

    // 3. Authentic Snow-White Bosphorus Seagulls gliding above the 5 open sea crossings
    const istanbul_gulls = [
      { x: 3440, y: 270, baseY: 270, w: 66, h: 38, minX: 3120, maxX: 3800, speed: 120, facing: 1, ampY: 24, phase: 0.4 },
      { x: 6560, y: 262, baseY: 262, w: 66, h: 38, minX: 6220, maxX: 6920, speed: 124, facing: -1, ampY: 24, phase: 1.5 },
      { x: 9760, y: 252, baseY: 252, w: 66, h: 38, minX: 9420, maxX: 10140, speed: 126, facing: 1, ampY: 22, phase: 2.3 },
      { x: 12910, y: 266, baseY: 266, w: 66, h: 38, minX: 12580, maxX: 13270, speed: 126, facing: -1, ampY: 24, phase: 0.9 },
      { x: 16080, y: 264, baseY: 264, w: 66, h: 38, minX: 15640, maxX: 16560, speed: 128, facing: 1, ampY: 24, phase: 3.1 },
    ];

    // 4. Topkapı Palace Ceremonial Janissary Guards — Cleanly spaced, never colliding with censers or Simitçi!
    const istanbul_janissaries = [
      { x: 5360, y: groundY - 68, w: 48, h: 68, minX: 5275, maxX: 5465, speed: 86, facing: -1, walkDist: 0 },
      { x: 7130, y: groundY - 68, w: 48, h: 68, minX: 7015, maxX: 7245, speed: 90, facing: 1, walkDist: 0 },
      { x: 13780, y: groundY - 68, w: 48, h: 68, minX: 13670, maxX: 13920, speed: 90, facing: -1, walkDist: 0 },
      { x: 19635, y: groundY - 68, w: 48, h: 68, minX: 19555, maxX: 19735, speed: 90, facing: 1, walkDist: 0 },
    ];

    // 5. Affectionate Pure-White Istanbul Angora Cats in peaceful safe stretches!
    const istanbul_alley_cats = [
      { x: 400, y: groundY - 40, w: 64, h: 40, minX: 280, maxX: 560, facing: -1, walkDist: 0, phase: 0.1 },
      { x: 3980, y: groundY - 40, w: 64, h: 40, minX: 3890, maxX: 4120, facing: -1, walkDist: 0, phase: 0.8 },
      { x: 13460, y: groundY - 40, w: 64, h: 40, minX: 13360, maxX: 13590, facing: -1, walkDist: 0, phase: 1.7 },
      { x: 20035, y: groundY - 40, w: 64, h: 40, minX: 19980, maxX: 20125, facing: -1, walkDist: 0, phase: 2.5 },
    ];

    return {
      id: 27,
      stage: 27,
      name: 'إسطنبول • نهار البوسفور وبرج غلطة',
      nameEn: 'Istanbul • Daytime Bosphorus & Galata',
      subtitle: 'نهار البوسفور البارد، صهريج ميدوسا، نوافير اللاله، بوظة مرعش، الحراس والقطة البيضاء الملاطفة',
      subtitleEn: 'Cool Bosphorus Day, Medusa Cistern, Tulip Fountains, Maraş Ice Cream, Guards & Loving White Cats',
      theme: 'istanbul',
      istanbulOutfit: true,
      width: 20600,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 20180, y: 495, w: 148, h: 120 },
      goalLabel: 'بوابة برج غلطة • إسطنبول',
      goalLabelEn: 'GALATA PALACE GATE • ISTANBUL',
      platforms,
      checkpoints,
      treats,
      puddles,
      coins,
      rats: [],
      falcons: [],
      dogs: [],
      istanbul_kangals,
      istanbul_merchants,
      istanbul_gulls,
      istanbul_janissaries,
      istanbul_alley_cats,
    };
  };
})();
