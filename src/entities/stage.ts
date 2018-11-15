import {IAppearanceComp, IPositionComp} from "../components.js";
import {IEntity} from "./entity.js";

export default class Stage implements IEntity {
  public id: number = 0;
  public positionComp: IPositionComp;
  public appearanceComp: IAppearanceComp;

  constructor(width: number, height: number) {
    this.positionComp = {
      x: 0,
      y: 0,
    };
    this.appearanceComp = {
      height,
      width,
      zIndex: 0,
    };
  }
}
