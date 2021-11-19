import * as MoveData from "./index-wrapper.js";

export default MoveData;
export type MoveName = keyof typeof MoveData;

interface Pushbox {
  width: number;
}

interface Hitbox {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface Projectile {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
}

interface Frame {
  blockboxActive?: boolean;
  hitboxIndex?: number;
  hurtboxIndex?: number;
  pushboxIndex?: number;
  x?: number;
  spawnProjectileIndex?: number;
}

export interface IAttack {
  id: MoveName;
  damage: number;
  hitStop: number;
  hitStun: number;
  blockStun: number;
  slideTime: number;
  slideSpeed: number;
  hitboxes: Hitbox[];
  pushboxes: Pushbox[];
  hurtboxes: Pushbox[];
  projectiles?: Projectile[];
  frames: Frame[];
}
