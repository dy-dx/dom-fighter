import {
  ICharacterStateComp,
  ICombatComp,
  IPhysicsComp,
  IPositionComp,
} from "../components.js";
import {IEntity} from "../entities/entity.js";
import ISystem from "./system.js";

interface ICombatEntity extends IEntity {
  combatComp: ICombatComp;
  physicsComp: IPhysicsComp;
  positionComp: IPositionComp;
  characterStateComp?: ICharacterStateComp;
}

export default class CombatSystem implements ISystem {
  public update(entities: IEntity[], dt: number): void {
    const physicsEntities = entities.filter((e): e is ICombatEntity => !!e.combatComp);

    physicsEntities.forEach((e) => {
      if (e.combatComp.hasHit || !e.physicsComp.hitbox.isActive) {
        return;
      }

      physicsEntities.filter((o) => e !== o && o.physicsComp.hurtbox).forEach((o) => {
        if (o.characterStateComp && this.overlaps(e, o)) {
          o.characterStateComp.health -= Math.min(e.combatComp.damage, o.characterStateComp.health);
          // prevent attack from dealing more damage on subsequent frames
          e.combatComp.hasHit = true;
        }
      });
    });
  }

  private overlaps(a: ICombatEntity, b: ICombatEntity): boolean {
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
