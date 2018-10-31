import { CharacterSide } from "./components.js";
import Character from "./entities/character.js";
import Stage from "./entities/stage.js";
import CharacterStateSystem from "./systems/character-state.system.js";
import CombatSystem from "./systems/combat.system.js";
import DebugRenderSystem from "./systems/debug-render.system.js";
import DebugSystem from "./systems/debug.system.js";
import InputSystem from "./systems/input.system.js";
import NetworkSystem from "./systems/network.system.js";
import PhysicsSystem from "./systems/physics.system.js";
import RenderSystem from "./systems/render.system.js";
import deepClone from "./util/deep-clone.js";
export default class Game {
    constructor(elem, width, height) {
        this.approximateAvgRenderMs = 0;
        this.approximateAvgUpdateMs = 0;
        this.simulationTick = 0;
        this.updateTick = 0;
        this.isPaused = false;
        this.entities = [];
        this.width = width;
        this.height = height;
        elem.style.width = `${width}px`;
        elem.style.height = `${height}px`;
        this.resetSimulation();
        this.networkSystem = new NetworkSystem(this);
        this.inputSystems = [
            new InputSystem(document),
            this.networkSystem,
            new DebugSystem(this, document),
        ];
        this.simulationSystems = [
            new CharacterStateSystem(this),
            new PhysicsSystem(this.width),
            new CombatSystem(),
        ];
        this.renderSystems = [
            new RenderSystem(elem),
            new DebugRenderSystem(this, elem),
        ];
    }
    getSimulationTick() {
        return this.simulationTick;
    }
    getUpdateTick() {
        return this.updateTick;
    }
    getP1() {
        // pretty dumb but it'll work for now
        return this.entities[0];
    }
    getP2() {
        // pretty dumb but it'll work for now
        return this.entities[1];
    }
    areDebugControlsAllowed() {
        return !this.networkSystem.isConnectionReady;
    }
    resetSimulation() {
        this.isPaused = false;
        this.simulationTick = 0;
        this.entities = [];
        const p1 = new Character(CharacterSide.P1, this.width / 2 - this.width / 4);
        p1.isControlledByClient = true;
        const p2 = new Character(CharacterSide.P2, this.width / 2 + this.width / 4);
        this.entities.push(p1);
        this.entities.push(p2);
        this.entities.push(new Stage(this.width, this.height));
        // fixme, terrible hack
        this.entities.forEach((e, i) => e.id = i);
    }
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    update(dt) {
        const t0 = performance.now();
        this.inputSystems.forEach((s) => {
            s.update(this.entities, dt);
        });
        if (!this.isPaused && this.networkSystem.isSimulationReady) {
            this.tick(dt);
        }
        this.updateTick++;
        this.approximateAvgUpdateMs += (performance.now() - t0 - this.approximateAvgUpdateMs) / 60;
    }
    render(dt) {
        const t0 = performance.now();
        this.renderSystems.forEach((s) => {
            s.update(this.entities, dt);
        });
        this.approximateAvgRenderMs += (performance.now() - t0 - this.approximateAvgRenderMs) / 60;
    }
    advanceFrame() {
        if (!this.isPaused) {
            return;
        }
        this.tick(1);
    }
    getStateCopy() {
        return deepClone(this.entities);
    }
    loadState(entities) {
        this.entities = entities;
    }
    tick(dt) {
        this.simulationSystems.forEach((s) => {
            s.update(this.entities, dt);
        });
        this.simulationTick++;
    }
}
//# sourceMappingURL=game.js.map