export interface IAppearanceComp {
  width: number;
  height: number;
  zIndex?: number;
  element?: HTMLElement;
}

export interface IPositionComp {
  x: number;
  y: number;
}

export interface IInputComp {
  left: boolean;
  up: boolean;
  right: boolean;
  down: boolean;
  attack: boolean;
}

export interface IHitbox {
  isActive: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  // horrible hack, fixme
  element?: HTMLElement;
}

export interface IPhysicsComp {
  isMoveable: boolean;
  velocityX: number;
  velocityY: number;
  pushbox: IHitbox;
  hurtbox: IHitbox;
  hitbox: IHitbox;
}

export enum CharacterState {
  Stand,
  Walk,
  Attack,
  AttackEnd,
  Block,
  Blockstun,
  Hitstun,
}

export interface ICharacterStateComp {
  state: CharacterState;
  frameIndex: number;
}
