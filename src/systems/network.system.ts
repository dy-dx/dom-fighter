import {
  CharacterSide,
  ICharacterInputComp,
  ICharacterStateComp,
} from "../components.js";
import {IEntity} from "../entities/entity.js";
import Game from "../game.js";
import Network, {MessageType} from "../network.js";
import ISystem from "./system.js";

// fixme
// tslint:disable:no-console

interface ICharacterEntity extends IEntity {
  characterStateComp: ICharacterStateComp;
  inputComp: ICharacterInputComp;
}

interface IInputUpdate {
  inputComp: ICharacterInputComp;
  tick: number;
}

export default class NetworkSystem implements ISystem {
  public isSimulationReady: boolean;
  private game: Game;
  private network: Network;
  // Network state that we don't care to put into an entity
  private roundtripLatency: number;
  private tickDelay: number;
  private clientInputs: IInputUpdate[];
  private remoteInputs: IInputUpdate[];

  constructor(game: Game) {
    this.game = game;
    this.network = new Network({
      onReadyCallback: this.onReady.bind(this),
      onMessageCallback: this.onMessage.bind(this),
    });
    this.roundtripLatency = -1;
    this.tickDelay = 4;
    this.clientInputs = [];
    this.remoteInputs = [];
    // weird hack to make the game wait for "future" inputs
    for (let i = 0; i < this.tickDelay; i++) {
      const fakeInputComp: ICharacterInputComp = {
        left: false,
        up: false,
        right: false,
        down: false,
        attack: false,
      };
      this.clientInputs.push({tick: i, inputComp: fakeInputComp});
      this.remoteInputs.push({tick: i, inputComp: fakeInputComp});
    }
    this.isSimulationReady = false;
  }

  public update(entities: IEntity[], dt: number): void {
    this.isSimulationReady = false;
    if (!this.network.isReady) {
      return;
    }
    let clientCharacter: ICharacterEntity;
    let remoteCharacter: ICharacterEntity;
    const simulationTick = this.game.currentTick;
    const futureInputTick = simulationTick + this.tickDelay;

    entities
      .filter((e): e is ICharacterEntity => !!e.characterStateComp)
      .forEach((e: ICharacterEntity) => {
        if (this.network.isHost) {
          e.isControlledByClient = e.characterStateComp.side === CharacterSide.P1;
        } else {
          e.isControlledByClient = e.characterStateComp.side === CharacterSide.P2;
        }

        if (e.isControlledByClient) {
          clientCharacter = e;
        } else {
          remoteCharacter = e;
        }
      });

    while (this.remoteInputs.length) {
      const {inputComp: nextInput, tick} = this.remoteInputs[0];

      if (tick < simulationTick) {
        this.remoteInputs.splice(0, 1);
        continue;
      }

      if (tick === simulationTick) {
        Object.assign(remoteCharacter!.inputComp, nextInput);
        this.isSimulationReady = true;
      }

      break;
    }

    for (let i = this.clientInputs.length - 1; i >= 0; i--) {
      const {tick} = this.clientInputs[i];

      if (tick < simulationTick) {
        this.clientInputs.splice(i, 1);
      }
    }

    const futureClientInput = this.clientInputs.find((e) => e.tick === futureInputTick);
    if (!futureClientInput) {
      const futureClientInputComp = Object.assign({}, clientCharacter!.inputComp);
      this.clientInputs.push({inputComp: futureClientInputComp, tick: futureInputTick});
      this.sendInput(futureClientInputComp, futureInputTick);
    }

    const clientInput = this.clientInputs.find((e) => e.tick === simulationTick);
    if (this.isSimulationReady && clientInput) {
      Object.assign(clientCharacter!.inputComp, clientInput.inputComp);
    }

    if (!this.isSimulationReady) {
      console.warn("No remote input available, increase the frame delay");
    }
  }

  private onReady() {
    this.sendChat(`hello from ${this.network.clientId}`);
    this.sendPing();
  }

  private onMessage(type: MessageType, data: any): void {
    if (type === MessageType.Ping) {
      this.onPing(data);
    } else if (type === MessageType.Pong) {
      this.onPong(data);
    } else if (type === MessageType.Chat) {
      this.onChat(data);
    } else if (type === MessageType.Input) {
      this.onInput(data);
    } else {
      console.warn("Unhandled message type:", type, data);
    }
  }

  private onChat(s: string): void {
    console.log("Chat received:", s);
  }

  private onInput(data: {inputComp: ICharacterInputComp, tick: number}): void {
    this.remoteInputs.push(data);
  }

  private onPing(timestamp: number): void {
    this.network.send(MessageType.Pong, timestamp);
  }

  private onPong(timestamp: number): void {
    this.roundtripLatency = Date.now() - timestamp;
    console.log("Roundtrip latency:", this.roundtripLatency);
  }

  private sendChat(text: string): void {
    this.network.send(MessageType.Chat, text);
  }

  private sendInput(inputComp: ICharacterInputComp, tick: number): void {
    this.network.send(MessageType.Input, { inputComp, tick });
  }

  private sendPing(): void {
    this.network.send(MessageType.Ping, Date.now());
  }
}
