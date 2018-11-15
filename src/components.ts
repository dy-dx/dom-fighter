export interface IAppearanceComp {
  width: number;
  height: number;
  zIndex: number;
}

export interface IPositionComp {
  x: number;
  y: number;
}

export type CharacterInputAction = "left" | "up" | "right" | "down" | "attack";
export type DebugInputAction = "pause" | "reset" | "nextFrame" | "saveState" | "loadState";
export type InputAction = CharacterInputAction | DebugInputAction;

export type ICharacterInputComp = {
  [K in CharacterInputAction]: boolean
};

export type IInputComp = {
  [K in InputAction]: boolean
};

export enum HitboxType {
  Hitbox,
  Hurtbox,
  Pushbox,
  Blockbox,
}

export interface IHitbox {
  type: HitboxType;
  isActive: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface IPhysicsComp {
  isMoveable: boolean;
  velocityX: number;
  velocityY: number;
  pushbox: IHitbox;
  hurtbox: IHitbox;
  hitbox: IHitbox;
}

export interface ICombatComp {
  damage: number;
  hasHit: boolean;
  hitStop: number;
  hitStun: number;
  slideTime: number;
  slideSpeed: number;
  slideDirection: FacingDirection;
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
  Hitstop,
  Hitstun,
  HitstunEnd,
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
  health: number;
}
