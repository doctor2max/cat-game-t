/* ============================================================================
   LEVEL 25: SANTORINI & ACROPOLIS, GREECE (جزر اليونان • سانتوريني والأكروبوليس)
   Silver Jubilee Stage • 100% Exclusive Ancient Greek Mechanics & Mythological Obstacles:
     1. greece_sun_mirror + greece_light_bridge — Archimedes Solar Mirrors projecting solid Golden Light Bridges!
     2. greece_chariot_track  — Trigger-driven Bronze Olympic Chariots gliding across Aegean chasms!
     3. greece_poseidon_wave  — Periodic Aegean Poseidon Sea-Wave Updrafts with foam telegraphs!
     4. greece_lyre_pillar + greece_marble_lift — Apollo Golden Lyres raising Marble Sanctuary Lifts!
     5. greece_crumble_column — Weathered Doric Marble Columns that crack & crumble underfoot!
     6. greece_medusa_aegis   — Gorgoneion Medusa Shield: petrifying gaze cone (turn away, crouch low, or Meow to blind!)
     7. greece_discobolus     — Bronze Olympic Discus Thrower: hurls a low-outward / high-return Boomerang Discus!
     8. greece_zeus_obelisk   — Altar of Zeus Obelisk: summons target-locking sky thunderbolts onto the marble promenade!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};

  window.Game.createLevel25 = function createLevel25() {
    const groundY = 615;
    const groundH = 105;

    const platforms = [
      // =====================================================================
      // ZONE 1 (0 .. 2520): Oia Caldera Promenade, Medusa Aegis #1 & Discobolus #1
      // =====================================================================
      { x: 0, y: groundY, w: 1120, h: groundH, type: 'greece_terrace' },
      // Gorgoneion Medusa Aegis #1 (introduces Gaze-Check: look away, crouch under, or jump onto balcony!)
      { x: 415, y: groundY - 68, w: 44, h: 68, type: 'greece_medusa_aegis', nonSolid: true, gazeDir: -1, gazeRange: 210, period: 4.6, phase: 0.4 },
      { x: 460, y: 505, w: 190, h: 24, type: 'greece_terrace', oneWay: true },
      // Archimedes Solar Mirror #1 -> projects Golden Light Bridge across Aegean Gap 1 (1120 .. 1540)!
      { x: 1015, y: groundY - 58, w: 46, h: 58, type: 'greece_sun_mirror', nonSolid: true, bridgeId: 'gr_br_1', duration: 9.5 },
      { x: 1135, y: 598, w: 390, h: 20, type: 'greece_light_bridge', oneWay: true, bridgeId: 'gr_br_1', activeTimer: 0 },
      { x: 1540, y: groundY, w: 980, h: groundH, type: 'greece_terrace' },
      // Upper Bougainvillea Terrace with bonus fish (comfortable 70px -> 75px step!)
      { x: 1680, y: 545, w: 115, h: 22, type: 'greece_crumble_column', oneWay: true },
      { x: 1840, y: 470, w: 220, h: 24, type: 'greece_terrace', oneWay: true },
      // Bronze Olympic Discobolus #1 (hurls Boomerang Discus across 1985..2230 — jump outward, crouch return!)
      { x: 2230, y: groundY - 72, w: 48, h: 72, type: 'greece_discobolus', nonSolid: true, throwDir: -1, throwDist: 245, period: 4.0, phase: 0.2 },

      // =====================================================================
      // ZONE 2 (2520 .. 5140): Bronze Olympic Chariot, Poseidon Wave & Zeus Obelisk #1
      // =====================================================================
      // Olympic Bronze Chariot #1 carries Mashmasha smoothly across Aegean Strait 2 (2520 .. 3180)!
      { x: 2560, y: 576, w: 124, h: 24, type: 'greece_chariot_track', oneWay: true, startX: 2560, endX: 3040, speed: 175 },
      { x: 3180, y: groundY, w: 1060, h: groundH, type: 'greece_terrace' },
      // Poseidon Sea-Wave Updraft #1 (full vertical column 345..615!) lifting up to High Marble Shrine (y=370)!
      { x: 3560, y: groundY - 270, w: 74, h: 270, type: 'greece_poseidon_wave', nonSolid: true, liftHeight: 270, liftForce: 1320, phase: 0.3 },
      { x: 3710, y: 370, w: 230, h: 24, type: 'greece_terrace', oneWay: true },
      // Altar of Zeus Sky-Lightning Obelisk #1 (target-locks floor position — keep moving to bait & dodge!)
      { x: 4075, y: groundY - 78, w: 44, h: 78, type: 'greece_zeus_obelisk', nonSolid: true, zoneRadius: 195, cooldown: 2.6 },
      // Crumbling Doric Columns over Aegean Cove 2B (4240 .. 4660)
      { x: 4290, y: 565, w: 120, h: 22, type: 'greece_crumble_column', oneWay: true },
      { x: 4480, y: 535, w: 120, h: 22, type: 'greece_crumble_column', oneWay: true },
      { x: 4660, y: groundY, w: 480, h: groundH, type: 'greece_terrace' },

      // =====================================================================
      // ZONE 3 (5140 .. 7760): Apollo's Golden Lyre, Marble Lift & Discobolus #2
      // =====================================================================
      // Apollo Lyre #1 raises Marble Lift #1 across Cliff Gap 3A (5140 .. 5640)
      { x: 5040, y: groundY - 58, w: 44, h: 58, type: 'greece_lyre_pillar', nonSolid: true, liftId: 'gr_lift_1', duration: 10.5 },
      { x: 5200, y: 590, w: 150, h: 24, type: 'greece_marble_lift', oneWay: true, liftId: 'gr_lift_1', baseY: 590, targetY: 420 },
      { x: 5430, y: 420, w: 165, h: 24, type: 'greece_terrace', oneWay: true },
      { x: 5640, y: groundY, w: 1220, h: groundH, type: 'greece_terrace' },
      // Elevated Amphitheater Balcony (comfortable 110px jump from groundY=615!)
      { x: 6120, y: 505, w: 220, h: 24, type: 'greece_terrace', oneWay: true },
      // Bronze Olympic Discobolus #2 guarding lower promenade beneath the Amphitheater Balcony!
      { x: 6355, y: groundY - 72, w: 48, h: 72, type: 'greece_discobolus', nonSolid: true, throwDir: -1, throwDist: 255, period: 3.9, phase: 1.1 },
      // Archimedes Solar Mirror #2 -> Double Golden Light Bridge over Cove 3B (6860 .. 7360)
      { x: 6765, y: groundY - 58, w: 46, h: 58, type: 'greece_sun_mirror', nonSolid: true, bridgeId: 'gr_br_2', duration: 10.0 },
      { x: 6880, y: 582, w: 215, h: 20, type: 'greece_light_bridge', oneWay: true, bridgeId: 'gr_br_2', activeTimer: 0 },
      { x: 7130, y: 552, w: 215, h: 20, type: 'greece_light_bridge', oneWay: true, bridgeId: 'gr_br_2', activeTimer: 0 },
      { x: 7360, y: groundY, w: 400, h: groundH, type: 'greece_terrace' },

      // =====================================================================
      // ZONE 4 (7760 .. 10340): Twin Poseidon Waves, Medusa Aegis #2 & Zeus Obelisk #2
      // =====================================================================
      { x: 7810, y: 585, w: 115, h: 22, type: 'greece_crumble_column', oneWay: true },
      // Grounded Santorini Marble Jetty supporting Poseidon Wave #2 (zero floating geyser!)
      { x: 7945, y: groundY, w: 155, h: groundH, type: 'greece_terrace' },
      { x: 7985, y: groundY - 275, w: 74, h: 275, type: 'greece_poseidon_wave', nonSolid: true, liftHeight: 275, liftForce: 1340, phase: 0.9 },
      { x: 8130, y: 385, w: 210, h: 24, type: 'greece_terrace', oneWay: true },
      { x: 8395, y: 465, w: 130, h: 22, type: 'greece_crumble_column', oneWay: true },
      { x: 8580, y: groundY, w: 1760, h: groundH, type: 'greece_terrace' },
      // Gorgoneion Medusa Aegis #2 before the Windmill Balcony!
      { x: 9195, y: groundY - 68, w: 44, h: 68, type: 'greece_medusa_aegis', nonSolid: true, gazeDir: -1, gazeRange: 220, period: 4.4, phase: 1.5 },
      // Comfortable 110px jump balcony
      { x: 9260, y: 505, w: 210, h: 24, type: 'greece_terrace', oneWay: true },
      // Poseidon Wave #3 (full vertical column 345..615!) lifting to High Balcony (y=375)!
      { x: 9560, y: groundY - 270, w: 74, h: 270, type: 'greece_poseidon_wave', nonSolid: true, liftHeight: 270, liftForce: 1320, phase: 1.7 },
      { x: 9700, y: 375, w: 200, h: 24, type: 'greece_terrace', oneWay: true },
      // Altar of Zeus Obelisk #2 on the lower promenade (well clear of Checkpoint #4 at 10180!)
      { x: 9860, y: groundY - 78, w: 44, h: 78, type: 'greece_zeus_obelisk', nonSolid: true, zoneRadius: 200, cooldown: 2.5 },

      // =====================================================================
      // ZONE 5 (10340 .. 12480): Grand Olympic Chariot, Discobolus #3 & Solar Bridge
      // =====================================================================
      // Olympic Bronze Chariot #2 across Grand Bay 5A (10340 .. 11040)
      { x: 10380, y: 572, w: 124, h: 24, type: 'greece_chariot_track', oneWay: true, startX: 10380, endX: 10900, speed: 185 },
      { x: 11040, y: groundY, w: 780, h: groundH, type: 'greece_terrace' },
      // Bronze Olympic Discobolus #3 guarding approach to Solar Mirror #3!
      { x: 11640, y: groundY - 72, w: 48, h: 72, type: 'greece_discobolus', nonSolid: true, throwDir: -1, throwDist: 250, period: 3.8, phase: 0.7 },
      // Archimedes Solar Mirror #3 -> Stepped Light Bridge + Crumble Column over Bay 5B (11820 .. 12480)
      { x: 11725, y: groundY - 58, w: 46, h: 58, type: 'greece_sun_mirror', nonSolid: true, bridgeId: 'gr_br_3', duration: 10.5 },
      { x: 11845, y: 575, w: 260, h: 20, type: 'greece_light_bridge', oneWay: true, bridgeId: 'gr_br_3', activeTimer: 0 },
      { x: 12165, y: 530, w: 120, h: 22, type: 'greece_crumble_column', oneWay: true },
      { x: 12325, y: 565, w: 120, h: 22, type: 'greece_crumble_column', oneWay: true },

      // =====================================================================
      // ZONE 6 (12480 .. 15000): Ascent to the Acropolis, Medusa #3, Zeus #3 & Parthenon!
      // =====================================================================
      // Single continuous Acropolis marble promenade (zero floor seam at 12960!)
      { x: 12480, y: groundY, w: 2520, h: groundH, type: 'greece_terrace' },
      // Apollo Lyre #2 raises Sanctuary Lift #2 to the Golden Laurel Sky Terrace!
      { x: 13390, y: groundY - 58, w: 44, h: 58, type: 'greece_lyre_pillar', nonSolid: true, liftId: 'gr_lift_2', duration: 10.5 },
      { x: 13490, y: 590, w: 150, h: 24, type: 'greece_marble_lift', oneWay: true, liftId: 'gr_lift_2', baseY: 590, targetY: 390 },
      { x: 13690, y: 390, w: 240, h: 24, type: 'greece_terrace', oneWay: true },
      // Gorgoneion Medusa Aegis #3 on the Sacred Way of the Acropolis!
      { x: 13990, y: groundY - 68, w: 44, h: 68, type: 'greece_medusa_aegis', nonSolid: true, gazeDir: -1, gazeRange: 225, period: 4.3, phase: 2.3 },
      { x: 14040, y: 500, w: 180, h: 24, type: 'greece_terrace', oneWay: true },
      // Final Altar of Zeus Sky-Lightning Obelisk #3 before the Parthenon Sanctuary Gate!
      { x: 14375, y: groundY - 78, w: 44, h: 78, type: 'greece_zeus_obelisk', nonSolid: true, zoneRadius: 185, cooldown: 2.4 },
    ];

    // 5 Flush Santorini Sanctuary Checkpoints (y = 583, 100% enemy-free!)
    const checkpoints = [
      { x: 2380, y: 583, w: 44, h: 32, activated: false },
      { x: 4920, y: 583, w: 44, h: 32, activated: false },
      { x: 7580, y: 583, w: 44, h: 32, activated: false },
      { x: 10180, y: 583, w: 44, h: 32, activated: false },
      { x: 13080, y: 583, w: 44, h: 32, activated: false },
    ];

    // 10 Collectible Fish Treats across Santorini balconies & Acropolis heights!
    const treats = [
      { x: 555, y: 458, collected: false },
      { x: 1950, y: 422, collected: false },
      { x: 2860, y: 510, collected: false },
      { x: 3825, y: 322, collected: false },
      { x: 5510, y: 372, collected: false },
      { x: 6230, y: 458, collected: false },
      { x: 8235, y: 338, collected: false },
      { x: 9800, y: 328, collected: false },
      { x: 10700, y: 505, collected: false },
      { x: 13810, y: 342, collected: false },
    ];

    // 6 Cretan Mountain Goats (Kri-Kri — enlarged majestic mountain ibex, walkDist legs, clean non-overlapping patrol spans!)
    const greece_goats = [
      { x: 760, y: 553, w: 76, h: 62, minX: 600, maxX: 950, speed: 98, facing: 1, walkDist: 0 },
      { x: 3360, y: 553, w: 76, h: 62, minX: 3230, maxX: 3510, speed: 104, facing: -1, walkDist: 0 },
      { x: 5900, y: 553, w: 76, h: 62, minX: 5720, maxX: 6060, speed: 108, facing: 1, walkDist: 0 },
      { x: 8780, y: 553, w: 76, h: 62, minX: 8630, maxX: 8940, speed: 112, facing: -1, walkDist: 0 },
      { x: 11220, y: 553, w: 76, h: 62, minX: 11090, maxX: 11360, speed: 116, facing: 1, walkDist: 0 },
      { x: 13680, y: 553, w: 76, h: 62, minX: 13540, maxX: 13750, speed: 118, facing: -1, walkDist: 0 },
    ];

    // 6 Ancient Greek Hoplite Guardians (Corinthian plumed helmet, bronze shield, walkDist stride!)
    const greece_hoplites = [
      { x: 1780, y: 539, w: 48, h: 76, minX: 1600, maxX: 1940, speed: 74, facing: -1, walkDist: 0 },
      { x: 3780, y: 539, w: 48, h: 76, minX: 3660, maxX: 3880, speed: 78, facing: 1, walkDist: 0 },
      { x: 6520, y: 539, w: 48, h: 76, minX: 6420, maxX: 6690, speed: 80, facing: -1, walkDist: 0 },
      { x: 9360, y: 539, w: 48, h: 76, minX: 9260, maxX: 9500, speed: 82, facing: 1, walkDist: 0 },
      { x: 12680, y: 539, w: 48, h: 76, minX: 12540, maxX: 12880, speed: 84, facing: -1, walkDist: 0 },
      { x: 14120, y: 539, w: 48, h: 76, minX: 14040, maxX: 14210, speed: 86, facing: 1, walkDist: 0 },
    ];

    // 6 Golden Owls of Athena (smooth high-canopy Aegean glide!)
    const greece_owls = [
      { x: 1320, y: 245, w: 46, h: 30, minX: 1120, maxX: 1540, baseY: 245, ampY: 20, speed: 110, facing: 1, phase: 0.4 },
      { x: 2860, y: 235, w: 46, h: 30, minX: 2560, maxX: 3140, baseY: 235, ampY: 22, speed: 115, facing: -1, phase: 1.5 },
      { x: 5380, y: 225, w: 46, h: 30, minX: 5160, maxX: 5620, baseY: 225, ampY: 20, speed: 118, facing: 1, phase: 2.2 },
      { x: 7110, y: 240, w: 46, h: 30, minX: 6860, maxX: 7340, baseY: 240, ampY: 22, speed: 122, facing: -1, phase: 0.8 },
      { x: 10680, y: 230, w: 46, h: 30, minX: 10360, maxX: 11000, baseY: 230, ampY: 22, speed: 125, facing: 1, phase: 1.9 },
      { x: 12160, y: 235, w: 46, h: 30, minX: 11840, maxX: 12460, baseY: 235, ampY: 20, speed: 128, facing: -1, phase: 2.7 },
    ];

    return {
      id: 25,
      name: 'جزر اليونان • سانتوريني والأكروبوليس',
      nameEn: 'Greek Islands • Santorini & Acropolis',
      subtitle: 'القباب الزرقاء ومعبد البارثينون',
      subtitleEn: 'Aegean Blue Domes & The Parthenon',
      theme: 'greece',
      greeceOutfit: true,
      width: 15000,
      height: 720,
      startX: 110,
      startY: groundY - 50,
      spawn: { x: 110, y: groundY - 46 },
      goal: { x: 14580, y: 495, w: 128, h: 120 },
      goalLabel: 'معبد الأكروبوليس • اليونان',
      goalLabelEn: 'ACROPOLIS • GREECE',
      platforms,
      checkpoints,
      treats,
      puddles: [],
      coins: [],
      rats: [],
      falcons: [],
      dogs: [],
      greece_goats,
      greece_hoplites,
      greece_owls,
    };
  };
})();
