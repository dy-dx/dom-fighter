export interface IAppearanceComp {
  width: number;
  height: number;
  zIndex: number;
}

export interface IPositionComp {
  x: number;
  y: number;
}

export type CharacterInputAction = "left" | "up" | "right" | "down" | "attack" | "special";
export type DebugInputAction = "pause" | "reset" | "nextFrame" | "saveState" | "loadState";
export type InputAction = CharacterInputAction | DebugInputAction;

export type ICharacterInputComp = {
  [K in CharacterInputAction]: boolean;
};

export type IDebugInputComp = {
  [K in DebugInputAction]: boolean;
};

export type IInputComp = {
  [K in InputAction]: boolean;
};

export interface IHitbox {
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
  accelerationY: number;
  pushbox: IHitbox;
  hurtbox: IHitbox;
  hitbox: IHitbox;
  blockbox: IHitbox;
}

import type {MoveName} from "./data/index.js";
export interface ICombatComp {
  move: MoveName; // Current move name
  damage: number;
  facingDirection: FacingDirection;
  // Whether or not the current move has struck an opponent, i.e. has it been "used up"
  hasHit: boolean;
  hitStop: number;
  hitStun: number;
  isInBlockbox: boolean;
  slideTime: number;
  slideSpeed: number;
  slideDirection: FacingDirection;
}

export interface ICharacterDefinitionComp {
  name: string;
  maxHealth: number;
  walkSpeed: number;
  defaultPushbox: IHitbox;
  defaultHurtbox: IHitbox;
  defaultBlockbox: IHitbox;
}

export enum FacingDirection {
  Left,
  Right,
}

export enum CharacterState {
  Stand,
  Walk,
  Jump,
  JumpEnd,
  Attack,
  AttackEnd,
  Block,
  BlockEnd,
  Blockstun,
  Hitstop,
  Hitstun,
  HitstunEnd,
}

export const enum CharacterSide {
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
