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

export type CharacterInputAction = "left" | "up" | "right" | "down" | "attack";
export type DebugInputAction = "pause" | "reset" | "nextFrame" | "prevFrame";
export type InputAction = CharacterInputAction | DebugInputAction;

export type ICharacterInputComp = {
  [K in CharacterInputAction]: boolean
};

export type IInputComp = {
  [K in InputAction]: boolean
};

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

export interface ICharacterDefinitionComp {
  name: string;
  maxHealth: number;
  walkSpeed: number;
}

export enum FacingDirection {
  Left,
  Right,
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

export enum CharacterSide {
  P1,
  P2,
}

export interface ICharacterStateComp {
  state: CharacterState;
  frameIndex: number;
  side: CharacterSide;
  facingDirection: FacingDirection;
}
