import {
  CharacterState,
  ICharacterDefinitionComp,
  ICharacterStateComp,
  IInputComp,
  IPhysicsComp,
} from "../components.js";
import {IEntity} from "../entities/entity.js";
import ISystem from "./system.js";

import attackData from "../data/attack.js";

interface ICharacterEntity extends IEntity {
  characterDefinitionComp: ICharacterDefinitionComp;
  characterStateComp: ICharacterStateComp;
  inputComp: IInputComp;
  physicsComp: IPhysicsComp;
}

enum Direction {
  Up,
  Down,
  Left,
  Right,
}
export default class CharacterStateSystem implements ISystem {
  public update(entities: IEntity[], dt: number): void {
    entities
      .filter((e): e is ICharacterEntity => !!e.characterStateComp)
      .forEach((e: ICharacterEntity) => {
        const pressed = e.inputComp;
        const walkSpeed = e.characterDefinitionComp.walkSpeed;
        const physicsComp = e.physicsComp;
        const stateComp = e.characterStateComp;

        if (stateComp.state === CharacterState.Attack) {
          stateComp.frameIndex++;

          // extract this
          if (stateComp.frameIndex >= attackData.frames.length) {
            this.endAttack(stateComp);
          } else {
            const frameData = attackData.frames[stateComp.frameIndex];
            if (frameData.hitbox) {
              physicsComp.hitbox.isActive = true;
              Object.assign(physicsComp.hitbox, frameData.hitbox);
            } else {
              physicsComp.hitbox.isActive = false;
            }
          }
        }

        if (pressed.left) {
          this.walk(stateComp, physicsComp, walkSpeed, Direction.Left);
        } else if (pressed.right) {
          this.walk(stateComp, physicsComp, walkSpeed, Direction.Right);
        } else {
          this.stand(stateComp, physicsComp);
        }

        if (pressed.attack) {
          this.attack(stateComp, physicsComp);
        }
      });
  }

  private walk(stateComp: ICharacterStateComp, physicsComp: IPhysicsComp, walkSpeed: number, direction: Direction) {
    if (this.setState(stateComp, CharacterState.Walk)) {
      if (direction === Direction.Left) {
        physicsComp.velocityX = -walkSpeed;
      } else if (direction === Direction.Right) {
        physicsComp.velocityX = walkSpeed;
      }
    }
  }

  private stand(stateComp: ICharacterStateComp, physicsComp: IPhysicsComp) {
    if (this.setState(stateComp, CharacterState.Stand)) {
      physicsComp.velocityX = 0;
    }
  }

  private attack(stateComp: ICharacterStateComp, physicsComp: IPhysicsComp) {
    if (this.setState(stateComp, CharacterState.Attack)) {
      physicsComp.velocityX = 0;
      stateComp.frameIndex = 0;
    }
  }

  private endAttack(stateComp: ICharacterStateComp) {
    this.setState(stateComp, CharacterState.AttackEnd);
    this.setState(stateComp, CharacterState.Stand);
    stateComp.frameIndex = 0;
  }

  private setState(stateComp: ICharacterStateComp, targetState: CharacterState): boolean {
    if (this.canSetState(stateComp, targetState)) {
      stateComp.state = targetState;
      return true;
    }
    return false;
  }
  private canSetState(stateComp: ICharacterStateComp, targetState: CharacterState): boolean {
    if (targetState === CharacterState.Stand) {
      return [CharacterState.Walk, CharacterState.AttackEnd].includes(stateComp.state);
    } else if (targetState === CharacterState.Walk) {
      return [CharacterState.Walk, CharacterState.Stand].includes(stateComp.state);
    } else if (targetState === CharacterState.Attack) {
      return [CharacterState.Walk, CharacterState.Stand].includes(stateComp.state);
    } else if (targetState === CharacterState.AttackEnd) {
      return [CharacterState.Attack].includes(stateComp.state);
    }
    return false;
  }

}
