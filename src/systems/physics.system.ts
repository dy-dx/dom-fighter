import {IPhysicsComp, IPositionComp} from "../components.js";
import {IEntity} from "../entities/entity.js";
import ISystem from "./system.js";

interface IPhysicsEntity extends IEntity {
  physicsComp: IPhysicsComp;
  positionComp: IPositionComp;
}

export default class PhysicsSystem implements ISystem {
  private gameWidth: number;

  constructor(gameWidth: number) {
    this.gameWidth = gameWidth;
  }

  public update(entities: IEntity[], dt: number): void {
    const physicsEntities = entities.filter((e): e is IPhysicsEntity => !!e.physicsComp);
    const pushboxEntities = physicsEntities.filter((e) => e.physicsComp.pushbox.isActive);

    physicsEntities.forEach((e) => {
      const p: IPositionComp = e.positionComp;
      const ph: IPhysicsComp = e.physicsComp;
      p.x += ph.velocityX * dt;
      p.y += ph.velocityY * dt;
     });

    pushboxEntities.forEach((e) => {
      const p: IPositionComp = e.positionComp;

      pushboxEntities.filter((o) => e !== o).forEach((o) => {
        if (!this.overlaps(e, o)) { return; }

        const left = e.positionComp.x + e.physicsComp.pushbox.x;
        const right = left + e.physicsComp.pushbox.width;
        const oLeft = o.positionComp.x + o.physicsComp.pushbox.x;
        const oRight = oLeft + o.physicsComp.pushbox.width;

        if (!(right > oLeft && left < oRight)) { return; }

        if (right < oRight) {
          const distance = right - oLeft;
          p.x -= Math.floor(distance / 2);
          o.positionComp.x += Math.ceil(distance / 2);
        } else if (left > oLeft) {
          const distance = oRight - left;
          p.x += Math.floor(distance / 2);
          o.positionComp.x -= Math.ceil(distance / 2);
        } else {
          // todo
        }
      });
    });

    pushboxEntities.forEach((e) => {
      const p: IPositionComp = e.positionComp;
      const ph: IPhysicsComp = e.physicsComp;
      // Clamp to stage bounds
      const minX = -ph.pushbox.x;
      const maxX = this.gameWidth - ph.pushbox.x - ph.pushbox.width;
      p.x = Math.max(p.x, minX);
      p.x = Math.min(p.x, maxX);
    });
  }

  private overlaps(a: IPhysicsEntity, b: IPhysicsEntity): boolean {
      const bounds = {
        left: a.positionComp.x + a.physicsComp.pushbox.x,
        top: a.positionComp.y + a.physicsComp.pushbox.height,
        right: 0,
        bottom: 0,
      };
      bounds.right = bounds.left + a.physicsComp.pushbox.width;
      bounds.bottom = bounds.top - a.physicsComp.pushbox.height;

      const compare = {
        left: b.positionComp.x + b.physicsComp.pushbox.x,
        top: b.positionComp.y + b.physicsComp.pushbox.height,
        right: 0,
        bottom: 0,
      };
      compare.right = compare.left + b.physicsComp.pushbox.width;
      compare.bottom = compare.top - b.physicsComp.pushbox.height;

      return !(
        compare.right <= bounds.left
        || compare.left >= bounds.right
        || compare.bottom >= bounds.top
        || compare.top <= bounds.bottom
      );
    }
}
