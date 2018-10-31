import { CharacterState, FacingDirection, } from "../components.js";
import attackData from "../data/attack.js";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
export default class CharacterStateSystem {
    constructor(game) {
        this.game = game;
    }
    update(entities, dt) {
        entities
            .filter((e) => !!e.characterStateComp)
            .forEach((e) => {
            const pressed = e.inputComp;
            const walkSpeed = e.characterDefinitionComp.walkSpeed;
            const physicsComp = e.physicsComp;
            const positionComp = e.positionComp;
            const stateComp = e.characterStateComp;
            const combatComp = e.combatComp;
            const opponentCharacter = e === this.game.getP1() ? this.game.getP2() : this.game.getP1();
            if (stateComp.health <= 0) {
                // fixme
                physicsComp.hurtbox.isActive = false;
                physicsComp.pushbox.isActive = false;
                physicsComp.hitbox.isActive = false;
                return;
            }
            if (positionComp.x > opponentCharacter.positionComp.x) {
                stateComp.facingDirection = FacingDirection.Left;
            }
            else {
                stateComp.facingDirection = FacingDirection.Right;
            }
            const isFacingLeft = stateComp.facingDirection === FacingDirection.Left;
            Object.assign(physicsComp.pushbox, e.characterDefinitionComp.defaultPushbox);
            Object.assign(physicsComp.hurtbox, e.characterDefinitionComp.defaultHurtbox);
            Object.assign(physicsComp.blockbox, e.characterDefinitionComp.defaultBlockbox);
            if (combatComp.hitStun > 0) {
                this.enterHitstun(stateComp, physicsComp);
            }
            if (stateComp.state === CharacterState.Hitstun) {
                if (combatComp.hitStop > 0) {
                    combatComp.hitStop--;
                    physicsComp.velocityX = 0;
                }
                else if (combatComp.hitStun <= 0) {
                    this.endHitstun(stateComp, physicsComp, combatComp);
                }
                else {
                    combatComp.hitStun--;
                    if (combatComp.slideTime > 0) {
                        combatComp.slideTime--;
                        physicsComp.velocityX = combatComp.slideSpeed * (combatComp.slideDirection === FacingDirection.Right ? 1 : -1);
                    }
                    else {
                        physicsComp.velocityX = 0;
                    }
                }
            }
            if (stateComp.state === CharacterState.Attack) {
                // extract this
                if (stateComp.frameIndex >= attackData.frames.length) {
                    this.endAttack(stateComp, combatComp);
                }
                else {
                    const frameData = attackData.frames[stateComp.frameIndex];
                    if (frameData.hitboxIndex !== undefined) {
                        physicsComp.hitbox.isActive = true;
                        Object.assign(physicsComp.hitbox, attackData.hitboxes[frameData.hitboxIndex]);
                        if (isFacingLeft) {
                            physicsComp.hitbox.x = physicsComp.hitbox.x * -1 - physicsComp.hitbox.width;
                        }
                        // if this is the first active frame, enable damage
                        if (attackData.frames[stateComp.frameIndex - 1].hitboxIndex === undefined) {
                            combatComp.hasHit = false;
                        }
                    }
                    else {
                        physicsComp.hitbox.isActive = false;
                    }
                    if (frameData.blockboxActive) {
                        physicsComp.blockbox.isActive = true;
                    }
                    if (frameData.pushboxIndex !== undefined) {
                        Object.assign(physicsComp.pushbox, attackData.pushboxes[frameData.pushboxIndex]);
                    }
                    if (frameData.hurtboxIndex !== undefined) {
                        Object.assign(physicsComp.hurtbox, attackData.hurtboxes[frameData.hurtboxIndex]);
                    }
                    if (frameData.x) {
                        const offsetX = isFacingLeft ? -frameData.x : frameData.x;
                        // this is intended to push you back more if you land a hit.
                        // very hacky, address this at some point
                        const offsetScale = combatComp.hasHit ? 2 : 1;
                        positionComp.x += offsetX * offsetScale;
                    }
                    if (combatComp.hitStop > 0) {
                        combatComp.hitStop--;
                    }
                    else {
                        stateComp.frameIndex++;
                    }
                }
            }
            if (isFacingLeft) {
                physicsComp.pushbox.x = physicsComp.pushbox.x * -1 - physicsComp.pushbox.width;
                physicsComp.hurtbox.x = physicsComp.hurtbox.x * -1 - physicsComp.hurtbox.width;
                physicsComp.blockbox.x = physicsComp.blockbox.x * -1 - physicsComp.blockbox.width;
            }
            if (stateComp.state === CharacterState.Block && !combatComp.isInBlockbox) {
                this.endBlock(stateComp, physicsComp);
            }
            if (combatComp.isInBlockbox) {
                if ((pressed.left && !isFacingLeft) || (pressed.right && isFacingLeft)) {
                    this.enterBlock(stateComp, physicsComp);
                }
            }
            if (pressed.left) {
                this.walk(stateComp, physicsComp, walkSpeed, Direction.Left);
            }
            else if (pressed.right) {
                this.walk(stateComp, physicsComp, walkSpeed, Direction.Right);
            }
            else {
                this.stand(stateComp, physicsComp);
            }
            if (pressed.attack) {
                this.attack(stateComp, physicsComp);
            }
            // reset for next tick
            combatComp.isInBlockbox = false;
        });
    }
    walk(stateComp, physicsComp, walkSpeed, direction) {
        if (this.setState(stateComp, CharacterState.Walk)) {
            if (direction === Direction.Left) {
                physicsComp.velocityX = -walkSpeed;
            }
            else if (direction === Direction.Right) {
                physicsComp.velocityX = walkSpeed;
            }
        }
    }
    stand(stateComp, physicsComp) {
        if (this.setState(stateComp, CharacterState.Stand)) {
            physicsComp.velocityX = 0;
        }
    }
    attack(stateComp, physicsComp) {
        if (this.setState(stateComp, CharacterState.Attack)) {
            physicsComp.velocityX = 0;
            stateComp.frameIndex = 0;
        }
    }
    enterBlock(stateComp, physicsComp) {
        if (this.setState(stateComp, CharacterState.Block)) {
            physicsComp.velocityX = 0;
        }
    }
    endBlock(stateComp, physicsComp) {
        if (this.setState(stateComp, CharacterState.BlockEnd)) {
            this.setState(stateComp, CharacterState.Stand);
        }
    }
    enterHitstun(stateComp, physicsComp) {
        if (this.setState(stateComp, CharacterState.Hitstun)) {
            stateComp.frameIndex = 0;
            physicsComp.hitbox.isActive = false;
        }
    }
    endAttack(stateComp, combatComp) {
        this.setState(stateComp, CharacterState.AttackEnd);
        this.setState(stateComp, CharacterState.Stand);
        stateComp.frameIndex = 0;
        combatComp.hasHit = false;
        combatComp.hitStop = 0;
    }
    endHitstun(stateComp, physicsComp, combatComp) {
        this.setState(stateComp, CharacterState.HitstunEnd);
        this.setState(stateComp, CharacterState.Stand);
        combatComp.hitStop = 0;
        combatComp.hitStun = 0;
        combatComp.slideTime = 0;
        combatComp.slideSpeed = 0;
        physicsComp.velocityX = 0;
    }
    setState(stateComp, targetState) {
        if (this.canSetState(stateComp, targetState)) {
            stateComp.state = targetState;
            return true;
        }
        return false;
    }
    canSetState(stateComp, targetState) {
        if (targetState === CharacterState.Stand) {
            return [
                CharacterState.Walk,
                CharacterState.HitstunEnd,
                CharacterState.AttackEnd,
                CharacterState.BlockEnd,
            ].includes(stateComp.state);
        }
        else if (targetState === CharacterState.Walk) {
            return [CharacterState.Walk, CharacterState.Stand].includes(stateComp.state);
        }
        else if (targetState === CharacterState.Attack) {
            return [CharacterState.Walk, CharacterState.Stand].includes(stateComp.state);
        }
        else if (targetState === CharacterState.AttackEnd) {
            return [CharacterState.Attack].includes(stateComp.state);
        }
        else if (targetState === CharacterState.HitstunEnd) {
            return [CharacterState.Hitstun].includes(stateComp.state);
        }
        else if (targetState === CharacterState.Hitstun) {
            // can't get hit if you're blocking
            return ![CharacterState.Block].includes(stateComp.state);
        }
        else if (targetState === CharacterState.Block) {
            return [CharacterState.Walk, CharacterState.Stand].includes(stateComp.state);
        }
        else if (targetState === CharacterState.BlockEnd) {
            return [CharacterState.Block].includes(stateComp.state);
        }
        return false;
    }
}
//# sourceMappingURL=character-state.system.js.map