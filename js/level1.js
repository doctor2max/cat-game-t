window.Game = window.Game || {};

window.Game.createLevel1 = function () {
  const width = 3800;
  const height = 720;

  // Platforms: solid ground, dumpsters, crates, AC units, narrow clotheslines, secret night-vision ledges
  const platforms = [
    // Ground segments (leaving gaps for deep puddles)
    { x: 0, y: 630, w: 680, h: 90, type: 'asphalt', climbable: false },
    { x: 820, y: 630, w: 720, h: 90, type: 'asphalt', climbable: false },
    { x: 1680, y: 630, w: 840, h: 90, type: 'asphalt', climbable: false },
    { x: 2660, y: 630, w: 1140, h: 90, type: 'asphalt', climbable: false },

    // Start zone: Crashed cardboard box & dumpster
    { x: 260, y: 565, w: 95, h: 65, type: 'crate', oneWay: false },
    { x: 420, y: 525, w: 140, h: 105, type: 'dumpster', oneWay: false },

    // Narrow clothesline over first puddle
    { x: 640, y: 470, w: 220, h: 12, type: 'clothesline', oneWay: true, narrow: true },

    // Mid-alley crates & AC units + bouncy awning
    { x: 930, y: 540, w: 90, h: 90, type: 'crate', oneWay: false },
    { x: 1120, y: 465, w: 110, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 1320, y: 375, w: 130, h: 26, type: 'ac', oneWay: true },

    // Secret high ledge only visible in Night Vision!
    { x: 1150, y: 260, w: 140, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },

    // Wall-jump chimney shaft before dog patrol #1
    { x: 1520, y: 350, w: 45, h: 280, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1660, y: 260, w: 45, h: 260, type: 'brickwall', oneWay: false, climbable: true },
    { x: 1705, y: 350, w: 150, h: 24, type: 'fireescape', oneWay: true },

    // Second alley: Enlarged parked delivery van, Dog patrol area with overhead escape route
    { x: 1690, y: 556, w: 175, h: 74, type: 'car', variant: 'van', oneWay: true },
    { x: 1920, y: 460, w: 130, h: 24, type: 'ac', oneWay: true },
    { x: 2120, y: 390, w: 240, h: 12, type: 'clothesline', oneWay: true, narrow: true },
    { x: 2420, y: 520, w: 120, h: 110, type: 'dumpster', oneWay: false },

    // Puddle #3 + Bouncy awning
    { x: 2560, y: 515, w: 110, h: 24, type: 'awning', oneWay: true, bouncy: true },
    { x: 2770, y: 430, w: 130, h: 26, type: 'fireescape', oneWay: true },

    // Secret night-vision ledge #2
    { x: 2950, y: 315, w: 130, h: 20, type: 'secret', oneWay: true, hiddenInDay: true },

    // Final climb to Market Gate
    { x: 3250, y: 530, w: 110, h: 100, type: 'crate', oneWay: false },
    { x: 3410, y: 440, w: 140, h: 24, type: 'fireescape', oneWay: true },
    { x: 3590, y: 360, w: 180, h: 270, type: 'brickwall', oneWay: false, climbable: true },
  ];

  // Deep water puddles (hazards)
  const puddles = [
    { x: 680, y: 636, w: 140, h: 22 },
    { x: 1540, y: 636, w: 140, h: 22 },
    { x: 2520, y: 636, w: 140, h: 22 },
  ];

  // Stray dogs (enemies)
  const dogs = [
    {
      x: 1150,
      y: 586,
      w: 58,
      h: 44,
      minX: 980,
      maxX: 1450,
      vx: 75,
      facing: 1,
      state: 'patrol', // patrol | alert | distracted
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 2050,
      y: 586,
      w: 58,
      h: 44,
      minX: 1850,
      maxX: 2380,
      vx: 90,
      facing: -1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
    {
      x: 2950,
      y: 586,
      w: 58,
      h: 44,
      minX: 2740,
      maxX: 3200,
      vx: 105,
      facing: 1,
      state: 'patrol',
      distractX: 0,
      stateTimer: 0,
    },
  ];

  // Checkpoints (cozy cushions / safe boxes)
  const checkpoints = [
    { x: 1750, y: 318, activated: false },
    { x: 2810, y: 398, activated: false },
  ];

  // Collectible Tuna / Fish treats
  const treats = [
    { x: 1210, y: 220, collected: false, hiddenInDay: true },
    { x: 2230, y: 350, collected: false, hiddenInDay: false },
    { x: 3005, y: 275, collected: false, hiddenInDay: true },
  ];

  // Streetlamps for warm atmospheric light cones
  const lamps = [180, 620, 1120, 1740, 2320, 2900, 3500];

  // Exit Gate to Stage 2 (The Market)
  const goal = { x: 3650, y: 280, w: 72, h: 80 };

  return {
    width,
    height,
    startX: 110,
    startY: 590,
    platforms,
    puddles,
    dogs,
    checkpoints,
    treats,
    lamps,
    goal,
  };
};
