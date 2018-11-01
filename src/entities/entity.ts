import {
  IAppearanceComp,
  ICharacterInputComp,
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
  inputComp?: ICharacterInputComp | IInputComp;
  physicsComp?: IPhysicsComp;
  positionComp?: IPositionComp;

  isControlledByClient?: boolean;
}
