export var FacingDirection;
(function (FacingDirection) {
    FacingDirection[FacingDirection["Left"] = 0] = "Left";
    FacingDirection[FacingDirection["Right"] = 1] = "Right";
})(FacingDirection || (FacingDirection = {}));
export var CharacterState;
(function (CharacterState) {
    CharacterState[CharacterState["Stand"] = 0] = "Stand";
    CharacterState[CharacterState["Walk"] = 1] = "Walk";
    CharacterState[CharacterState["Jump"] = 2] = "Jump";
    CharacterState[CharacterState["JumpEnd"] = 3] = "JumpEnd";
    CharacterState[CharacterState["Attack"] = 4] = "Attack";
    CharacterState[CharacterState["AttackEnd"] = 5] = "AttackEnd";
    CharacterState[CharacterState["Block"] = 6] = "Block";
    CharacterState[CharacterState["BlockEnd"] = 7] = "BlockEnd";
    CharacterState[CharacterState["Blockstun"] = 8] = "Blockstun";
    CharacterState[CharacterState["Hitstop"] = 9] = "Hitstop";
    CharacterState[CharacterState["Hitstun"] = 10] = "Hitstun";
    CharacterState[CharacterState["HitstunEnd"] = 11] = "HitstunEnd";
})(CharacterState || (CharacterState = {}));
//# sourceMappingURL=components.js.map