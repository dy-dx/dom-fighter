export default {
  id: "Blah",
  damage: 80,
  hitStop: 12,
  hitStun: 8,
  blockStun: 4,
  slideTime: 8,
  slideSpeed: 3,
  hitboxes: [
    // 0
    {
      width: 80,
      height: 80,
      x: 50,
      y: 70,
    },
    // 1
    {
      width: 80,
      height: 80,
      x: 60,
      y: 70,
    },
    // 2
    {
      width: 80,
      height: 80,
      x: 65,
      y: 70,
    },
  ],
  pushboxes: [
    // 0
    {
      width: 140,
    },
  ],
  hurtboxes: [
    // 0
    {
      width: 200,
    },
  ],
  frames: [
    {},
    {blockboxActive: true, x: 1},
    {blockboxActive: true, x: 5},
    {blockboxActive: true, x: 18},
    {blockboxActive: true, x: 5},
    {blockboxActive: true, x: 2},
    {
      blockboxActive: true,
      hitboxIndex: 0,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    {
      blockboxActive: true,
      hitboxIndex: 1,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    {
      blockboxActive: true,
      hitboxIndex: 2,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    {
      blockboxActive: true,
      hitboxIndex: 2,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    {hurtboxIndex: 0},
    {hurtboxIndex: 0},
    {hurtboxIndex: 0},
    {hurtboxIndex: 0},
    {x: -1},
    {x: -3},
    {x: -5},
    {x: -8},
    {x: -7},
    {x: -3},
    {x: -2},
    {x: -1},
    {},
    {},
  ],
};
