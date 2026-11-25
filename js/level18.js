window.Game = window.Game || {};

window.Game.createLevel18 = function () {
  const width = 11400;
  const height = 720;

  // Stage 18: Golden Sahara Oasis (الصحراء الذهبية والواحة)
  // 8 Escalating Desert Canyon & Oasis Zones (11,400px) with 4 Innovative Mechanics:
  // 1. Quicksand Sink-and-Struggle Pits (quicksand): pulls Mashmasha down & slows movement — jump repeatedly to escape!
  // 2. Thermal Desert Updraft Geysers (thermal_updraft): periodic rising hot-air columns lifting Mashmasha to high cliffs!
  // 3. Crumbling Ancient Sandstone Bridges (crumble_sandstone) & Elastic Oasis Palm Frond Pads (oasis_palm_bounce)
  // 4. New Desert Creatures: Ambush Scorpions (burrow & snap), Stealth Horned Sand Vipers (crouch to sneak),
  //    Swooping Desert Falcons (telegraphed dive attacks), and Spinning Sand Dust Devils!
  const platforms = [
    // 8 Sunlit Sandstone & Dune Ground Spans with True Recessed Quicksand Basins (flush at y: 630, h: 90!)
    { x: 0, y: 630, w: 520, h: 90, type: 'sand_deck', climbable: false },
    { x: 520, y: 630, w: 190, h: 90, type: 'quicksand', oneWay: true },
    { x: 710, y: 630, w: 310, h: 90, type: 'sand_deck', climbable: false },
    { x: 1320, y: 630, w: 1040, h: 90, type: 'sand_deck', climbable: false },
    { x: 2680, y: 630, w: 360, h: 90, type: 'sand_deck', climbable: false },
    { x: 3040, y: 630, w: 240, h: 90, type: 'quicksand', oneWay: true },
    { x: 3280, y: 630, w: 460, h: 90, type: 'sand_deck', climbable: false },
    { x: 4080, y: 630, w: 1080, h: 90, type: 'sand_deck', climbable: false },
    { x: 5500, y: 630, w: 770, h: 90, type: 'sand_deck', climbable: false },
    { x: 6270, y: 630, w: 220, h: 90, type: 'quicksand', oneWay: true },
    { x: 6490, y: 630, w: 70, h: 90, type: 'sand_deck', climbable: false },
    { x: 6900, y: 630, w: 1060, h: 90, type: 'sand_deck', climbable: false },
    { x: 8300, y: 630, w: 400, h: 90, type: 'sand_deck', climbable: false },
    { x: 8700, y: 630, w: 220, h: 90, type: 'quicksand', oneWay: true },
    { x: 8920, y: 630, w: 460, h: 90, type: 'sand_deck', climbable: false },
    { x: 9720, y: 630, w: 1680, h: 90, type: 'sand_deck', climbable: false },

    // ZONE 1 (0..1320): Desert Gateway — First Quicksand Crossing & Oasis Palm Spring
    { x: 320, y: 545, w: 150, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 575, y: 470, w: 120, h: 20, type: 'crumble_sandstone', oneWay: true },
    { x: 830, y: 586, w: 96, h: 44, type: 'oasis_palm_bounce', oneWay: true, bouncy: true },
    { x: 980, y: 420, w: 190, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 1175, y: 525, w: 130, h: 20, type: 'crumble_sandstone', oneWay: true },

    // ZONE 2 (1320..2680): Thermal Canyon & Ancient Sandstone Pillars (Secret Treat 1!)
    { x: 1470, y: 540, w: 130, h: 22, type: 'sandstone_ledge', oneWay: true },
    { x: 1660, y: 270, w: 120, h: 360, type: 'thermal_updraft', oneWay: false, phase: 0.2, liftForce: 1220 },
    { x: 1580, y: 275, w: 185, h: 24, type: 'sandstone_ledge', oneWay: true }, // Secret Treat 1 perch!
    { x: 1850, y: 425, w: 165, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 2080, y: 515, w: 145, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 2385, y: 545, w: 145, h: 20, type: 'crumble_sandstone', oneWay: true },
    { x: 2545, y: 485, w: 135, h: 24, type: 'sandstone_ledge', oneWay: true },

    // ZONE 3 (2680..4080): Viper's Oasis & Quicksand Basin
    { x: 2820, y: 535, w: 155, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 3110, y: 465, w: 145, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 3360, y: 586, w: 96, h: 44, type: 'oasis_palm_bounce', oneWay: true, bouncy: true },
    { x: 3500, y: 395, w: 175, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 3770, y: 520, w: 145, h: 20, type: 'crumble_sandstone', oneWay: true },
    { x: 3930, y: 470, w: 140, h: 24, type: 'sandstone_ledge', oneWay: true },

    // ZONE 4 (4080..5500): Twin Obelisk Wall-Climb & Thermal Ride
    { x: 4270, y: 430, w: 46, h: 200, type: 'sandstone_wall', climbable: true },
    { x: 4370, y: 405, w: 170, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 4620, y: 310, w: 125, h: 320, type: 'thermal_updraft', oneWay: false, phase: 1.4, liftForce: 1220 },
    { x: 4790, y: 365, w: 160, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 5000, y: 505, w: 155, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 5210, y: 540, w: 135, h: 20, type: 'crumble_sandstone', oneWay: true },
    { x: 5360, y: 485, w: 135, h: 24, type: 'sandstone_ledge', oneWay: true },

    // ZONE 5 (5500..6900): Falcon Ridge & Sunken Temple Ruins (Secret Treat 2!)
    { x: 5660, y: 535, w: 145, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 5860, y: 586, w: 96, h: 44, type: 'oasis_palm_bounce', oneWay: true, bouncy: true },
    { x: 5720, y: 425, w: 120, h: 22, type: 'sandstone_ledge', oneWay: true },
    { x: 5820, y: 325, w: 175, h: 24, type: 'sandstone_ledge', oneWay: true }, // Secret Treat 2 perch (reachable via palm bounce or stepping ledge!)
    { x: 6040, y: 410, w: 165, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 6320, y: 475, w: 135, h: 20, type: 'crumble_sandstone', oneWay: true },
    { x: 6585, y: 535, w: 150, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 6755, y: 475, w: 135, h: 24, type: 'sandstone_ledge', oneWay: true },

    // ZONE 6 (6900..8300): Shifting Sands & Dust Devil Gauntlet
    { x: 7070, y: 525, w: 150, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 7300, y: 430, w: 130, h: 20, type: 'crumble_sandstone', oneWay: true },
    { x: 7500, y: 310, w: 130, h: 320, type: 'thermal_updraft', oneWay: false, phase: 2.1, liftForce: 1220 },
    { x: 7690, y: 375, w: 175, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 7930, y: 525, w: 150, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 8120, y: 500, w: 150, h: 20, type: 'crumble_sandstone', oneWay: true },

    // ZONE 7 (8300..9720): Royal Dune Crossing (Secret Treat 3!)
    { x: 8470, y: 535, w: 155, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 8745, y: 430, w: 165, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 8960, y: 350, w: 145, h: 24, type: 'sandstone_ledge', oneWay: true }, // Secret Treat 3 perch!
    { x: 9175, y: 586, w: 96, h: 44, type: 'oasis_palm_bounce', oneWay: true, bouncy: true },
    { x: 9380, y: 495, w: 145, h: 20, type: 'crumble_sandstone', oneWay: true },
    { x: 9560, y: 465, w: 140, h: 24, type: 'sandstone_ledge', oneWay: true },

    // ZONE 8 (9720..11400): Final Oasis Ascent & Golden Pyramid Oasis Sanctuary
    { x: 9920, y: 535, w: 150, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 10150, y: 310, w: 130, h: 320, type: 'thermal_updraft', oneWay: false, phase: 0.8, liftForce: 1220 },
    { x: 10340, y: 400, w: 175, h: 24, type: 'sandstone_ledge', oneWay: true },
    { x: 10580, y: 586, w: 96, h: 44, type: 'oasis_palm_bounce', oneWay: true, bouncy: true },
    { x: 10760, y: 385, w: 640, h: 335, type: 'sandstone_wall', climbable: true },
  ];

  const puddles = [];
  const dogs = [];

  // Desert Ambush Scorpions: larger commanding scale (74x48) grounded flush at y = 630!
  const scorpions = [
    { x: 350, y: 582, w: 74, h: 48, minX: 240, maxX: 480, homeX: 350, facing: -1, phase: 0.2 },
    { x: 1900, y: 582, w: 74, h: 48, minX: 1780, maxX: 2240, homeX: 1960, facing: -1, phase: 1.1 },
    { x: 4480, y: 582, w: 74, h: 48, minX: 4340, maxX: 4920, homeX: 4540, facing: -1, phase: 2.0 },
    { x: 7180, y: 582, w: 74, h: 48, minX: 7020, maxX: 7450, homeX: 7200, facing: 1, phase: 0.7 },
    { x: 9980, y: 582, w: 74, h: 48, minX: 9840, maxX: 10420, homeX: 10040, facing: -1, phase: 1.6 },
  ];

  // Stealth Horned Sand Vipers: coiled peacefully on warm stones; hiss & strike if Mashmasha runs past upright!
  const sand_vipers = [
    { x: 1430, y: 582, w: 76, h: 48, minX: 1340, maxX: 1620, homeX: 1430, facing: -1, phase: 0.4 },
    { x: 3550, y: 582, w: 76, h: 48, minX: 3440, maxX: 3720, homeX: 3550, facing: -1, phase: 1.3 },
    { x: 6070, y: 582, w: 76, h: 48, minX: 5950, maxX: 6230, homeX: 6070, facing: 1, phase: 2.2 },
    { x: 8510, y: 582, w: 76, h: 48, minX: 8380, maxX: 8660, homeX: 8510, facing: -1, phase: 0.9 },
  ];

  // Swooping Desert Falcons: patrol high skies & telegraph a dive when Mashmasha crosses beneath!
  const desert_falcons = [
    { x: 2150, y: 240, baseY: 240, w: 62, h: 38, minX: 1980, maxX: 2440, vx: 115, facing: 1, phase: 0.3, amp: 24 },
    { x: 3780, y: 235, baseY: 235, w: 62, h: 38, minX: 3520, maxX: 4000, vx: -120, facing: -1, phase: 1.4, amp: 26 },
    { x: 5760, y: 225, baseY: 225, w: 62, h: 38, minX: 5540, maxX: 6020, vx: 125, facing: 1, phase: 0.8, amp: 24 },
    { x: 7860, y: 235, baseY: 235, w: 62, h: 38, minX: 7620, maxX: 8140, vx: -125, facing: -1, phase: 2.1, amp: 26 },
    { x: 9340, y: 230, baseY: 230, w: 62, h: 38, minX: 9040, maxX: 9600, vx: 128, facing: 1, phase: 1.7, amp: 25 },
  ];

  // Spinning Sand Dust Devils: miniature desert whirlwinds patrolling dunes that toss Mashmasha if touched!
  const dust_devils = [
    { x: 2890, y: 550, w: 46, h: 80, minX: 2740, maxX: 3000, vx: 95, phase: 0.2 },
    { x: 5040, y: 550, w: 46, h: 80, minX: 4840, maxX: 5160, vx: -105, phase: 1.5 },
    { x: 7740, y: 550, w: 46, h: 80, minX: 7600, maxX: 7940, vx: 110, phase: 0.9 },
    { x: 10290, y: 550, w: 46, h: 80, minX: 10180, maxX: 10520, vx: -108, phase: 2.3 },
  ];

  const checkpoints = [
    { x: 1350, y: 598, reached: false },
    { x: 2715, y: 598, reached: false },
    { x: 4115, y: 598, reached: false },
    { x: 5535, y: 598, reached: false },
    { x: 6935, y: 598, reached: false },
    { x: 8335, y: 598, reached: false },
    { x: 9760, y: 598, reached: false },
  ];

  const treats = [
    { x: 1672, y: 222, collected: false, hiddenInDay: true },
    { x: 5905, y: 272, collected: false, hiddenInDay: true },
    { x: 9030, y: 298, collected: false, hiddenInDay: false },
  ];

  const lamps = [
    180, 860, 1410, 2190, 2850, 3590, 4240, 5020, 5660, 6440, 7090, 7850, 8490, 9240, 9910, 10620, 11020,
  ];

  const goal = { x: 11220, y: 305, w: 72, h: 80 };

  return {
    stage: 18,
    theme: 'desert',
    desertOutfit: true,
    title: 'المرحلة 18',
    goalLabel: 'واحة الصحراء الذهبية 🏜️',
    width,
    height,
    startX: 85,
    startY: 586,
    platforms,
    puddles,
    dogs,
    scorpions,
    sand_vipers,
    desert_falcons,
    dust_devils,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
