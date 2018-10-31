import Peer from "./util/peer-wrapper.js";
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["Input"] = 0] = "Input";
    MessageType[MessageType["InputAck"] = 1] = "InputAck";
    MessageType[MessageType["Ping"] = 2] = "Ping";
    MessageType[MessageType["Pong"] = 3] = "Pong";
    MessageType[MessageType["Chat"] = 4] = "Chat";
})(MessageType || (MessageType = {}));
export default class Network {
    constructor({ onMessageCallback, onReadyCallback, clientId, peerId, localPort }) {
        this.onMessageCallback = onMessageCallback;
        this.onReadyCallback = onReadyCallback;
        this.clientId = clientId || `df-${Math.random().toString(36).substring(2, 9)}`;
        this.peerId = peerId || null;
        this.isHost = !this.peerId;
        const peerOpts = {
            debug: 2,
        };
        if (localPort) {
            Object.assign(peerOpts, {
                host: "localhost",
                port: localPort,
                config: { iceServers: [{ url: "stun:localhost:3478" }] },
            });
        }
        this.peer = new Peer(this.clientId, peerOpts);
        this.connection = null;
        if (this.peerId) {
            this.connection = this.peer.connect(this.peerId, { reliable: false });
            this.connection.on("open", this.onOpen.bind(this));
        }
        else {
            this.peer.on("connection", (conn) => {
                this.connection = conn;
                this.peerId = conn.peer;
                this.connection.on("open", this.onOpen.bind(this));
            });
        }
    }
    send(type, data) {
        this.connection.send({ type, data });
    }
    onOpen() {
        this.connection.on("data", this.onMessage.bind(this));
        this.onReadyCallback();
    }
    onMessage(msg) {
        if (msg.type == null) {
            console.warn("Malformed network message", msg); // tslint:disable-line:no-console
            return;
        }
        const { type, data } = msg;
        this.onMessageCallback(type, data);
    }
}
//# sourceMappingURL=network.js.map