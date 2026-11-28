/* ============================================================================
   LEVEL 28: SWISS COUNTRYSIDE (الريف السويسري • جبال الألب، لاوتربرونن وماترهورن)
   CURATED 7-CHAPTER DAYTIME ALPINE ADVENTURE (20,800px) — Balanced Rhythmic Pacing,
   Zero Overlapping Obstacles/Enemies, World-Fixed Cableways & Rack Funiculars,
   Cozy St. Bernard Rescue Hospice Hut, Loving St. Bernard Companions & Swiss Mechanics:
     1. Rolling Giant Emmental Cheese Wheel & Alpkäserei Dairy Chalet (عجلة جبن إمنتال)
     2. Ornate Brienz Swiss Cuckoo-Clock Pendulum & Pop-Out Perch (ساعة الوقواق السويسرية)
     3. Panoramic Mountain Gondola Cableway (تلفريك جبال الألب على أبراج ثابتة)
     4. Glacier Express Cogwheel Funicular (قطار جبال الألب المسنّن على جسر حجري ثابت)
     5. Glacial Waterfall Hydro-Mill Wheel (طاحونة الشلال الجليدي الدوارة)
     6. Grounded Alpine Heuwagen Hay-Wagon Bounce Cart (عربة القش السويسرية القافزة)
     7. Swiss Alphorn Herder & Golden Acoustic Updraft Rings (بوق الألب الصوتي الرافع)
     8. Bubbling Swiss Fondue Cauldron & Chilled Cheese-Bridge (قدر الفوندو وجسر الجبن)
     9. Alpine Avalanche Treichel Cowbell Arch & Snow Cornice (جرس الألب الثلجي)
    10. St. Bernard Alpine Hospice Hut (🍫 +❤️ & +30 🪙) & Loving St. Bernard Companions!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel28 = function createLevel28() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // CHAPTER 1 (0 .. 3100): مرج غريندلفالد، كشك سانت برنارد وطاحونة الشلال
      // =====================================================================
      { x: 0, y: groundY, w: 980, h: groundH, type: 'swiss_meadow' },
      // Cozy St. Bernard Rescue Hospice Hut offering warm Swiss cocoa & +30 coins before Crossing #1!
      { x: 735, y: groundY - 96, w: 118, h: 96, type: 'swiss_rescue_hut', nonSolid: true },

      // Crossing #1 (980 .. 1440): Glacial Waterfall Hydro-Mill Wheel #1
      { x: 1210, y: 556, w: 180, h: 180, type: 'swiss_waterwheel_mill', radius: 102, rotSpeed: 0.72, phase: 0.0 },
      { x: 1440, y: groundY, w: 1660, h: groundH, type: 'swiss_meadow' },

      // Beat 1A: Alpine Ibex patrol (1490..1730) -> Open-sky Alphorn Acoustic Lift #1 (1850) -> High Chalet Balcony (1985, Treat #1) + Fondue Cauldron #1 (2060)
      { x: 1850, y: groundY - 78, w: 84, h: 78, type: 'swiss_alphorn_gust', nonSolid: true, phase: 0.2 },
      { x: 1985, y: 438, w: 235, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 2060, y: groundY - 70, w: 84, h: 70, type: 'swiss_fondue_cauldron', bridgeW: 142, phase: 0.4 },

      // Beat 1B: Rolling Giant Emmental Cheese Wheel #1 (2310..2680) -> Cleanly clear of Checkpoint #1 (2890)
      { x: 2310, y: groundY - 68, w: 370, h: 68, type: 'swiss_cheese_wheel', nonSolid: true, minX: 2310, maxX: 2680, wheelR: 26, speed: 175, phase: 0.3 },

      // =====================================================================
      // CHAPTER 2 (3100 .. 6250): تلفريك جبال الألب، كلب سانت برنارد، شاليهات الخشب وعربة القش
      // =====================================================================
      // Crossing #2 (3100 .. 3880): Panoramic Swiss Mountain Cableway #1 (World-fixed pylons!)
      { x: 3175, y: 552, w: 176, h: 28, type: 'swiss_cable_car', oneWay: true, startX: 3175, endX: 3630, speed: 132, phase: 0.0 },
      { x: 3880, y: groundY, w: 2370, h: groundH, type: 'swiss_meadow' },

      // Beat 2A: Friendly St. Bernard #1 welcome (3915..4080) -> Climbable Alpine Timber Tower Shaft #1 (4145 walk-in doorway / 4310) -> Terrace (4348..4573, Treat #2) -> Clockwork Owl #1 (4620..4865)
      { x: 4145, y: 392, w: 38, h: 148, type: 'swiss_timber_wall', climbable: true },
      { x: 4310, y: 392, w: 38, h: 223, type: 'swiss_timber_wall', climbable: true },
      { x: 4348, y: 392, w: 225, h: 24, type: 'swiss_chalet_deck', oneWay: true },

      // Beat 2B: Alpine Marmot #1 (4920..5125) -> Hay-Wagon Bounce #1 (5185) -> High Chalet Loft (5355..5540) -> Unobstructed Avalanche Bell Arch #1 (5575..5699) -> Cuckoo-Clock #1 (5775) + Stepping Balcony (5865)
      { x: 5185, y: 548, w: 144, h: 26, type: 'swiss_hay_bounce', oneWay: true, bounceVy: -770 },
      { x: 5355, y: 416, w: 185, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 5575, y: groundY - 172, w: 124, h: 172, type: 'swiss_avalanche_bell', nonSolid: true, archH: 172, phase: 0.5 },
      { x: 5775, y: 424, w: 68, h: 24, type: 'swiss_cuckoo_clock', chainLen: 106, swingSpeed: 1.9, swingAmp: 0.84, phase: 0.4 },
      { x: 5865, y: 504, w: 115, h: 24, type: 'swiss_chalet_deck', oneWay: true },

      // =====================================================================
      // CHAPTER 3 (6250 .. 9450): طاحونة الشلال المزدوجة، قطار غلاسيير إكسبرس وجبن إمنتال
      // =====================================================================
      // Crossing #3 (6250 .. 6960): Twin Glacial Waterfall Hydro-Mill Wheels #2 & #3
      { x: 6435, y: 556, w: 180, h: 180, type: 'swiss_waterwheel_mill', radius: 100, rotSpeed: 0.74, phase: 0.2 },
      { x: 6775, y: 544, w: 180, h: 180, type: 'swiss_waterwheel_mill', radius: 100, rotSpeed: -0.74, phase: 1.1 },
      { x: 6960, y: groundY, w: 880, h: groundH, type: 'swiss_meadow' },

      // Beat 3A: Nutcracker Guard #1 (7010..7250) with reachable Chalet Balcony -> Unobstructed Swiss Cuckoo-Clock #2 (7350) -> Clockwork Owl #2 (7520..7780)
      { x: 7035, y: 504, w: 225, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 7350, y: 424, w: 68, h: 24, type: 'swiss_cuckoo_clock', chainLen: 106, swingSpeed: 1.98, swingAmp: 0.86, phase: 1.1 },

      // Crossing #4 (7840 .. 8580): Glacier Express Cogwheel Funicular #1 (World-fixed stone rack viaduct!)
      { x: 7905, y: 568, w: 190, h: 30, type: 'swiss_funicular_car', oneWay: true, startX: 7905, endX: 8330, speed: 138, phase: 0.2 },
      { x: 8580, y: groundY, w: 870, h: groundH, type: 'swiss_meadow' },

      // Beat 3B: Rolling Giant Emmental Cheese Wheel #2 (8640..9020) -> Cleanly clear of Checkpoint #3 (9250)
      { x: 8640, y: groundY - 68, w: 380, h: 68, type: 'swiss_cheese_wheel', nonSolid: true, minX: 8640, maxX: 9020, wheelR: 26, speed: 185, phase: 1.4 },

      // =====================================================================
      // CHAPTER 4 (9450 .. 12650): ممر ماترهورن، بوق الألب الثاني وبرج الشاليهات
      // =====================================================================
      // Crossing #5 (9450 .. 10230): Panoramic Swiss Mountain Cableway #2
      { x: 9520, y: 548, w: 176, h: 28, type: 'swiss_cable_car', oneWay: true, startX: 9520, endX: 9985, speed: 136, phase: 0.8 },
      { x: 10230, y: groundY, w: 2420, h: groundH, type: 'swiss_meadow' },

      // Beat 4A: Snow Fox #2 (10260..10490) + Stepping Balcony (10395) -> Unobstructed Cuckoo-Clock #3 (10555) -> Ibex #2 (10700..10940)
      { x: 10395, y: 504, w: 120, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 10555, y: 424, w: 68, h: 24, type: 'swiss_cuckoo_clock', chainLen: 106, swingSpeed: 2.0, swingAmp: 0.86, phase: 0.6 },

      // Beat 4B: Open-sky Alphorn Acoustic Lift #2 (11050) -> High Chalet Gallery (11190, Treat #3) + Fondue Cauldron #2 (11310)
      { x: 11050, y: groundY - 78, w: 84, h: 78, type: 'swiss_alphorn_gust', nonSolid: true, phase: 1.2 },
      { x: 11190, y: 428, w: 245, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 11310, y: groundY - 70, w: 84, h: 70, type: 'swiss_fondue_cauldron', bridgeW: 142, phase: 1.3 },

      // Beat 4C: Climbable Alpine Timber Tower Shaft #2 (11590 walk-in doorway / 11755) -> Upper Watch Deck (11793, Treat #4) -> Marmot #2 (12060..12260)
      { x: 11590, y: 392, w: 38, h: 148, type: 'swiss_timber_wall', climbable: true },
      { x: 11755, y: 392, w: 38, h: 223, type: 'swiss_timber_wall', climbable: true },
      { x: 11793, y: 392, w: 235, h: 24, type: 'swiss_chalet_deck', oneWay: true },

      // =====================================================================
      // CHAPTER 5 (12650 .. 15800): جسر قطار غلاسيير الثاني ومروج القش الذهبي
      // =====================================================================
      // Crossing #6 (12650 .. 13410): Glacier Express Cogwheel Funicular #2
      { x: 12715, y: 568, w: 190, h: 30, type: 'swiss_funicular_car', oneWay: true, startX: 12715, endX: 13155, speed: 142, phase: 1.0 },
      { x: 13410, y: groundY, w: 2390, h: groundH, type: 'swiss_meadow' },

      // Beat 5A: Friendly St. Bernard #2 (13445..13605) -> Snow Fox #3 (13665..13895) -> Nutcracker #2 (13955..14175) with reachable Chalet Deck
      { x: 13965, y: 504, w: 200, h: 24, type: 'swiss_chalet_deck', oneWay: true },

      // Beat 5B: Grounded Hay-Wagon Bounce Cart #2 (14240) -> High Alpine Loft (14420..14640, Treat #5)
      { x: 14240, y: 548, w: 144, h: 26, type: 'swiss_hay_bounce', oneWay: true, bounceVy: -775 },
      { x: 14420, y: 414, w: 220, h: 24, type: 'swiss_chalet_deck', oneWay: true },

      // Beat 5C: Unobstructed Avalanche Bell Arch #2 (14675..14799) -> Emmental Cheese Wheel #3 (14865..15245) -> Clear of Checkpoint #5 (15580)
      { x: 14675, y: groundY - 172, w: 124, h: 172, type: 'swiss_avalanche_bell', nonSolid: true, archH: 172, phase: 1.6 },
      { x: 14865, y: groundY - 68, w: 380, h: 68, type: 'swiss_cheese_wheel', nonSolid: true, minX: 14865, maxX: 15245, wheelR: 26, speed: 190, phase: 2.2 },

      // =====================================================================
      // CHAPTER 6 (15800 .. 18600): وادي شلال ستوباخ، التلفريك الثالث وبوق الألب الثالث
      // =====================================================================
      // Crossing #7 (15800 .. 16620): Panoramic Swiss Mountain Cableway #3
      { x: 15870, y: 548, w: 176, h: 28, type: 'swiss_cable_car', oneWay: true, startX: 15870, endX: 16375, speed: 140, phase: 1.6 },
      { x: 16620, y: groundY, w: 1440, h: groundH, type: 'swiss_meadow' },

      // Beat 6A: Ibex #3 (16680..16930) -> Alphorn Lift #3 (17040) -> High Chalet Gallery (17175..17405, Treat #6) + Fondue Cauldron #3 (17290)
      { x: 17040, y: groundY - 78, w: 84, h: 78, type: 'swiss_alphorn_gust', nonSolid: true, phase: 2.0 },
      { x: 17175, y: 422, w: 230, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 17290, y: groundY - 70, w: 84, h: 70, type: 'swiss_fondue_cauldron', bridgeW: 142, phase: 2.2 },

      // Beat 6B: Clockwork Owl #3 (17480..17720) -> Unobstructed Cuckoo-Clock #4 (17820) + Stepping Balcony (17910) -> Crossing #8 (Hydro-Mill Wheel #4 at 18330)
      { x: 17820, y: 424, w: 68, h: 24, type: 'swiss_cuckoo_clock', chainLen: 106, swingSpeed: 2.02, swingAmp: 0.86, phase: 1.9 },
      { x: 17910, y: 504, w: 115, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 18330, y: 556, w: 180, h: 180, type: 'swiss_waterwheel_mill', radius: 102, rotSpeed: 0.76, phase: 0.7 },

      // =====================================================================
      // CHAPTER 7 (18600 .. 20800): طريق محطة غريندلفالد الكبرى ← بوابة برج الساعة السويسري
      // =====================================================================
      { x: 18600, y: groundY, w: 2200, h: groundH, type: 'swiss_meadow' },

      // Beat 7A: Checkpoint #6 (18720) -> Marmot #3 (18910..19140) -> Nutcracker #3 (19220..19440)
      // Beat 7B: Final Hay-Wagon Bounce #3 (19520) -> Panoramic Chalet Balcony (19690..19875, Treat #7) -> Unobstructed Avalanche Bell Arch #3 (19905..20029) -> Final Cuckoo-Clock #5 (20105) + Stepping Balcony (20195) -> St. Bernard #3 (20215..20345) -> Station Gate!
      { x: 19520, y: 548, w: 144, h: 26, type: 'swiss_hay_bounce', oneWay: true, bounceVy: -775 },
      { x: 19690, y: 416, w: 185, h: 24, type: 'swiss_chalet_deck', oneWay: true },
      { x: 19905, y: groundY - 172, w: 124, h: 172, type: 'swiss_avalanche_bell', nonSolid: true, archH: 172, phase: 2.5 },
      { x: 20105, y: 424, w: 68, h: 24, type: 'swiss_cuckoo_clock', chainLen: 106, swingSpeed: 1.95, swingAmp: 0.78, phase: 2.4 },
      { x: 20195, y: 504, w: 115, h: 24, type: 'swiss_chalet_deck', oneWay: true },
    ];

    // Crystal Glacial Turquoise Alpine Streams beneath every valley crossing
    const puddles = [
      { x: 980, y: 646, w: 460, h: 74 },
      { x: 3100, y: 646, w: 780, h: 74 },
      { x: 6250, y: 646, w: 710, h: 74 },
      { x: 7840, y: 646, w: 740, h: 74 },
      { x: 9450, y: 646, w: 780, h: 74 },
      { x: 12650, y: 646, w: 760, h: 74 },
      { x: 15800, y: 646, w: 820, h: 74 },
      { x: 18060, y: 646, w: 540, h: 74 },
    ];

    // 6 Carved Alpine Dorfbrunnen Village Fountain Checkpoints in clear sanctuary zones
    const checkpoints = [
      { x: 2890, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 6030, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 9250, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 12430, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 15580, y: groundY - 32, w: 44, h: 32, activated: false },
      { x: 18720, y: groundY - 32, w: 44, h: 32, activated: false },
    ];

    // 7 Golden Fish Treats placed cleanly above every rewarding elevated Alpine route!
    const treats = [
      { x: 2102, y: 390, collected: false },
      { x: 4460, y: 344, collected: false },
      { x: 11312, y: 380, collected: false },
      { x: 11910, y: 344, collected: false },
      { x: 14530, y: 366, collected: false },
      { x: 17290, y: 374, collected: false },
      { x: 19782, y: 368, collected: false },
    ];

    // Curated Gold Coin Trails guiding jumps over waterwheels, cableways, funiculars, hay-bounces & chalet balconies!
    const coinCoords = [
      // Ch.1: Hydro-Mill #1, Alphorn Balcony #1 & Emmental Cheese jump arc
      [1135, 468], [1210, 434], [1285, 468],
      [1892, 500], [1892, 445], [2045, 402], [2160, 402],
      [2440, 520], [2495, 502], [2550, 520],
      // Ch.2: Cableway #1, Timber Terrace, Hay-Wagon Bounce #1 & Cuckoo Perch #1
      [3350, 505], [3460, 505], [3570, 505],
      [4405, 356], [4515, 356],
      [5257, 462], [5315, 412], [5415, 380], [5485, 380], [5809, 362],
      // Ch.3: Twin Hydro-Mills, Chalet Balcony, Funicular #1 & Cheese Wheel #2
      [6395, 444], [6605, 432], [6775, 422],
      [7095, 466], [7165, 466], [7384, 362],
      [8060, 522], [8175, 522], [8290, 522],
      [8785, 518], [8840, 500], [8895, 518],
      // Ch.4: Cableway #2, Alphorn Gallery #2 & Timber Watch Deck #2
      [9690, 502], [9805, 502], [9920, 502],
      [10589, 362], [11092, 495], [11092, 440], [11255, 392], [11370, 392],
      [11855, 356], [11965, 356],
      // Ch.5: Funicular #2, Chalet Deck, Hay-Wagon Bounce #2 & Cheese Wheel #3
      [12875, 522], [12990, 522], [13105, 522],
      [14025, 466], [14105, 466],
      [14312, 460], [14370, 410], [14480, 378], [14580, 378],
      [15005, 518], [15060, 500], [15115, 518],
      // Ch.6: Cableway #3, Alphorn Gallery #3, Cuckoo #4 & Hydro-Mill #4
      [16045, 502], [16165, 502], [16285, 502],
      [17082, 492], [17082, 436], [17235, 386], [17345, 386],
      [17854, 362], [18255, 468], [18330, 434], [18405, 468],
      // Ch.7: Hay-Wagon Bounce #3, Panoramic Balcony, Final Cuckoo #5 & Grand Approach
      [19592, 460], [19645, 412], [19740, 380], [19825, 380],
      [20139, 362], [20260, 575], [20320, 575],
    ];
    const coins = coinCoords.map(([cx, cy], idx) => ({
      x: cx,
      y: cy,
      collected: false,
      phase: idx * 0.35,
    }));

    // 1. Alpine Mountain Ibex (Curved scimitar horns, telegraphed horn-paw & dash burst!)
    const swiss_ibex = [
      { x: 1580, y: groundY - 54, w: 68, h: 54, minX: 1490, maxX: 1730, speed: 86, facing: 1, walkDist: 0, state: 'patrol' },
      { x: 10780, y: groundY - 54, w: 68, h: 54, minX: 10700, maxX: 10940, speed: 90, facing: -1, walkDist: 0, state: 'patrol' },
      { x: 16780, y: groundY - 54, w: 68, h: 54, minX: 16680, maxX: 16930, speed: 92, facing: 1, walkDist: 0, state: 'patrol' },
    ];

    // 2. Swiss Alpine Marmots (Mossy boulder burrow, upright sentinel whistle & scurry; calm when sneaking!)
    const swiss_marmots = [
      { x: 5010, y: groundY - 38, w: 48, h: 38, minX: 4920, maxX: 5125, speed: 108, facing: -1, walkDist: 0, phase: 0.2 },
      { x: 12140, y: groundY - 38, w: 48, h: 38, minX: 12060, maxX: 12260, speed: 112, facing: 1, walkDist: 0, phase: 1.5 },
      { x: 19000, y: groundY - 38, w: 48, h: 38, minX: 18910, maxX: 19140, speed: 112, facing: -1, walkDist: 0, phase: 2.3 },
    ];

    // 3. Golden Alpine Eagles gliding majestically above the 5 grand Alpine gorge crossings
    const swiss_eagles = [
      { x: 3480, y: 266, baseY: 266, w: 76, h: 40, minX: 3140, maxX: 3840, speed: 126, facing: 1, ampY: 26, phase: 0.3 },
      { x: 6600, y: 258, baseY: 258, w: 76, h: 40, minX: 6280, maxX: 6930, speed: 128, facing: -1, ampY: 24, phase: 1.4 },
      { x: 9840, y: 254, baseY: 254, w: 76, h: 40, minX: 9480, maxX: 10190, speed: 130, facing: 1, ampY: 24, phase: 2.2 },
      { x: 13020, y: 262, baseY: 262, w: 76, h: 40, minX: 12680, maxX: 13370, speed: 132, facing: -1, ampY: 24, phase: 0.9 },
      { x: 16200, y: 260, baseY: 260, w: 76, h: 40, minX: 15840, maxX: 16580, speed: 134, facing: 1, ampY: 26, phase: 2.9 },
    ];

    // 4. Brienz Clockmaker Wind-Up Nutcracker Guards (Spinning brass key + saber; Meow unwinds them!)
    const swiss_nutcrackers = [
      { x: 7110, y: groundY - 68, w: 48, h: 68, minX: 7010, maxX: 7250, speed: 88, facing: 1, walkDist: 0 },
      { x: 14050, y: groundY - 68, w: 48, h: 68, minX: 13955, maxX: 14175, speed: 92, facing: -1, walkDist: 0 },
      { x: 19310, y: groundY - 68, w: 48, h: 68, minX: 19220, maxX: 19440, speed: 92, facing: 1, walkDist: 0 },
    ];

    // 5. Alpine Snow Foxes (Crouched stalk -> parabolic leap pounce across meadows!)
    const swiss_snow_foxes = [
      { x: 480, y: groundY - 40, w: 58, h: 40, minX: 290, maxX: 660, speed: 98, facing: -1, walkDist: 0 },
      { x: 10350, y: groundY - 40, w: 58, h: 40, minX: 10260, maxX: 10490, speed: 102, facing: 1, walkDist: 0 },
      { x: 13760, y: groundY - 40, w: 58, h: 40, minX: 13665, maxX: 13895, speed: 104, facing: -1, walkDist: 0 },
    ];

    // 6. Geneva Horological Skeleton-Watch Brass Owls (Unobstructed aerial lanes; Meow jams escapement!)
    const swiss_clockwork_owls = [
      { x: 4720, y: 382, baseY: 382, w: 56, h: 48, minX: 4620, maxX: 4865, speed: 92, facing: 1, phase: 0.3 },
      { x: 7650, y: 374, baseY: 374, w: 56, h: 48, minX: 7520, maxX: 7780, speed: 96, facing: -1, phase: 1.4 },
      { x: 17590, y: 372, baseY: 372, w: 56, h: 48, minX: 17480, maxX: 17720, speed: 98, facing: 1, phase: 2.3 },
    ];

    // 7. Friendly Alpine St. Bernard Rescue Companions (Warm greeting + mutual sit-and-play on Meow!)
    const swiss_st_bernards = [
      { x: 3980, y: groundY - 50, w: 66, h: 50, minX: 3915, maxX: 4080, facing: -1 },
      { x: 13510, y: groundY - 50, w: 66, h: 50, minX: 13445, maxX: 13605, facing: -1 },
      { x: 20265, y: groundY - 50, w: 66, h: 50, minX: 20205, maxX: 20345, facing: -1 },
    ];

    // 8. Close-Up Foreground Pasture Cows on the Lower Grassy Hillside (Closer to screen than Mashmasha -> Cat walks BEHIND them + 1-time Moo!)
    const swiss_foreground_cows = [
      { x: 2732, y: 694, w: 168, h: 112, breed: 'brown_white', variant: 1, facing: -1, pitch: 1.00, mooed: false, mooAnim: 0, phase: 0.3 },
      { x: 9065, y: 694, w: 168, h: 112, breed: 'black_white', variant: 1, facing: -1, pitch: 0.94, mooed: false, mooAnim: 0, phase: 1.7 },
      { x: 15340, y: 694, w: 168, h: 112, breed: 'brown_white', variant: 2, facing: 1, pitch: 1.05, mooed: false, mooAnim: 0, phase: 2.9 },
    ];

    return {
      id: 28,
      stage: 28,
      name: 'الريف السويسري • جبال الألب وماترهورن',
      nameEn: 'Swiss Countryside • Alps & Matterhorn',
      subtitle: 'قدر الفوندو، جرس الانهيار الثلجي، التلفريك، قطار غلاسيير، سانت برنارد وبومة الساعات',
      subtitleEn: 'Fondue Cauldron, Avalanche Bell, Cableway, Glacier Express, St. Bernard & Clockwork Owl',
      theme: 'swiss',
      swissOutfit: true,
      width: 20800,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 20380, y: 495, w: 148, h: 120 },
      goalLabel: 'محطة غريندلفالد • جبال الألب',
      goalLabelEn: 'GRINDELWALD • SWISS ALPS',
      platforms,
      checkpoints,
      treats,
      puddles,
      coins,
      rats: [],
      falcons: [],
      dogs: [],
      swiss_ibex,
      swiss_marmots,
      swiss_eagles,
      swiss_nutcrackers,
      swiss_snow_foxes,
      swiss_clockwork_owls,
      swiss_st_bernards,
      swiss_foreground_cows,
    };
  };
})();
