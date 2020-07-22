import {CharacterState, FacingDirection, IAppearanceComp, IPositionComp} from "../components.js";
import Character from "../entities/character.js";
import {IEntity} from "../entities/entity.js";
import Game from "../game.js";
import ISystem from "./system.js";

// not actually an "entity", this is just a hack
interface IUIEntity {
  appearanceComp: IAppearanceComp;
  positionComp: IPositionComp;
  element: HTMLElement;
  className: string;
}

export default class DebugRenderSystem implements ISystem {
  private gameElement: HTMLElement;
  private game: Game;

  private p1HealthMeter: IUIEntity;
  private p2HealthMeter: IUIEntity;
  private infoBox: IUIEntity;
  private p1InfoBox: IUIEntity;
  private p2InfoBox: IUIEntity;

  constructor(game: Game, elem: HTMLElement) {
    this.game = game;
    if (!elem) {
      throw new Error();
    }
    this.gameElement = elem;

    const healthMeterAppearanceComp = {
      width: 0, // determine later
      height: 30,
      zIndex: 100,
    };
    this.p1HealthMeter = {
      appearanceComp: Object.assign({}, healthMeterAppearanceComp),
      positionComp: {
        x: 0,
        y: this.game.height - healthMeterAppearanceComp.height,
      },
      element: document.createElement("div"),
      className: "ui-health ui-health-p1",
    };
    this.p2HealthMeter = {
      appearanceComp: Object.assign({}, healthMeterAppearanceComp),
      positionComp: {
        x: this.game.width / 2,
        y: this.game.height - healthMeterAppearanceComp.height,
      },
      element: document.createElement("div"),
      className: "ui-health ui-health-p2",
    };

    const infoBoxAppearanceComp = {
      width: 180,
      height: 60,
      zIndex: 10000,
    };
    this.infoBox = {
      appearanceComp: infoBoxAppearanceComp,
      positionComp: {
        x: this.game.width / 2 - infoBoxAppearanceComp.width / 2,
        y: this.game.height - infoBoxAppearanceComp.height - healthMeterAppearanceComp.height,
      },
      element: document.createElement("div"),
      className: "ui-debug",
    };

    const playerInfoAppearanceComp = {
      width: 200,
      height: 60,
      zIndex: 10000,
    };
    this.p1InfoBox = {
      appearanceComp: Object.assign({}, playerInfoAppearanceComp),
      positionComp: {
        x: 0,
        y: this.game.height - playerInfoAppearanceComp.height - healthMeterAppearanceComp.height,
      },
      element: document.createElement("div"),
      className: "ui-debug",
    };
    this.p2InfoBox = {
      appearanceComp: Object.assign({}, playerInfoAppearanceComp),
      positionComp: {
        x: this.game.width - playerInfoAppearanceComp.width,
        y: this.game.height - playerInfoAppearanceComp.height - healthMeterAppearanceComp.height,
      },
      element: document.createElement("div"),
      className: "ui-debug",
    };

    [
      // prettier-ignore
      this.p1HealthMeter,
      this.p2HealthMeter,
      this.infoBox,
      this.p1InfoBox,
      this.p2InfoBox,
    ].forEach((e) => this.setupElement(e));
  }

  public update(_entities: IEntity[], _dt: number): void {
    const p1 = this.game.getP1();
    const p2 = this.game.getP2();
    const networkInfo = this.game.networkSystem.debugInfo();

    const networkText = !networkInfo.isConnectionReady
      ? "Waiting for connection"
      : `delay: ${networkInfo.tickDelay} | ping: ${Math.ceil(networkInfo.roundtripLatency / 2)}ms`;

    this.infoBox.element.textContent = [
      networkText,
      `update: ${this.game.approximateAvgUpdateMs.toFixed(1)}ms`,
      `render: ${this.game.approximateAvgRenderMs.toFixed(1)}ms`,
    ].join("\n");

    this.p1InfoBox.element.textContent = this.displayCharacterInfo(p1);
    this.p2InfoBox.element.textContent = this.displayCharacterInfo(p2);

    this.p1HealthMeter.element.style.width = `${this.calculateHealthMeterWidth(p1).toString()}px`;
    this.p2HealthMeter.element.style.width = `${this.calculateHealthMeterWidth(p2).toString()}px`;
    this.p1HealthMeter.element.style.transform = [
      `translate3d(${this.game.width / 2 - this.calculateHealthMeterWidth(p1)}px`,
      `${-this.p1HealthMeter.positionComp.y}px,0px)`,
    ].join(",");
  }

  private calculateHealthMeterWidth(c: Character): number {
    const pct = c.characterStateComp.health / c.characterDefinitionComp.maxHealth;
    return Math.floor(pct * (this.game.width / 2));
  }

  private displayCharacterInfo(c: Character): string {
    const stateComp = c.characterStateComp;
    return [
      `${stateComp.health}hp | ${c.positionComp.x},${c.positionComp.y} | ${
        FacingDirection[stateComp.facingDirection]
      }`,
      `hitstop: ${c.combatComp.hitStop} | hitstun: ${c.combatComp.hitStun}`,
      `${CharacterState[stateComp.state]} [${stateComp.frameIndex}]`,
    ].join("\n");
  }

  private setupElement(e: IUIEntity) {
    e.element.className = `entity ${e.className}`;
    this.setStyles(e.element, e.appearanceComp, e.positionComp);
    this.gameElement.appendChild(e.element);
  }

  private setStyles(elem: HTMLElement, appearanceComp: IAppearanceComp, positionComp: IPositionComp): void {
    elem.style.transform = `translate3d(${positionComp.x}px,${-positionComp.y}px,0px)`;
    elem.style.width = `${appearanceComp.width}px`;
    elem.style.height = `${appearanceComp.height}px`;
    elem.style.zIndex = `${appearanceComp.zIndex}`;
  }
}
