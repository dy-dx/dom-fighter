import Character from "./character.js";
import Stage from "./stage.js";
import CharacterStateSystem from "./systems/character-state.system.js";
import CombatSystem from "./systems/combat.system.js";
import InputSystem from "./systems/input.system.js";
import PhysicsSystem from "./systems/physics.system.js";
import RenderSystem from "./systems/render.system.js";
import ISystem from "./systems/system.js";

export default class Game {
  private height: number;
  private width: number;
  private children: any[];
  private systems: ISystem[];

  constructor(elem: HTMLElement, width: number, height: number) {
    this.height = height;
    this.width = width;

    this.children = [];
    this.systems = [
      new InputSystem(document),
      new CharacterStateSystem(),
      new PhysicsSystem(),
      new CombatSystem(),
      new RenderSystem(elem),
    ];

    this.reset();
  }

  public reset() {
    this.children = [];
    const stage = new Stage(this.width, this.height);
    const playerCharacter = new Character(this.width / 2 - this.width / 4);
    playerCharacter.isControlledByClient = true;
    const opponentCharacter = new Character(this.width / 2 + this.width / 4);

    this.children.push(stage);
    this.children.push(playerCharacter);
    this.children.push(opponentCharacter);
  }

  public update(dt: number) {
    // iterate backwards so we can splice
    for (let i = this.children.length - 1; i >= 0; i--) {
      const entity = this.children[i];
      if (entity.isMarkedForRemoval) {
        this.children.splice(i, 1);
      }
    }

    this.systems.forEach((s) => {
      s.update(this.children, dt);
    });
  }
}
