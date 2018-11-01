import Character from "./entities/character.js";
import {IEntity} from "./entities/entity.js";
import Stage from "./entities/stage.js";
import CharacterStateSystem from "./systems/character-state.system.js";
import CombatSystem from "./systems/combat.system.js";
import DebugSystem from "./systems/debug.system.js";
import InputSystem from "./systems/input.system.js";
import PhysicsSystem from "./systems/physics.system.js";
import RenderSystem from "./systems/render.system.js";
import ISystem from "./systems/system.js";

export default class Game {
  private isPaused: boolean;
  private height: number;
  private width: number;
  private entities: IEntity[];
  private systems: ISystem[];
  private simulationSystems: ISystem[];
  private renderSystems: ISystem[];

  constructor(elem: HTMLElement, width: number, height: number) {
    this.isPaused = false;
    this.height = height;
    this.width = width;

    this.entities = [];
    this.systems = [
      new InputSystem(document),
      new DebugSystem(this, document),
    ];
    this.simulationSystems = [
      new CharacterStateSystem(),
      new PhysicsSystem(),
      new CombatSystem(),
    ];
    this.renderSystems = [
      new RenderSystem(elem),
    ];

    this.reset();
  }

  public reset() {
    if (this.entities.length > 0) {
      // hack
      this.entities.forEach((e) => e.isMarkedForRemoval = true);
      this.render(1);
    }

    this.entities = [];
    const stage = new Stage(this.width, this.height);
    const playerCharacter = new Character(this.width / 2 - this.width / 4);
    playerCharacter.isControlledByClient = true;
    const opponentCharacter = new Character(this.width / 2 + this.width / 4);

    this.entities.push(stage);
    this.entities.push(playerCharacter);
    this.entities.push(opponentCharacter);
  }

  public togglePause() {
    this.isPaused = !this.isPaused;
  }

  public update(dt: number) {
    this.systems.forEach((s) => {
      s.update(this.entities, dt);
    });
    if (!this.isPaused) {
      this.tick(dt);
    }
  }

  public render(dt: number) {
    this.renderSystems.forEach((s) => {
      s.update(this.entities, dt);
    });
  }

  public advanceFrame() {
    if (!this.isPaused) {
      return;
    }
    this.tick(1);
  }

  private tick(dt: number) {
    // iterate backwards so we can splice
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];
      if (entity.isSafeToRemove) {
        this.entities.splice(i, 1);
      }
    }

    this.simulationSystems.forEach((s) => {
      s.update(this.entities, dt);
    });
  }
}
