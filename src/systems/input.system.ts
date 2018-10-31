import {IInputComp} from "../components.js";
import ISystem from "./system.js";

const KEYCODES: {[key: number]: string} = {
  32: "space",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  65: "a",
  68: "d",
  83: "s",
  87: "w",
};

const MAPPING: {[key: string]: string} = {
  left: "left",
  up: "up",
  right: "right",
  down: "down",
  a: "left",
  w: "up",
  d: "right",
  s: "down",
  space: "attack",
};

export default class InputSystem implements ISystem {
  private pressed: IInputComp;

  constructor(document: Document) {
    this.pressed = {
      left: false,
      up: false,
      right: false,
      down: false,
      attack: false,
    };

    document.addEventListener("keydown", this.pressKey.bind(this));
    document.addEventListener("keyup", this.releaseKey.bind(this));
  }

  public update(entities, dt: number): void {
    entities
      .filter((e) => e.isControlledByClient)
      .forEach((e) => {
        Object.assign(e.inputComp, this.pressed);
      });
  }

  private pressKey(evt: KeyboardEvent): void {
    const key = KEYCODES[evt.which];
    if (!key) { return; }
    evt.preventDefault();
    const action = MAPPING[key];
    this.pressed[action] = true;
  }

  private releaseKey(evt: KeyboardEvent): void {
    const key = KEYCODES[evt.which];
    if (!key) { return; }
    evt.preventDefault();
    const action = MAPPING[key];
    this.pressed[action] = false;
  }
}
