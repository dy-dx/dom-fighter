import {IAppearanceComp, IPositionComp} from "./components.js";

export default class Stage {
  public positionComp: IPositionComp;
  public appearanceComp: IAppearanceComp;
  public isMarkedForRemoval: boolean;

  constructor(width: number, height: number) {
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
