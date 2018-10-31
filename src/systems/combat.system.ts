import ISystem from "./system.js";

export default class CombatSystem implements ISystem {
  public update(entities, dt): void {
    const physicsEntities = entities.filter((e) => e.physicsComp);

    physicsEntities.forEach((e) => {
      if (!e.physicsComp.hitbox.isActive) {
        return;
      }

      physicsEntities.filter((o) => e !== o && o.physicsComp.hurtbox).forEach((o) => {
        if (this.overlaps(e, o)) {
          // fixme lol
          o.isMarkedForRemoval = true;
        }
      });
    });
  }

  private overlaps(a, b): boolean {
      const bounds = {
        left: a.positionComp.x + a.physicsComp.hitbox.x,
        top: a.positionComp.y + a.physicsComp.hitbox.height,
        right: 0,
        bottom: 0,
      };
      bounds.right = bounds.left + a.physicsComp.hitbox.width;
      bounds.bottom = bounds.top - a.physicsComp.hitbox.height;

      const compare = {
        left: b.positionComp.x + b.physicsComp.hurtbox.x,
        top: b.positionComp.y + b.physicsComp.hurtbox.height,
        right: 0,
        bottom: 0,
      };
      compare.right = compare.left + b.physicsComp.hurtbox.width;
      compare.bottom = compare.top - b.physicsComp.hurtbox.height;

      return !(
        compare.right <= bounds.left
        || compare.left >= bounds.right
        || compare.bottom >= bounds.top
        || compare.top <= bounds.bottom
      );
    }
}
