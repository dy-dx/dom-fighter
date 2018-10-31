import { CharacterState, } from "../components.js";
import { hitboxOverlaps } from "../util/aabb.js";
import attackData from "../data/attack.js";
export default class CombatSystem {
    update(entities, dt) {
        const physicsEntities = entities.filter((e) => !!e.combatComp);
        physicsEntities.forEach((e) => {
            if (!e.physicsComp.blockbox.isActive) {
                return;
            }
            physicsEntities.filter((o) => e !== o && o.physicsComp.pushbox.isActive).forEach((o) => {
                if (o.characterStateComp && this.testBlockbox(e, o)) {
                    o.combatComp.isInBlockbox = true;
                }
            });
            if (e.combatComp.hasHit || !e.physicsComp.hitbox.isActive) {
                return;
            }
            physicsEntities.filter((o) => e !== o && o.physicsComp.hurtbox.isActive).forEach((o) => {
                if (o.characterStateComp && this.testHitbox(e, o)) {
                    if (o.characterStateComp.state === CharacterState.Block ||
                        o.characterStateComp.state === CharacterState.Blockstun) {
                        o.combatComp.hitStun = attackData.blockStun;
                    }
                    else {
                        o.combatComp.hitStun = attackData.hitStun;
                        o.characterStateComp.health -= Math.min(attackData.damage, o.characterStateComp.health);
                    }
                    // prevent attack from dealing more damage on subsequent frames
                    e.combatComp.hasHit = true;
                    e.combatComp.hitStop = attackData.hitStop;
                    o.combatComp.hitStop = attackData.hitStop;
                    o.combatComp.slideTime = attackData.slideTime;
                    o.combatComp.slideSpeed = attackData.slideSpeed;
                    // Opponent slides in the direction that the character is facing
                    o.combatComp.slideDirection = e.characterStateComp.facingDirection;
                }
            });
        });
    }
    testBlockbox(a, b) {
        return hitboxOverlaps(a.positionComp, a.physicsComp.blockbox, b.positionComp, 
        // is this supposed to test against pushbox or hurtbox?
        b.physicsComp.pushbox);
    }
    testHitbox(a, b) {
        return hitboxOverlaps(a.positionComp, a.physicsComp.hitbox, b.positionComp, b.physicsComp.hurtbox);
    }
}
//# sourceMappingURL=combat.system.js.map