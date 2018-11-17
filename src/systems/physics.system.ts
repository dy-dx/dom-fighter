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
    // fixme?
    const pushboxEntities = physicsEntities.filter((e) => e.physicsComp.pushbox.isActive);

    physicsEntities.forEach((e) => {
      const p: IPositionComp = e.positionComp;
      const ph: IPhysicsComp = e.physicsComp;
      const {velocityX: vx, velocityY: vy} = ph;

      p.x += vx * dt;
      p.y += vy * dt;

      if (!ph.isMoveable || !ph.pushbox.isActive) { return; }

      // Clamp to stage bounds
      const minX = -ph.pushbox.x;
      const maxX = this.gameWidth - ph.pushbox.x - ph.pushbox.width;
      p.x = Math.max(p.x, minX);
      p.x = Math.min(p.x, maxX);

      // naive collision handling, resolve x only
      if (vx !== 0) {
        pushboxEntities.filter((o) => e !== o).forEach((o) => {
          if (this.overlaps(e, o)) {
            const oLeft = o.positionComp.x + o.physicsComp.pushbox.x;
            if (Math.sign(vx) > 0) {
              p.x = oLeft - e.physicsComp.pushbox.width - e.physicsComp.pushbox.x;
            } else {
              p.x = oLeft + o.physicsComp.pushbox.width - e.physicsComp.pushbox.x;
            }
          }
        });

        // Clamp to stage bounds again, idk
        p.x = Math.max(p.x, minX);
        p.x = Math.min(p.x, maxX);
      }
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
