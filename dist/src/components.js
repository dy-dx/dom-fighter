export var FacingDirection;
(function (FacingDirection) {
    FacingDirection[FacingDirection["Left"] = 0] = "Left";
    FacingDirection[FacingDirection["Right"] = 1] = "Right";
})(FacingDirection || (FacingDirection = {}));
export var CharacterState;
(function (CharacterState) {
    CharacterState[CharacterState["Stand"] = 0] = "Stand";
    CharacterState[CharacterState["Walk"] = 1] = "Walk";
    CharacterState[CharacterState["Attack"] = 2] = "Attack";
    CharacterState[CharacterState["AttackEnd"] = 3] = "AttackEnd";
    CharacterState[CharacterState["Block"] = 4] = "Block";
    CharacterState[CharacterState["BlockEnd"] = 5] = "BlockEnd";
    CharacterState[CharacterState["Blockstun"] = 6] = "Blockstun";
    CharacterState[CharacterState["Hitstop"] = 7] = "Hitstop";
    CharacterState[CharacterState["Hitstun"] = 8] = "Hitstun";
    CharacterState[CharacterState["HitstunEnd"] = 9] = "HitstunEnd";
})(CharacterState || (CharacterState = {}));
export var CharacterSide;
(function (CharacterSide) {
    CharacterSide[CharacterSide["P1"] = 0] = "P1";
    CharacterSide[CharacterSide["P2"] = 1] = "P2";
})(CharacterSide || (CharacterSide = {}));
//# sourceMappingURL=components.js.map