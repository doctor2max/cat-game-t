/* ============================================================================
   LEVEL 24: MAYAN JUNGLE TEMPLES & CHICHÉN ITZÁ (معابد المايا والغابة المطيرة)
   Grand Finale • 100% Exclusive Mayan Temple Challenges (Zero Repeated Mechanics!):
     1. maya_serpent_ring  — Chained Pok-Ta-Pok Serpent Launch Rings (parabolic comet arcs!)
     2. maya_twin_scale    — Linked Counterweight Mayan Gold Balance Scales!
     3. maya_rolling_wheel + maya_thorn_pit — Giant Rolling Stone Sun-Calendar Monoliths!
     4. maya_dart_totem    — Rhythmic Chaac Blowgun Darts (LOW = Jump, HIGH = Duck/Sneak, Meow shatters!)
     5. maya_serpent_spine — Living Kukulcán Undulating Serpent Wave + Equinox Solar Super-Leap!
     6. maya_glyph_seal + maya_vault_door — 3-Seal Sacred Kukulcán Stone Vault Finale!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel24 = function createLevel24() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // ZONE 1 (0 .. 2480): Pok-Ta-Pok Serpent Ring Plaza & Double-Ring Chasm
      // =====================================================================
      { x: 0, y: groundY, w: 1080, h: groundH, type: 'maya_stone_terrace' },
      // Intro Pok-Ta-Pok Serpent Ring launching Mashmasha up to the Sun Balcony!
      { x: 370, y: 492, w: 68, h: 68, type: 'maya_serpent_ring', nonSolid: true, targetX: 690, targetY: 360, arcHeight: 62, flightTime: 0.45 },
      { x: 630, y: 392, w: 230, h: 24, type: 'maya_stone_terrace', oneWay: true },
      // Chained Double Pok-Ta-Pok Serpent Rings across Sacred Cenote Gap 1 (1080 .. 1660)!
      { x: 1140, y: 486, w: 68, h: 68, type: 'maya_serpent_ring', nonSolid: true, targetX: 1414, targetY: 424, arcHeight: 64, flightTime: 0.44 },
      { x: 1380, y: 390, w: 68, h: 68, type: 'maya_serpent_ring', nonSolid: true, targetX: 1715, targetY: 545, arcHeight: 68, flightTime: 0.46 },
      { x: 1660, y: groundY, w: 820, h: groundH, type: 'maya_stone_terrace' },
      // Gentle intro Chaac Blowgun Totem (LOW amber darts -> jump over or shatter with Meow!)
      { x: 2150, y: groundY - 86, w: 46, h: 86, type: 'maya_dart_totem', nonSolid: true, fireDir: -1, dartMode: 'low', period: 2.45, dartSpeed: 295, maxRange: 380, phase: 0.2 },

      // =====================================================================
      // ZONE 2 (2480 .. 5080): Counterweight Mayan Gold Scales & High/Low Darts
      // =====================================================================
      { x: 2555, y: 556, w: 104, h: 24, type: 'maya_stone_terrace', oneWay: true },
      // Linked Counterweight Mayan Gold Scales #1 (weigh down Left Pan to hoist Right Pan!)
      { x: 2695, y: 505, w: 112, h: 20, type: 'maya_twin_scale', oneWay: true, scaleGroup: 'sc_1', panSide: -1, beamY: 235, maxShift: 52 },
      { x: 2925, y: 505, w: 112, h: 20, type: 'maya_twin_scale', oneWay: true, scaleGroup: 'sc_1', panSide: 1, beamY: 235, maxShift: 52 },
      { x: 3120, y: groundY, w: 1960, h: groundH, type: 'maya_stone_terrace' },
      // High Jade Altar reachable from the hoisted Right Gold Scale Pan!
      { x: 3145, y: 365, w: 230, h: 24, type: 'maya_stone_terrace', oneWay: true },
      // Alternating LOW (Jump) & HIGH (Duck/Sneak) Chaac Obsidian-Dart Corridor!
      { x: 4260, y: groundY - 86, w: 46, h: 86, type: 'maya_dart_totem', nonSolid: true, fireDir: -1, dartMode: 'alternate', period: 2.30, dartSpeed: 305, maxRange: 430, phase: 0.8 },

      // =====================================================================
      // ZONE 3 (5080 .. 7660): Rolling Mayan Sun-Calendar Monoliths & Thorn Pits
      // =====================================================================
      { x: 5080, y: groundY, w: 140, h: groundH, type: 'maya_stone_terrace' },
      // Sunken Thorn Trough #1 (5220 .. 5760) + Giant Rolling Stone Sun-Calendar Wheel #1!
      { x: 5220, y: groundY, w: 540, h: groundH, type: 'maya_stone_terrace' },
      { x: 5225, y: groundY - 18, w: 530, h: 18, type: 'maya_thorn_pit', nonSolid: true },
      { x: 5250, y: groundY - 92, w: 92, h: 92, type: 'maya_rolling_wheel', oneWay: true, minX: 5225, maxX: 5665, speed: 118, dir: 1 },
      { x: 5760, y: groundY, w: 720, h: groundH, type: 'maya_stone_terrace' },
      // Sunken Thorn Trough #2 (6480 .. 7140) — Twin Meeting Rolling Calendar Monoliths!
      { x: 6480, y: groundY, w: 660, h: groundH, type: 'maya_stone_terrace' },
      { x: 6485, y: groundY - 18, w: 650, h: 18, type: 'maya_thorn_pit', nonSolid: true },
      { x: 6500, y: groundY - 92, w: 92, h: 92, type: 'maya_rolling_wheel', oneWay: true, minX: 6485, maxX: 6710, speed: 122, dir: 1 },
      { x: 7020, y: groundY - 92, w: 92, h: 92, type: 'maya_rolling_wheel', oneWay: true, minX: 6818, maxX: 7045, speed: 122, dir: -1 },
      { x: 7140, y: groundY, w: 520, h: groundH, type: 'maya_stone_terrace' },

      // =====================================================================
      // ZONE 4 (7660 .. 10380): Living Kukulcán Undulating Serpent Wave Bridge
      // =====================================================================
      // 7-Segment Living Feathered-Serpent Spine + Traveling Golden Equinox Solar Crest!
      { x: 7700, y: 536, w: 88, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 0, totalSegments: 7, waveAmp: 26 },
      { x: 7806, y: 536, w: 88, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 1, totalSegments: 7, waveAmp: 26 },
      { x: 7912, y: 536, w: 88, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 2, totalSegments: 7, waveAmp: 26 },
      { x: 8018, y: 536, w: 88, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 3, totalSegments: 7, waveAmp: 26 },
      { x: 8124, y: 536, w: 88, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 4, totalSegments: 7, waveAmp: 26 },
      { x: 8230, y: 536, w: 88, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 5, totalSegments: 7, waveAmp: 26 },
      { x: 8336, y: 536, w: 88, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 6, totalSegments: 7, waveAmp: 26 },
      // Sky Shrine above Serpent Bridge (reachable via Golden Equinox Solar Crest Super-Leap!)
      { x: 7980, y: 345, w: 190, h: 24, type: 'maya_stone_terrace', oneWay: true },
      { x: 8460, y: groundY, w: 1920, h: groundH, type: 'maya_stone_terrace' },
      { x: 9240, y: 495, w: 180, h: 24, type: 'maya_stone_terrace', oneWay: true },
      { x: 9540, y: groundY - 86, w: 46, h: 86, type: 'maya_dart_totem', nonSolid: true, fireDir: -1, dartMode: 'alternate', period: 2.20, dartSpeed: 312, maxRange: 430, phase: 1.5 },

      // =====================================================================
      // ZONE 5 (10380 .. 12920): Master Mayan Gauntlet (Rings + Wheel + Serpent)
      // =====================================================================
      // Double Pok-Ta-Pok Serpent Ring Chain across Gap 5A (10380 .. 10960)
      { x: 10445, y: 486, w: 68, h: 68, type: 'maya_serpent_ring', nonSolid: true, targetX: 10724, targetY: 414, arcHeight: 62, flightTime: 0.44 },
      { x: 10690, y: 380, w: 68, h: 68, type: 'maya_serpent_ring', nonSolid: true, targetX: 11015, targetY: 545, arcHeight: 66, flightTime: 0.46 },
      { x: 10960, y: groundY, w: 300, h: groundH, type: 'maya_stone_terrace' },
      // Sunken Thorn Trough #3 (11260 .. 11780) + Rolling Calendar Monolith #3
      { x: 11260, y: groundY, w: 520, h: groundH, type: 'maya_stone_terrace' },
      { x: 11265, y: groundY - 18, w: 510, h: 18, type: 'maya_thorn_pit', nonSolid: true },
      { x: 11290, y: groundY - 92, w: 92, h: 92, type: 'maya_rolling_wheel', oneWay: true, minX: 11265, maxX: 11680, speed: 128, dir: 1 },
      { x: 11780, y: groundY, w: 360, h: groundH, type: 'maya_stone_terrace' },
      // 6-Segment Living Kukulcán Serpent Spine #2 across Cenote Gap 5B (12140 .. 12920)
      { x: 12180, y: 536, w: 92, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 0, totalSegments: 6, waveAmp: 28 },
      { x: 12296, y: 536, w: 92, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 1, totalSegments: 6, waveAmp: 28 },
      { x: 12412, y: 536, w: 92, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 2, totalSegments: 6, waveAmp: 28 },
      { x: 12528, y: 536, w: 92, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 3, totalSegments: 6, waveAmp: 28 },
      { x: 12644, y: 536, w: 92, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 4, totalSegments: 6, waveAmp: 28 },
      { x: 12760, y: 536, w: 92, h: 24, type: 'maya_serpent_spine', oneWay: true, segmentIdx: 5, totalSegments: 6, waveAmp: 28 },

      // =====================================================================
      // ZONE 6 (12920 .. 15000): The 3 Sacred Seals & Kukulcán Stone Vault!
      // =====================================================================
      { x: 12920, y: groundY, w: 2080, h: groundH, type: 'maya_stone_terrace' },
      // Seal 0 (Sun ☀️): Linked Gold Balance Scales #2 -> Upper Sun Altar!
      { x: 13250, y: 515, w: 108, h: 20, type: 'maya_twin_scale', oneWay: true, scaleGroup: 'sc_2', panSide: -1, beamY: 245, maxShift: 50 },
      { x: 13465, y: 515, w: 108, h: 20, type: 'maya_twin_scale', oneWay: true, scaleGroup: 'sc_2', panSide: 1, beamY: 245, maxShift: 50 },
      { x: 13480, y: 392, w: 130, h: 24, type: 'maya_stone_terrace', oneWay: true },
      { x: 13523, y: 332, w: 44, h: 44, type: 'maya_glyph_seal', nonSolid: true, vaultId: 'kukulcan_vault', sealIdx: 0 },
      // Seal 1 (Jaguar 🐆): Lower Chaac Dart Corridor!
      { x: 13830, y: 552, w: 44, h: 44, type: 'maya_glyph_seal', nonSolid: true, vaultId: 'kukulcan_vault', sealIdx: 1 },
      { x: 14030, y: groundY - 86, w: 46, h: 86, type: 'maya_dart_totem', nonSolid: true, fireDir: -1, dartMode: 'alternate', period: 2.35, dartSpeed: 300, maxRange: 340, phase: 0.5 },
      // Seal 2 (Quetzal 🦜): Pok-Ta-Pok Serpent Launch Ring -> Upper Quetzal Balcony!
      { x: 14095, y: 486, w: 68, h: 68, type: 'maya_serpent_ring', nonSolid: true, targetX: 14255, targetY: 358, arcHeight: 58, flightTime: 0.42 },
      { x: 14190, y: 392, w: 130, h: 24, type: 'maya_stone_terrace', oneWay: true },
      { x: 14233, y: 332, w: 44, h: 44, type: 'maya_glyph_seal', nonSolid: true, vaultId: 'kukulcan_vault', sealIdx: 2 },
      // Monumental Carved Mayan Vault Door + Upper Temple Lintel Wall guarding the Grand Exit!
      { x: 14375, y: 250, w: 48, h: 175, type: 'maya_stone_terrace' },
      { x: 14375, y: 425, w: 48, h: 190, type: 'maya_vault_door', vaultId: 'kukulcan_vault', unlocked: false },
    ];

    // 5 Flush Mayan Temple Sanctuary Checkpoints (0 overlaps with enemies or darts!)
    const checkpoints = [
      { x: 2340, y: 583, w: 44, h: 32, activated: false },
      { x: 4900, y: 583, w: 44, h: 32, activated: false },
      { x: 7460, y: 583, w: 44, h: 32, activated: false },
      { x: 10210, y: 583, w: 44, h: 32, activated: false },
      { x: 13030, y: 583, w: 44, h: 32, activated: false },
    ];

    // 10 Collectible Fish Treats rewarding mastery of every new Mayan mechanic!
    const treats = [
      { x: 745, y: 344, collected: false },
      { x: 3260, y: 320, collected: false },
      { x: 4040, y: 495, collected: false },
      { x: 5490, y: 445, collected: false },
      { x: 6810, y: 430, collected: false },
      { x: 8075, y: 300, collected: false },
      { x: 9330, y: 448, collected: false },
      { x: 11520, y: 438, collected: false },
      { x: 12540, y: 365, collected: false },
      { x: 14255, y: 282, collected: false },
    ];

    // 6 Sleek Yucatán Jaguars (strictly on solid ground terraces, 0 checkpoint overlaps!)
    const maya_jaguars = [
      { x: 740, y: 573, w: 58, h: 42, minX: 580, maxX: 990, speed: 108, facing: 1, walkDist: 0 },
      { x: 4480, y: 573, w: 58, h: 42, minX: 4340, maxX: 4680, speed: 114, facing: -1, walkDist: 0 },
      { x: 8680, y: 573, w: 58, h: 42, minX: 8540, maxX: 8960, speed: 118, facing: 1, walkDist: 0 },
      { x: 9780, y: 573, w: 58, h: 42, minX: 9610, maxX: 9990, speed: 122, facing: -1, walkDist: 0 },
      { x: 11900, y: 573, w: 58, h: 42, minX: 11810, maxX: 12050, speed: 124, facing: 1, walkDist: 0 },
      { x: 13740, y: 573, w: 58, h: 42, minX: 13620, maxX: 13930, speed: 126, facing: -1, walkDist: 0 },
    ];

    // 6 Adult Mayan Jaguar Temple Guardians (strictly on solid ground terraces, 0 checkpoint overlaps!)
    const maya_warriors = [
      { x: 1880, y: 539, w: 50, h: 76, minX: 1720, maxX: 2040, speed: 78, facing: -1, walkDist: 0 },
      { x: 3520, y: 539, w: 50, h: 76, minX: 3320, maxX: 3720, speed: 82, facing: 1, walkDist: 0 },
      { x: 6080, y: 539, w: 50, h: 76, minX: 5830, maxX: 6360, speed: 84, facing: -1, walkDist: 0 },
      { x: 9180, y: 539, w: 50, h: 76, minX: 9020, maxX: 9380, speed: 86, facing: 1, walkDist: 0 },
      { x: 11080, y: 539, w: 50, h: 76, minX: 10990, maxX: 11180, speed: 88, facing: -1, walkDist: 0 },
      { x: 13380, y: 539, w: 50, h: 76, minX: 13260, maxX: 13560, speed: 90, facing: 1, walkDist: 0 },
    ];

    // 6 Iridescent Resplendent Quetzal Birds (high canopy glide, 0 swoop-diving!)
    const maya_quetzals = [
      { x: 1340, y: 230, w: 48, h: 28, minX: 1120, maxX: 1600, baseY: 230, ampY: 22, speed: 115, facing: 1, phase: 0.2 },
      { x: 2860, y: 235, w: 48, h: 28, minX: 2620, maxX: 3100, baseY: 235, ampY: 24, speed: 120, facing: -1, phase: 1.4 },
      { x: 6100, y: 250, w: 48, h: 28, minX: 5780, maxX: 6420, baseY: 250, ampY: 24, speed: 124, facing: 1, phase: 2.3 },
      { x: 8080, y: 235, w: 48, h: 28, minX: 7780, maxX: 8380, baseY: 235, ampY: 24, speed: 126, facing: -1, phase: 0.9 },
      { x: 10680, y: 225, w: 48, h: 28, minX: 10420, maxX: 10940, baseY: 225, ampY: 22, speed: 130, facing: 1, phase: 1.9 },
      { x: 12510, y: 245, w: 48, h: 28, minX: 12200, maxX: 12820, baseY: 245, ampY: 24, speed: 132, facing: -1, phase: 2.8 },
    ];

    return {
      id: 24,
      name: 'معابد المايا • تشيتشن إيتزا',
      nameEn: 'Mayan Temples • Chichén Itzá',
      subtitle: 'أهرامات المايا والغابة المطيرة',
      subtitleEn: 'Yucatán Rainforest & Pyramid of Kukulcán',
      theme: 'maya',
      mayaOutfit: true,
      width: 15000,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 14600, y: 495, w: 128, h: 120 },
      goalLabel: 'هرم كوكولكان • المايا',
      goalLabelEn: 'EL CASTILLO • MAYA',
      platforms,
      checkpoints,
      treats,
      puddles: [],
      coins: [],
      rats: [],
      falcons: [],
      dogs: [],
      maya_jaguars,
      maya_warriors,
      maya_quetzals,
    };
  };
})();
