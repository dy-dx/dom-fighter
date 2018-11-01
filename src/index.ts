import Game from "./game.js";

const div = document.getElementById("main");
if (!div) {
  throw new Error("#main element is not present.");
}
const game = new Game(div, 960, 540);
const loop = () => {
  game.update(1 / 60);
};

const launch = () => {
  setInterval(loop, 1000 / 60);
};

export default launch;
