import {IAppearanceComp, IHitbox, IPhysicsComp, IPositionComp} from "../components.js";
import {IEntity} from "../entities/entity.js";
import ISystem from "./system.js";

interface IRenderable extends IEntity {
  appearanceComp: IAppearanceComp;
  positionComp: IPositionComp;
  physicsComp?: IPhysicsComp;
}

export default class RenderSystem implements ISystem {
  private gameElement: HTMLElement;

  constructor(elem: HTMLElement) {
    if (!elem) {
      throw new Error();
    }
    this.gameElement = elem;
  }

  public update(entities: IEntity[], dt: number): void {
    entities
      .filter((e): e is IRenderable => !!e.appearanceComp)
      .forEach((e) => {
        const elem = this.findOrCreateElement(e);
        this.setStyles(elem, e.appearanceComp, e.positionComp);

        if (e.physicsComp) {
          [
            { hitbox: e.physicsComp.pushbox, type: "pushbox" },
            { hitbox: e.physicsComp.hurtbox, type: "hurtbox" },
            { hitbox: e.physicsComp.hitbox, type: "hitbox" },
            { hitbox: e.physicsComp.blockbox, type: "blockbox" },
          ].forEach(({hitbox, type}) => {
            const elementId = `${elem.id}-${type}`;
            const hitboxElem = document.getElementById(elementId);
            if (!hitboxElem) { throw new Error(`No element with id: ${elementId}`); }
            this.setHitboxDimensions(hitboxElem, hitbox);
          });
        }
      });
  }

  private findOrCreateElement(e: IRenderable): HTMLElement {
    const existingElement = document.getElementById(`entity${e.id.toString()}`);
    if (existingElement) {
      return existingElement;
    }
    const newElement = this.createParentElement(e.appearanceComp, e.id.toString());
    if (e.physicsComp) {
      this.createDebugBoxes(newElement, e.physicsComp);
    }
    return newElement;
  }

  private createParentElement(appearanceComp: IAppearanceComp, id: string): HTMLElement {
    const elem = document.createElement("div");
    elem.id = `entity${id}`;
    elem.className = "entity";
    this.gameElement.appendChild(elem);
    return elem;
  }

  private createDebugBoxes(parentElem: HTMLElement, physicsComp: IPhysicsComp): void {
    const boxColors = [
      {
        id: `${parentElem.id}-blockbox`,
        hitbox: physicsComp.blockbox,
        borderColor: "gray",
        backgroundColor: "rgba(80, 80, 80, 0.25)",
      },
      {
        id: `${parentElem.id}-hurtbox`,
        hitbox: physicsComp.hurtbox,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.25)",
      },
      {
        id: `${parentElem.id}-pushbox`,
        hitbox: physicsComp.pushbox,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.25)",
      },
      {
        id: `${parentElem.id}-hitbox`,
        hitbox: physicsComp.hitbox,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.25)",
      },
      // a hack to display the position marker using hitbox renderer
      {
        id: `${parentElem.id}-position`,
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

    boxColors.forEach(({id, hitbox, borderColor, backgroundColor}) => {
      const boxElem = document.createElement("div");
      boxElem.style.backgroundColor = backgroundColor;
      boxElem.style.borderColor = borderColor;
      boxElem.style.borderStyle = "solid";
      boxElem.style.borderWidth = "1px";
      boxElem.className = "hitbox";
      this.setHitboxDimensions(boxElem, hitbox);
      boxElem.id = id;
      parentElem.appendChild(boxElem);
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
