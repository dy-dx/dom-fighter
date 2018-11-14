import {IInputComp} from "../components.js";
import {IEntity} from "../entities/entity.js";
import Game from "../game.js";
import {MAPPING} from "./input.system.js";
import ISystem from "./system.js";

// this has its own input listeners to avoid kludging another InputComponent somewhere

export default class DebugSystem implements ISystem {
  private game: Game;
  private pressed: IInputComp;

  constructor(game: Game, document: Document) {
    this.game = game;

    this.pressed = {
      left: false,
      up: false,
      right: false,
      down: false,
      attack: false,

      prevFrame: false,
      pause: false,
      nextFrame: false,
      reset: false,
    };

    document.addEventListener("keydown", this.pressKey.bind(this));
    document.addEventListener("keyup", this.releaseKey.bind(this));
  }

  public update(entities: IEntity[], dt: number): void {
    const pressed = this.pressed;

    if (pressed.pause) {
      this.game.togglePause();
    } else if (pressed.reset) {
      this.game.reset();
    } else if (pressed.nextFrame) {
      this.game.advanceFrame();
    } else if (pressed.prevFrame) {
      // TODO
    }
  }

  private pressKey(evt: KeyboardEvent): void {
    if (evt.ctrlKey || evt.metaKey) { return; }
    const action = MAPPING[evt.code];
    if (!action) { return; }
    evt.preventDefault();
    if ((this.pressed as any)[action] !== undefined) {
      (this.pressed as any)[action] = true;
    }
  }

  private releaseKey(evt: KeyboardEvent): void {
    if (evt.ctrlKey || evt.metaKey) { return; }
    const action = MAPPING[evt.code];
    if (!action) { return; }
    evt.preventDefault();
    if ((this.pressed as any)[action] !== undefined) {
      (this.pressed as any)[action] = false;
    }
  }
}
