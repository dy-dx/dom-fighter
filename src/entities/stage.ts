import {IAppearanceComp, IPositionComp} from "../components.js";
import {IEntity} from "./entity.js";

export default class Stage implements IEntity {
  public positionComp: IPositionComp;
  public appearanceComp: IAppearanceComp;
  public isMarkedForRemoval: boolean;
  public isSafeToRemove: boolean;

  constructor(width: number, height: number) {
    this.isMarkedForRemoval = false;
    this.isSafeToRemove = false;

    this.positionComp = {
      x: 0,
      y: 0,
    };
    this.appearanceComp = {
      height,
      width,
    };

    this.isMarkedForRemoval = false;
  }
}
