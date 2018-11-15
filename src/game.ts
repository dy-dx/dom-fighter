import {CharacterSide} from "./components.js";
import Character from "./entities/character.js";
import {IEntity} from "./entities/entity.js";
import Stage from "./entities/stage.js";
import CharacterStateSystem from "./systems/character-state.system.js";
import CombatSystem from "./systems/combat.system.js";
import DebugRenderSystem from "./systems/debug-render.system.js";
import DebugSystem from "./systems/debug.system.js";
import InputSystem from "./systems/input.system.js";
import NetworkSystem from "./systems/network.system.js";
import PhysicsSystem from "./systems/physics.system.js";
import RenderSystem from "./systems/render.system.js";
import ISystem from "./systems/system.js";
import deepClone from "./util/deep-clone.js";

export default class Game {
  public readonly height: number;
  public readonly width: number;
  public readonly networkSystem: NetworkSystem;
  private simulationTick: number;
  private updateTick: number;
  private isPaused: boolean;
  private entities!: IEntity[];
  private inputSystems: ISystem[];
  private simulationSystems: ISystem[];
  private renderSystems: ISystem[];

  constructor(elem: HTMLElement, width: number, height: number) {
    this.simulationTick = 0;
    this.updateTick = 0;
    this.isPaused = false;
    this.width = width;
    this.height = height;
    elem.style.width = `${width}px`;
    elem.style.height = `${height}px`;

    this.resetSimulation();

    this.networkSystem = new NetworkSystem(this);
    this.inputSystems = [
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
      new DebugRenderSystem(this, elem),
    ];
  }

  public getSimulationTick(): number {
    return this.simulationTick;
  }

  public getUpdateTick(): number {
    return this.updateTick;
  }

  public getP1(): Character {
    // pretty dumb but it'll work for now
    return this.entities[0] as Character;
  }

  public getP2(): Character {
    // pretty dumb but it'll work for now
    return this.entities[1] as Character;
  }

  public areDebugControlsAllowed(): boolean {
    return !this.networkSystem.isConnectionReady;
  }

  public resetSimulation(): void {
    this.isPaused = false;
    this.simulationTick = 0;
    this.entities = [];
    const stage = new Stage(this.width, this.height);
    const p1 = new Character(CharacterSide.P1, this.width / 2 - this.width / 4);
    p1.isControlledByClient = true;
    const p2 = new Character(CharacterSide.P2, this.width / 2 + this.width / 4);

    this.entities.push(p1);
    this.entities.push(p2);
    this.entities.push(stage);
    // fixme, terrible hack
    this.entities.forEach((e, i) => e.id = i);
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  public update(dt: number): void {
    this.inputSystems.forEach((s) => {
      s.update(this.entities, dt);
    });
    if (!this.isPaused && this.networkSystem.isSimulationReady) {
      this.tick(dt);
    }
    this.updateTick++;
  }

  public render(dt: number): void {
    this.renderSystems.forEach((s) => {
      s.update(this.entities, dt);
    });
  }

  public advanceFrame(): void {
    if (!this.isPaused) {
      return;
    }
    this.tick(1);
  }

  public getStateCopy(): IEntity[] {
    return deepClone(this.entities);
  }

  public loadState(entities: IEntity[]): void {
    this.entities = entities;
  }

  private tick(dt: number): void {
    this.simulationSystems.forEach((s) => {
      s.update(this.entities, dt);
    });

    this.simulationTick++;
  }
}
