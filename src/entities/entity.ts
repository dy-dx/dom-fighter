import {
  IAppearanceComp,
  ICharacterDefinitionComp,
  ICharacterInputComp,
  ICharacterStateComp,
  ICombatComp,
  IInputComp,
  IPhysicsComp,
  IPositionComp,
} from "../components.js";

export interface IEntity {
  id: number;

  appearanceComp?: IAppearanceComp;
  characterDefinitionComp?: ICharacterDefinitionComp;
  characterStateComp?: ICharacterStateComp;
  combatComp?: ICombatComp;
  inputComp?: ICharacterInputComp | IInputComp;
  physicsComp?: IPhysicsComp;
  positionComp?: IPositionComp;

  isControlledByClient?: boolean;
}
