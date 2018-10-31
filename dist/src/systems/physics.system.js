import { hitboxOverlaps } from "../util/aabb.js";
export default class PhysicsSystem {
    constructor(gameWidth) {
        this.gameWidth = gameWidth;
    }
    update(entities, dt) {
        const physicsEntities = entities.filter((e) => !!e.physicsComp);
        const pushboxEntities = physicsEntities.filter((e) => e.physicsComp.pushbox.isActive);
        physicsEntities.forEach((e) => {
            const pos = e.positionComp;
            const { velocityX, velocityY } = e.physicsComp;
            pos.x += velocityX * dt;
            pos.y += velocityY * dt;
        });
        pushboxEntities.forEach((e) => {
            const pos = e.positionComp;
            const pushbox = e.physicsComp.pushbox;
            // Clamp to stage bounds
            const minX = -pushbox.x + 0; // +0 to avoid negative zero issue when using Object.is()
            const maxX = this.gameWidth - pushbox.x - pushbox.width;
            pos.x = Math.max(pos.x, minX);
            pos.x = Math.min(pos.x, maxX);
            pushboxEntities.filter((o) => e !== o).forEach((o) => {
                if (!this.overlaps(e, o)) {
                    return;
                }
                const left = e.positionComp.x + e.physicsComp.pushbox.x;
                const right = left + e.physicsComp.pushbox.width;
                const oLeft = o.positionComp.x + o.physicsComp.pushbox.x;
                const oRight = oLeft + o.physicsComp.pushbox.width;
                if (right <= oRight) {
                    const distance = right - oLeft;
                    if (pos.x <= minX) {
                        // we're already clamped to the stage edge, so move opponent only
                        o.positionComp.x += distance;
                    }
                    else {
                        e.positionComp.x -= Math.floor(distance / 2);
                        o.positionComp.x += Math.ceil(distance / 2);
                    }
                }
                else if (left >= oLeft) {
                    const distance = oRight - left;
                    if (pos.x >= maxX) {
                        // we're already clamped to the stage edge, so move opponent only
                        o.positionComp.x -= distance;
                    }
                    else {
                        e.positionComp.x += Math.floor(distance / 2);
                        o.positionComp.x -= Math.ceil(distance / 2);
                    }
                }
                else if (left === oLeft && right === oRight) {
                    // pushboxes occupy the same space, just move toward middle of stage
                    // this is not a real solution but it's good enough for now
                    if (e.positionComp.x >= this.gameWidth / 2) {
                        e.positionComp.x -= e.physicsComp.pushbox.width;
                    }
                    else {
                        e.positionComp.x += e.physicsComp.pushbox.width;
                    }
                }
            });
        });
    }
    overlaps(a, b) {
        return hitboxOverlaps(a.positionComp, a.physicsComp.pushbox, b.positionComp, b.physicsComp.pushbox);
    }
}
//# sourceMappingURL=physics.system.js.map