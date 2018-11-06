import {CharacterSide} from "./components.js";
import Character from "./entities/character.js";
import {IEntity} from "./entities/entity.js";
import Stage from "./entities/stage.js";
import CharacterStateSystem from "./systems/character-state.system.js";
import CombatSystem from "./systems/combat.system.js";
import DebugSystem from "./systems/debug.system.js";
import InputSystem from "./systems/input.system.js";
import NetworkSystem from "./systems/network.system.js";
import PhysicsSystem from "./systems/physics.system.js";
import RenderSystem from "./systems/render.system.js";
import ISystem from "./systems/system.js";

export default class Game {
  public currentTick: number;
  public p1: Character | undefined;
  public p2: Character | undefined;
  private isPaused: boolean;
  private height: number;
  private width: number;
  private entities: IEntity[];
  private networkSystem: NetworkSystem;
  private systems: ISystem[];
  private simulationSystems: ISystem[];
  private renderSystems: ISystem[];

  constructor(elem: HTMLElement, width: number, height: number) {
    this.currentTick = 0;
    this.isPaused = false;
    this.height = height;
    this.width = width;

    this.entities = [];
    this.networkSystem = new NetworkSystem(this);
    this.systems = [
      new InputSystem(document),
      this.networkSystem,
      new DebugSystem(this, document),
    ];
    this.simulationSystems = [
      new CharacterStateSystem(this),
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
    this.p1 = new Character(CharacterSide.P1, this.width / 2 - this.width / 4);
    this.p2 = new Character(CharacterSide.P2, this.width / 2 + this.width / 4);

    this.entities.push(stage);
    this.entities.push(this.p1);
    this.entities.push(this.p2);
  }

  public togglePause() {
    this.isPaused = !this.isPaused;
  }

  public update(dt: number) {
    this.systems.forEach((s) => {
      s.update(this.entities, dt);
    });
    if (!this.isPaused && this.networkSystem.isSimulationReady) {
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
    // fixme
    // iterate backwards so we can splice
    // for (let i = this.entities.length - 1; i >= 0; i--) {
    //   const entity = this.entities[i];
    //   if (entity.isSafeToRemove) {
    //     this.entities.splice(i, 1);
    //   }
    // }

    this.simulationSystems.forEach((s) => {
      s.update(this.entities, dt);
    });

    this.currentTick++;
  }
}
