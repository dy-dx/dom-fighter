import Peer from "./util/peer-wrapper.js";

export enum MessageType {
  Input,
  InputAck,
  Ping,
  Pong,
  Chat,
}

type OnMessageCallback = (type: MessageType, data: any) => void;
type OnReadyCallback = () => void;
interface IContructorParams {
  onReadyCallback: OnReadyCallback;
  onMessageCallback: OnMessageCallback;
  clientId: string | null;
  peerId: string | null;
  localPort: number | null;
}

export default class Network {
  public clientId: string;
  public peerId: string | null;
  public isHost: boolean;
  private peer: Peer;
  private connection: Peer.DataConnection | null;
  private onMessageCallback: OnMessageCallback;
  private onReadyCallback: OnReadyCallback;

  constructor({onMessageCallback, onReadyCallback, clientId, peerId, localPort}: IContructorParams) {
    this.onMessageCallback = onMessageCallback;
    this.onReadyCallback = onReadyCallback;

    this.clientId = clientId || `df-${Math.random().toString(36).substring(2, 9)}`;
    this.peerId = peerId || null;
    this.isHost = !this.peerId;

    const peerOpts: Peer.PeerJSOption = {
      debug: 2,
    };
    if (localPort) {
      Object.assign(peerOpts, {
        host: "localhost",
        port: localPort,
        config: { iceServers: [{url: "stun:localhost:3478"}] },
      });
    }

    this.peer = new Peer(this.clientId, peerOpts);
    this.connection = null;

    if (this.peerId) {
      this.connection = this.peer.connect(this.peerId, {reliable: false});
      this.connection.on("open", this.onOpen.bind(this));
    } else {
      this.peer.on("connection", (conn) => {
        this.connection = conn;
        this.peerId = conn.peer;
        this.connection.on("open", this.onOpen.bind(this));
      });
    }
  }

  public send(type: MessageType, data: any): void {
    this.connection!.send({ type, data });
  }

  private onOpen(id: string): void {
    this.connection!.on("data", this.onMessage.bind(this));
    this.onReadyCallback();
  }

  private onMessage(msg: any): void {
    if (msg.type == null) {
      console.warn("Malformed network message", msg); // tslint:disable-line:no-console
      return;
    }
    const {type, data}: {type: MessageType, data: any} = msg;

    this.onMessageCallback(type, data);
  }
}
