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
}

export default class Network {
  public clientId: string;
  public peerId: string | null;
  public isHost: boolean;
  public isReady: boolean;
  private peer: Peer;
  private connection: Peer.DataConnection | null;
  private onMessageCallback: OnMessageCallback;
  private onReadyCallback: OnReadyCallback;

  constructor({onMessageCallback, onReadyCallback}: IContructorParams) {
    this.onMessageCallback = onMessageCallback;
    this.onReadyCallback = onReadyCallback;
    this.isReady = false;

    const urlParams = new URLSearchParams(window.location.search);
    this.clientId = urlParams.get("id") || `df-${Math.random().toString(36).substring(2, 9)}`;
    this.peerId = urlParams.get("peerid") || null;
    this.isHost = !this.peerId;

    this.peer = new Peer(this.clientId, {debug: 2});
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
    this.isReady = true;
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
