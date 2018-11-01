import {
  IAppearanceComp,
  ICharacterStateComp,
  IInputComp,
  IPhysicsComp,
  IPositionComp,
} from "../components.js";

export interface IEntity {
  isMarkedForRemoval: boolean;
  isSafeToRemove: boolean;

  appearanceComp?: IAppearanceComp;
  characterStateComp?: ICharacterStateComp;
  inputComp?: IInputComp;
  physicsComp?: IPhysicsComp;
  positionComp?: IPositionComp;

  isControlledByClient?: boolean;
}
