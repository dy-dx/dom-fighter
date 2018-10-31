import {
  CharacterState,
  IAppearanceComp,
  ICharacterStateComp,
  IInputComp,
  IPhysicsComp,
  IPositionComp,
} from "./components.js";

export default class Character {
  public appearanceComp: IAppearanceComp;
  public characterStateComp: ICharacterStateComp;
  public inputComp: IInputComp;
  public physicsComp: IPhysicsComp;
  public positionComp: IPositionComp;

  public walkSpeed: number;
  public isControlledByClient: boolean;
  public isMarkedForRemoval: boolean;

  constructor(x: number) {
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
    this.isMarkedForRemoval = false;

    this.walkSpeed = 300;

    this.characterStateComp = {
      state: CharacterState.Stand,
      frameIndex: 0,
    };

    this.physicsComp = {
      isMoveable: true,
      velocityX: 0,
      velocityY: 0,
      hitbox: {
        isActive: false,
        width: 10,
        height: 10,
        x: 0,
        y: 0,
      },
      hurtbox: {
        isActive: true,
        width: 180,
        height: 220,
        x: -90,
        y: 0,
      },
      pushbox: {
        isActive: true,
        width: 100,
        height: 180,
        x: -50,
        y: 0,
      },
    };
  }
}
