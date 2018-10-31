import Character from "../character.js";
import {IAppearanceComp, IHitbox, IPositionComp} from "../components.js";
import ISystem from "./system.js";

export default class RenderSystem implements ISystem {
  private gameElement: HTMLElement;

  constructor(elem: HTMLElement) {
    if (!elem) {
      throw new Error();
    }
    this.gameElement = elem;
  }

  public update(entities, dt: number): void {
    entities
      .filter((e) => e.appearanceComp)
      .forEach((e) => {
        if (e.isMarkedForRemoval && e.appearanceComp.element) {
          e.appearanceComp.element.parentNode.removeChild(e.appearanceComp.element);
          return;
        }

        // fixme
        if (!e.appearanceComp.element) {
          const elem = this.createElement(e.appearanceComp);
          if (e.inputComp) {
            this.createDebugBoxes(e, elem);
          }
          e.appearanceComp.element = elem;
        }

        this.setStyles(e.appearanceComp.element, e.appearanceComp, e.positionComp);
        if (e.inputComp) {
          [e.physicsComp.pushbox, e.physicsComp.hurtbox, e.physicsComp.hitbox].forEach((hitbox) => {
            this.setHitboxDimensions(hitbox.element, hitbox);
          });
        }
      });
  }

  private createElement(appearanceComp: IAppearanceComp): HTMLElement {
    const elem = document.createElement("div");
    elem.className = "entity";
    this.gameElement.appendChild(elem);
    return elem;
  }

  private createDebugBoxes(c: Character, elem: HTMLElement): void {
    const boxColors = [
      {
        hitbox: c.physicsComp.pushbox,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.25)",
      },
      {
        hitbox: c.physicsComp.hurtbox,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.25)",
      },
      {
        hitbox: c.physicsComp.hitbox,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.25)",
      },
      // a hack to display the position marker using hitbox renderer
      {
        hitbox: {
          isActive: true,
          width: 3,
          height: 12,
          x: -1,
          y: 0,
        },
        borderColor: "white",
        backgroundColor: "black",
      },
    ];

    boxColors.forEach(({hitbox, borderColor, backgroundColor}) => {
      const boxElem = document.createElement("div");
      boxElem.style.backgroundColor = backgroundColor;
      boxElem.style.borderColor = borderColor;
      boxElem.style.borderStyle = "solid";
      boxElem.style.borderWidth = "1px";
      boxElem.className = "hitbox";
      this.setHitboxDimensions(boxElem, hitbox);
      hitbox.element = boxElem;
      elem.appendChild(boxElem);
    });
  }

  private setStyles(elem: HTMLElement, appearanceComp: IAppearanceComp, positionComp: IPositionComp): void {
    elem.style.transform = `translate3d(${positionComp.x}px,${-positionComp.y}px,0px)`;
    elem.style.width = `${appearanceComp.width}px`;
    elem.style.height = `${appearanceComp.height}px`;
    elem.style.zIndex = `${appearanceComp.zIndex || 0}`;
  }

  private setHitboxDimensions(elem: HTMLElement, hitbox: IHitbox): void {
    elem.style.transform = `translate3d(${hitbox.x}px,${-hitbox.y}px,0px)`;
    elem.style.width = `${hitbox.width}px`;
    elem.style.height = `${hitbox.height}px`;
    elem.style.visibility = hitbox.isActive ? "visible" : "hidden";
  }
}
