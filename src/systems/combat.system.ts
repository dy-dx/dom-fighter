import {
  ICharacterStateComp,
  ICombatComp,
  IPhysicsComp,
  IPositionComp,
} from "../components.js";
import {IEntity} from "../entities/entity.js";
import {hitboxOverlaps} from "../util/aabb.js";
import ISystem from "./system.js";

import attackData from "../data/attack.js";

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
          o.characterStateComp.health -= Math.min(attackData.damage, o.characterStateComp.health);
          // prevent attack from dealing more damage on subsequent frames
          e.combatComp.hasHit = true;
          e.combatComp.hitStop = attackData.hitStop;
          o.combatComp.hitStop = attackData.hitStop;
          o.combatComp.hitStun = attackData.hitStun;
          o.combatComp.slideTime = attackData.slideTime;
          o.combatComp.slideSpeed = attackData.slideSpeed;
          // Opponent slides in the direction that the character is facing
          o.combatComp.slideDirection = e.characterStateComp!.facingDirection;
        }
      });
    });
  }

  private overlaps(a: ICombatEntity, b: ICombatEntity): boolean {
    return hitboxOverlaps(a.positionComp,
      a.physicsComp.hitbox,
      b.positionComp,
      b.physicsComp.hurtbox,
    );
  }
}
