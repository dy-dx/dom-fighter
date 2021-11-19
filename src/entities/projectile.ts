import {FacingDirection, IAppearanceComp, ICombatComp, IPhysicsComp, IPositionComp} from "../components.js";
import {IEntity} from "../entities/entity.js";

export default class Projectile implements IEntity {
  public id: number = 0;
  public ownerId: number = 0;
  public appearanceComp: IAppearanceComp;
  public combatComp: ICombatComp;
  public physicsComp: IPhysicsComp;
  public positionComp: IPositionComp;

  constructor(ownerId: number = 0) {
    this.ownerId = ownerId;

    this.positionComp = {
      x: 0,
      y: 0,
    };

    // currently unused
    this.appearanceComp = {
      width: 0,
      height: 0,
      zIndex: 100,
    };

    this.combatComp = {
      move: "MediumPunch", //placeholder, fixme
      damage: 0,
      facingDirection: FacingDirection.Left,
      hasHit: false,
      hitStop: 0,
      hitStun: 0,
      isInBlockbox: false,
      slideTime: 0,
      slideSpeed: 0,
      slideDirection: FacingDirection.Left,
    };

    this.physicsComp = {
      isMoveable: true,
      velocityX: 0,
      velocityY: 0,
      accelerationY: 0,
      hurtbox: {isActive: false, width: 0, height: 0, x: 0, y: 0},
      pushbox: {isActive: false, width: 0, height: 0, x: 0, y: 0},
      hitbox: {isActive: true, width: 10, height: 10, x: 0, y: 0},
      blockbox: {isActive: false, width: 10, height: 10, x: 0, y: 0},
    };
  }
}
