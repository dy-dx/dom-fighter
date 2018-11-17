export default {
  id: "Blah",
  damage: 80,
  hitStop: 12,
  hitStun: 8,
  slideTime: 8,
  slideSpeed: 3,
  hitboxes: [
    { // 0
      width: 90,
      height: 80,
      x: 50,
      y: 70,
    },
    { // 1
      width: 90,
      height: 80,
      x: 60,
      y: 70,
    },
    { // 2
      width: 90,
      height: 80,
      x: 65,
      y: 70,
    },
  ],
  pushboxes: [
    { // 0
      width: 140,
    },
  ],
  hurtboxes: [
    { // 0
      width: 180,
    },
  ],
  frames: [
    {},
    { x: 5 },
    { x: 18 },
    { x: 5 },
    { x: 2 },
    {
      hitboxIndex: 0,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    {
      hitboxIndex: 1,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    {
      hitboxIndex: 2,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    {
      hitboxIndex: 2,
      hurtboxIndex: 0,
      pushboxIndex: 0,
    },
    { hurtboxIndex: 0 },
    { hurtboxIndex: 0 },
    { hurtboxIndex: 0 },
    { hurtboxIndex: 0 },
    { x: -2 },
    { x: -4 },
    { x: -6 },
    { x: -12 },
    { x: -10 },
    { x: -4 },
    { x: -2 },
    {},
    {},
  ],
};
