import {CharacterState, IAppearanceComp, IPositionComp} from "../components.js";
import Character from "../entities/character.js";
import {IEntity} from "../entities/entity.js";
import Game from "../game.js";
import ISystem from "./system.js";

// not actually an "entity", this is just a hack
interface IDebugEntity {
  appearanceComp: IAppearanceComp;
  positionComp: IPositionComp;
  element?: HTMLElement;
}

export default class DebugRenderSystem implements ISystem {
  private gameElement: HTMLElement;
  private game: Game;

  private infoBox: IDebugEntity;
  private p1InfoBox: IDebugEntity;
  private p2InfoBox: IDebugEntity;

  constructor(game: Game, elem: HTMLElement) {
    this.game = game;
    if (!elem) {
      throw new Error();
    }
    this.gameElement = elem;

    const infoBoxAppearanceComp = {
      width: 200,
      height: 60,
      zIndex: 10000,
    };
    this.infoBox = {
      appearanceComp: infoBoxAppearanceComp,
      positionComp: {
        x: this.game.width / 2 - infoBoxAppearanceComp.width / 2,
        y: this.game.height - infoBoxAppearanceComp.height,
      },
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
        y: this.game.height - playerInfoAppearanceComp.height,
      },
    };
    this.p2InfoBox = {
      appearanceComp: Object.assign({}, playerInfoAppearanceComp),
      positionComp: {
        x: this.game.width - playerInfoAppearanceComp.width,
        y: this.game.height - playerInfoAppearanceComp.height,
      },
    };

    this.infoBox.element = this.createElement(this.infoBox);
    this.p1InfoBox.element = this.createElement(this.p1InfoBox);
    this.p2InfoBox.element = this.createElement(this.p2InfoBox);
  }

  public update(entities: IEntity[], dt: number): void {
    const p1 = this.game.getP1();
    const p2 = this.game.getP2();
    const networkInfo = this.game.networkSystem.debugInfo();
    this.infoBox.element!.textContent = [
      `ping: ${networkInfo.roundtripLatency / 2}ms | delay: ${networkInfo.tickDelay}`,
    ].join("\n");

    this.p1InfoBox.element!.textContent = this.displayCharacterInfo(p1);
    this.p2InfoBox.element!.textContent = this.displayCharacterInfo(p2);
  }

  private displayCharacterInfo(c: Character): string {
    return [
      `p1: ${c.characterStateComp.health}hp | ${c.positionComp.x},${c.positionComp.y}`,
      `state: ${CharacterState[c.characterStateComp.state]}`,
      `hitstop: ${c.combatComp.hitStop}`,
      `hitstun: ${c.combatComp.hitStun}`,
    ].join("\n");
  }

  private createElement(e: IDebugEntity): HTMLElement {
    const elem = document.createElement("div");
    elem.className = "entity debug-entity";
    this.setStyles(elem, e.appearanceComp, e.positionComp);
    this.gameElement.appendChild(elem);
    return elem;
  }

  private setStyles(elem: HTMLElement, appearanceComp: IAppearanceComp, positionComp: IPositionComp): void {
    elem.style.transform = `translate3d(${positionComp.x}px,${-positionComp.y}px,0px)`;
    elem.style.width = `${appearanceComp.width}px`;
    elem.style.height = `${appearanceComp.height}px`;
    elem.style.zIndex = `${appearanceComp.zIndex}`;

    elem.style.backgroundColor = "purple";
  }
}
