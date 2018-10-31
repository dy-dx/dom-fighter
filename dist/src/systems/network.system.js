import { CharacterSide, } from "../components.js";
import Network, { MessageType } from "../network.js";
export default class NetworkSystem {
    constructor(game) {
        this.pingInterval = 240;
        this.game = game;
        const urlParams = new URLSearchParams(window.location.search);
        this.network = new Network({
            onReadyCallback: this.onReady.bind(this),
            onMessageCallback: this.onMessage.bind(this),
            clientId: urlParams.get("id"),
            peerId: urlParams.get("peerid"),
            localPort: parseInt(urlParams.get("localport") || "", 10),
        });
        this.roundtripLatency = -1;
        this.tickDelay = 4;
        this.clientInputs = [];
        this.remoteInputs = [];
        // weird hack to make the game wait for "future" inputs
        for (let i = 0; i < this.tickDelay; i++) {
            const fakeInputComp = {
                left: false,
                up: false,
                right: false,
                down: false,
                attack: false,
            };
            this.clientInputs.push({ tick: i, inputComp: fakeInputComp });
            this.remoteInputs.push({ tick: i, inputComp: fakeInputComp });
        }
        this.isConnectionReady = false;
        // Initialize to true so the player can do stuff while waiting for a connection
        // (we reset the simulation when the connection begins)
        this.isSimulationReady = true;
    }
    debugInfo() {
        return {
            isSimulationReady: this.isSimulationReady,
            isConnectionReady: this.isConnectionReady,
            tickDelay: this.tickDelay,
            roundtripLatency: this.roundtripLatency,
        };
    }
    update(entities, dt) {
        if (!this.isConnectionReady) {
            return;
        }
        // Stall the game simulation unless we've received the necessary inputs
        this.isSimulationReady = false;
        let clientCharacter;
        let remoteCharacter;
        const simulationTick = this.game.getSimulationTick();
        const updateTick = this.game.getUpdateTick();
        const futureInputTick = simulationTick + this.tickDelay;
        if (updateTick % this.pingInterval === 0) {
            this.sendPing();
        }
        entities
            .filter((e) => !!e.characterStateComp)
            .forEach((e) => {
            if (this.network.isHost) {
                e.isControlledByClient = e.characterStateComp.side === CharacterSide.P1;
            }
            else {
                e.isControlledByClient = e.characterStateComp.side === CharacterSide.P2;
            }
            if (e.isControlledByClient) {
                clientCharacter = e;
            }
            else {
                remoteCharacter = e;
            }
        });
        while (this.remoteInputs.length) {
            const { inputComp: nextInput, tick } = this.remoteInputs[0];
            if (tick < simulationTick) {
                this.remoteInputs.splice(0, 1);
                continue;
            }
            if (tick === simulationTick) {
                Object.assign(remoteCharacter.inputComp, nextInput);
                this.isSimulationReady = true;
            }
            break;
        }
        for (let i = this.clientInputs.length - 1; i >= 0; i--) {
            const { tick } = this.clientInputs[i];
            if (tick < simulationTick) {
                this.clientInputs.splice(i, 1);
            }
        }
        const futureClientInput = this.clientInputs.find((e) => e.tick === futureInputTick);
        if (!futureClientInput) {
            const futureClientInputComp = Object.assign({}, clientCharacter.inputComp);
            this.clientInputs.push({ inputComp: futureClientInputComp, tick: futureInputTick });
            this.sendInput(futureClientInputComp, futureInputTick);
        }
        const clientInput = this.clientInputs.find((e) => e.tick === simulationTick);
        if (this.isSimulationReady && clientInput) {
            Object.assign(clientCharacter.inputComp, clientInput.inputComp);
        }
        if (!this.isSimulationReady) {
            console.warn("No remote input available, increase the frame delay");
        }
    }
    onReady() {
        this.isConnectionReady = true;
        this.game.resetSimulation();
        this.sendChat(`hello from ${this.network.clientId}`);
        this.sendPing();
    }
    onMessage(type, data) {
        if (type === MessageType.Ping) {
            this.onPing(data);
        }
        else if (type === MessageType.Pong) {
            this.onPong(data);
        }
        else if (type === MessageType.Chat) {
            this.onChat(data);
        }
        else if (type === MessageType.Input) {
            this.onInput(data);
        }
        else {
            console.warn("Unhandled message type:", type, data);
        }
    }
    onChat(s) {
        console.log("Chat received:", s);
    }
    onInput(data) {
        this.remoteInputs.push(data);
    }
    onPing(timestamp) {
        this.network.send(MessageType.Pong, timestamp);
    }
    onPong(timestamp) {
        this.roundtripLatency = Date.now() - timestamp;
    }
    sendChat(text) {
        this.network.send(MessageType.Chat, text);
    }
    sendInput(inputComp, tick) {
        this.network.send(MessageType.Input, { inputComp, tick });
    }
    sendPing() {
        this.network.send(MessageType.Ping, Date.now());
    }
}
//# sourceMappingURL=network.system.js.map