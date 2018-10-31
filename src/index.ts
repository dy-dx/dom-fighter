import Game from "./game.js";

const div = document.getElementById("main");
if (!div) {
  throw new Error("#main element is not present.");
}
const game = new Game(div, 960, 540);
let last = Date.now();
const loop = () => {
  const now = Date.now();
  game.update((now - last) / 1000);
  last = now;
  window.requestAnimationFrame(loop);
};

export default loop;
