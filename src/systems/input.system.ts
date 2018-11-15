import {ICharacterInputComp, InputAction} from "../components.js";
import {IEntity} from "../entities/entity.js";
import ISystem from "./system.js";

export const MAPPING: {[key: string]: InputAction} = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
  KeyA: "left",
  KeyW: "up",
  KeyD: "right",
  KeyS: "down",
  Space: "attack",

  KeyI: "saveState",
  KeyO: "loadState",
  KeyP: "reset",
  KeyK: "pause",
  KeyL: "nextFrame",
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
