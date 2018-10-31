export const MAPPING = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
    KeyA: "left",
    KeyW: "up",
    KeyD: "right",
    KeyS: "down",
    Space: "attack",
    KeyI: "saveState",
    KeyO: "loadState",
    KeyP: "reset",
    KeyK: "pause",
    KeyL: "nextFrame",
};
export default class InputSystem {
    constructor(document) {
        this.pressed = {
            left: false,
            up: false,
            right: false,
            down: false,
            attack: false,
        };
        document.addEventListener("keydown", this.pressKey.bind(this));
        document.addEventListener("keyup", this.releaseKey.bind(this));
    }
    update(entities, dt) {
        entities
            .filter((e) => e.isControlledByClient)
            .forEach((e) => {
            Object.assign(e.inputComp, this.pressed);
        });
    }
    pressKey(evt) {
        if (evt.ctrlKey || evt.metaKey) {
            return;
        }
        const action = MAPPING[evt.code];
        if (!action) {
            return;
        }
        evt.preventDefault();
        if (this.pressed[action] !== undefined) {
            this.pressed[action] = true;
        }
    }
    releaseKey(evt) {
        if (evt.ctrlKey || evt.metaKey) {
            return;
        }
        const action = MAPPING[evt.code];
        if (!action) {
            return;
        }
        evt.preventDefault();
        if (this.pressed[action] !== undefined) {
            this.pressed[action] = false;
        }
    }
}
//# sourceMappingURL=input.system.js.map