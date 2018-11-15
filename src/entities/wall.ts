import {HitboxType, IPhysicsComp, IPositionComp} from "../components.js";
import {IEntity} from "./entity.js";

export default class Wall implements IEntity {
  public id: number = 0;
  public positionComp: IPositionComp;
  public physicsComp: IPhysicsComp;

  constructor(x: number, isRightSide: boolean) {
    const width = 1000;
    const height = 1000;
    this.positionComp = {
      x,
      y: 0,
    };
    this.physicsComp = {
      isMoveable: false,
      velocityX: 0,
      velocityY: 0,
      pushbox: {
        type: HitboxType.Pushbox,
        isActive: true,
        width,
        height,
        x: isRightSide ? 0 : -width,
        y: 0,
      },
      // fixme
      hitbox: {
        type: HitboxType.Hitbox,
        isActive: false,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      },
      hurtbox: {
        type: HitboxType.Hurtbox,
        isActive: false,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      },
    };
  }
}
