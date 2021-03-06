import {
  CharacterSide,
  CharacterState,
  FacingDirection,
  IAppearanceComp,
  ICharacterDefinitionComp,
  ICharacterInputComp,
  ICharacterStateComp,
  ICombatComp,
  IPhysicsComp,
  IPositionComp,
} from "../components.js";
import {IEntity} from "../entities/entity.js";

export default class Character implements IEntity {
  public id: number = 0;
  public appearanceComp: IAppearanceComp;
  public characterDefinitionComp: ICharacterDefinitionComp;
  public characterStateComp: ICharacterStateComp;
  public combatComp: ICombatComp;
  public inputComp: ICharacterInputComp;
  public physicsComp: IPhysicsComp;
  public positionComp: IPositionComp;

  public isControlledByClient: boolean;

  constructor(side: CharacterSide, x: number = 0) {
    this.positionComp = {
      x,
      y: 0,
    };

    // currently unused
    this.appearanceComp = {
      width: 0,
      height: 0,
      zIndex: 100,
    };

    this.inputComp = {
      left: false,
      up: false,
      right: false,
      down: false,
      attack: false,
    };

    this.isControlledByClient = false;

    this.characterDefinitionComp = {
      name: "Blah",
      maxHealth: 1000,
      walkSpeed: 4,
      defaultPushbox: {
        isActive: true,
        width: 100,
        height: 180,
        x: -50,
        y: 0,
      },
      defaultHurtbox: {
        isActive: true,
        width: 150,
        height: 220,
        x: -75,
        y: 0,
      },
      defaultBlockbox: {
        isActive: false,
        width: 260,
        height: 100,
        x: 0,
        y: 100,
      },
    };

    this.characterStateComp = {
      state: CharacterState.Stand,
      frameIndex: 0,
      side,
      facingDirection: side === CharacterSide.P1 ? FacingDirection.Left : FacingDirection.Right,
      health: this.characterDefinitionComp.maxHealth,
    };

    this.combatComp = {
      damage: 0,
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
      hurtbox: {isActive: true, width: 10, height: 10, x: 0, y: 0},
      pushbox: {isActive: true, width: 10, height: 10, x: 0, y: 0},
      hitbox: {isActive: false, width: 10, height: 10, x: 0, y: 0},
      blockbox: {isActive: false, width: 10, height: 10, x: 0, y: 0},
    };
  }
}
