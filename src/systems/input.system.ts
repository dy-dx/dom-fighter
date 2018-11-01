import {ICharacterInputComp, InputAction} from "../components.js";
import {IEntity} from "../entities/entity.js";
import ISystem from "./system.js";

export const KEYCODES: {[key: number]: string} = {
  32: "space",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  65: "a",
  68: "d",
  74: "j",
  75: "k",
  76: "l",
  80: "p",
  83: "s",
  87: "w",
};

export const MAPPING: {[key: string]: InputAction} = {
  left: "left",
  up: "up",
  right: "right",
  down: "down",
  a: "left",
  w: "up",
  d: "right",
  s: "down",
  space: "attack",

  j: "prevFrame",
  k: "pause",
  l: "nextFrame",
  p: "reset",
};

export default class InputSystem implements ISystem {
  private pressed: ICharacterInputComp;

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

  public update(entities: IEntity[], dt: number): void {
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
    if ((this.pressed as any)[action] !== undefined) {
      (this.pressed as any)[action] = true;
    }
  }

  private releaseKey(evt: KeyboardEvent): void {
    const key = KEYCODES[evt.which];
    if (!key) { return; }
    evt.preventDefault();
    const action = MAPPING[key];
    if ((this.pressed as any)[action] !== undefined) {
      (this.pressed as any)[action] = false;
    }
  }
}
