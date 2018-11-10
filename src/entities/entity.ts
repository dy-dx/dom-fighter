import {
  IAppearanceComp,
  ICharacterInputComp,
  ICharacterStateComp,
  ICombatComp,
  IInputComp,
  IPhysicsComp,
  IPositionComp,
} from "../components.js";

export interface IEntity {
  isMarkedForRemoval: boolean;
  isSafeToRemove: boolean;

  appearanceComp?: IAppearanceComp;
  characterStateComp?: ICharacterStateComp;
  combatComp?: ICombatComp;
  inputComp?: ICharacterInputComp | IInputComp;
  physicsComp?: IPhysicsComp;
  positionComp?: IPositionComp;

  isControlledByClient?: boolean;
}
