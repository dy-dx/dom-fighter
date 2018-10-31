import { CharacterState, FacingDirection } from "../components.js";
export default class DebugRenderSystem {
    constructor(game, elem) {
        this.game = game;
        if (!elem) {
            throw new Error();
        }
        this.gameElement = elem;
        const healthMeterAppearanceComp = {
            width: 0,
            height: 30,
            zIndex: 100,
        };
        this.p1HealthMeter = {
            appearanceComp: Object.assign({}, healthMeterAppearanceComp),
            positionComp: {
                x: 0,
                y: this.game.height - healthMeterAppearanceComp.height,
            },
            element: document.createElement("div"),
            className: "ui-health ui-health-p1",
        };
        this.p2HealthMeter = {
            appearanceComp: Object.assign({}, healthMeterAppearanceComp),
            positionComp: {
                x: this.game.width / 2,
                y: this.game.height - healthMeterAppearanceComp.height,
            },
            element: document.createElement("div"),
            className: "ui-health ui-health-p2",
        };
        const infoBoxAppearanceComp = {
            width: 180,
            height: 60,
            zIndex: 10000,
        };
        this.infoBox = {
            appearanceComp: infoBoxAppearanceComp,
            positionComp: {
                x: this.game.width / 2 - infoBoxAppearanceComp.width / 2,
                y: this.game.height - infoBoxAppearanceComp.height - healthMeterAppearanceComp.height,
            },
            element: document.createElement("div"),
            className: "ui-debug",
        };
        const playerInfoAppearanceComp = {
            width: 200,
            height: 60,
            zIndex: 10000,
        };
        this.p1InfoBox = {
            appearanceComp: Object.assign({}, playerInfoAppearanceComp),
            positionComp: {
                x: 0,
                y: this.game.height - playerInfoAppearanceComp.height - healthMeterAppearanceComp.height,
            },
            element: document.createElement("div"),
            className: "ui-debug",
        };
        this.p2InfoBox = {
            appearanceComp: Object.assign({}, playerInfoAppearanceComp),
            positionComp: {
                x: this.game.width - playerInfoAppearanceComp.width,
                y: this.game.height - playerInfoAppearanceComp.height - healthMeterAppearanceComp.height,
            },
            element: document.createElement("div"),
            className: "ui-debug",
        };
        [
            this.p1HealthMeter,
            this.p2HealthMeter,
            this.infoBox,
            this.p1InfoBox,
            this.p2InfoBox,
        ].forEach((e) => this.setupElement(e));
    }
    update(entities, dt) {
        const p1 = this.game.getP1();
        const p2 = this.game.getP2();
        const networkInfo = this.game.networkSystem.debugInfo();
        const networkText = !networkInfo.isConnectionReady ? "Waiting for connection" : [
            `delay: ${networkInfo.tickDelay} | ping: ${Math.ceil(networkInfo.roundtripLatency / 2)}ms`,
        ].join("\n");
        this.infoBox.element.textContent = [
            networkText,
            `update: ${this.game.approximateAvgUpdateMs.toFixed(1)}ms`,
            `render: ${this.game.approximateAvgRenderMs.toFixed(1)}ms`,
        ].join("\n");
        this.p1InfoBox.element.textContent = this.displayCharacterInfo(p1);
        this.p2InfoBox.element.textContent = this.displayCharacterInfo(p2);
        this.p1HealthMeter.element.style.width = `${this.calculateHealthMeterWidth(p1).toString()}px`;
        this.p2HealthMeter.element.style.width = `${this.calculateHealthMeterWidth(p2).toString()}px`;
        this.p1HealthMeter.element.style.transform = [
            `translate3d(${(this.game.width / 2) - this.calculateHealthMeterWidth(p1)}px`,
            `${-this.p1HealthMeter.positionComp.y}px,0px)`,
        ].join(",");
    }
    calculateHealthMeterWidth(c) {
        const pct = c.characterStateComp.health / c.characterDefinitionComp.maxHealth;
        return Math.floor(pct * (this.game.width / 2));
    }
    displayCharacterInfo(c) {
        const stateComp = c.characterStateComp;
        return [
            `${stateComp.health}hp | ${c.positionComp.x},${c.positionComp.y} | ${FacingDirection[stateComp.facingDirection]}`,
            `hitstop: ${c.combatComp.hitStop} | hitstun: ${c.combatComp.hitStun}`,
            `${CharacterState[stateComp.state]} [${stateComp.frameIndex}]`,
        ].join("\n");
    }
    setupElement(e) {
        e.element.className = `entity ${e.className}`;
        this.setStyles(e.element, e.appearanceComp, e.positionComp);
        this.gameElement.appendChild(e.element);
    }
    setStyles(elem, appearanceComp, positionComp) {
        elem.style.transform = `translate3d(${positionComp.x}px,${-positionComp.y}px,0px)`;
        elem.style.width = `${appearanceComp.width}px`;
        elem.style.height = `${appearanceComp.height}px`;
        elem.style.zIndex = `${appearanceComp.zIndex}`;
    }
}
//# sourceMappingURL=debug-render.system.js.map