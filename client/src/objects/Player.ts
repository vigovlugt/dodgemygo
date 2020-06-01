import * as PIXI from "pixi.js";
import { SYNC_PLAYER } from "../constants";
import IPlayer from "../models/IPlayer";
import GameObject from "./GameObject";

const SPEED = 10;

export default class Player extends GameObject {
  get isLocalPlayer() {
    return !!this.socket;
  }

  private socket: SocketIOClient.Socket;

  public id: string;
  constructor(id: string, socket: SocketIOClient.Socket) {
    super(id);
    this.socket = socket;
  }

  private keys: { [key: string]: boolean } = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  spawn() {
    const sprite = PIXI.Sprite.from("assets/ufo.png");
    sprite.scale.x = 3;
    sprite.scale.y = 3;
    this.addChild(sprite);

    if (this.isLocalPlayer) {
      const circle = new PIXI.Graphics();
      circle.beginFill(0xffff00);
      circle.lineStyle(0);
      circle.drawCircle(16, 0, 2);
      circle.endFill();

      sprite.addChild(circle);

      this.registerInput();
    }
  }

  update(delta: number) {
    if (this.isLocalPlayer) {
      this.handleMovement(delta);
      this.handleCollissions();
      this.syncToServer();
    }
  }

  sync(player: IPlayer) {
    if (this.isLocalPlayer) return;
    this.x = player.x;
    this.y = player.y;
  }

  registerInput() {
    window.addEventListener("keydown", (e) => {
      if (Object.keys(this.keys).indexOf(e.key) !== -1) {
        this.keys[e.key] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (Object.keys(this.keys).indexOf(e.key) !== -1) {
        this.keys[e.key] = false;
      }
    });
  }

  handleMovement(delta: number) {
    if (this.keys.w) this.y -= delta * SPEED;
    if (this.keys.a) this.x -= delta * SPEED;
    if (this.keys.s) this.y += delta * SPEED;
    if (this.keys.d) this.x += delta * SPEED;
  }

  handleCollissions() {}

  syncToServer() {
    const { x, y, id } = this;
    this.socket.emit(SYNC_PLAYER, {
      type: "PLAYER",
      socketId: this.socket.id,
      id,
      x,
      y,
    });
  }
}
