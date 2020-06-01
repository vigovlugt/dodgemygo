import IGameObject from "../models/IGameObject";
import GameObject from "../objects/GameObject";
import { SYNC_GAME } from "../constants";
import Player from "../objects/Player";
import IPlayer, { instanceOfPlayer } from "../models/IPlayer";
import * as PIXI from "pixi.js";
import uuidv4 from "../utils/uuid";

export default class GameObjectManager {
  public static instance: GameObjectManager;

  public gameObjects: { [id: string]: GameObject } = {};

  private app: PIXI.Application;
  private socket: SocketIOClient.Socket;

  constructor(app: PIXI.Application, socket: SocketIOClient.Socket) {
    GameObjectManager.instance = this;
    this.socket = socket;
    this.app = app;

    this.socket.on(SYNC_GAME, (sync: any) => this.onSyncGame(sync));
    this.socket.on("connect", () => this.spawnLocalPlayer());

    app.ticker.add((delta) => this.update(delta));
  }

  onSyncGame(serverGameObjects: { [id: string]: IGameObject }) {
    Object.values(serverGameObjects).forEach((obj) => {
      if (this.gameObjects.hasOwnProperty(obj.id)) {
        this.gameObjects[obj.id].sync(obj);
      } else {
        this.spawn(obj);
      }
    });

    Object.keys(this.gameObjects).forEach((id) => {
      if (!serverGameObjects.hasOwnProperty(id)) {
        this.destroy(this.gameObjects[id]);
        delete this.gameObjects[id];
      }
    });
  }

  spawnLocalPlayer() {
    const player = new Player(this.socket.id, this.socket);
    player.id = uuidv4();
    this.app.stage.addChild(player);
    this.gameObjects[player.id] = player;
    player.spawn();
  }

  update(delta: number) {
    Object.values(this.gameObjects).forEach((obj) => obj.update(delta));
  }

  spawn(object: IGameObject) {
    console.log("SPAWN", object.type);

    let gameObject;

    if (instanceOfPlayer(object) || object.type == "PLAYER") {
      gameObject = new Player(
        object.id,
        (object as IPlayer).socketId === this.socket.id ? this.socket : null
      );
    }

    this.gameObjects[gameObject.id] = gameObject;
    this.app.stage.addChild(gameObject);
    gameObject.spawn();
    gameObject.sync(object as any);
  }

  destroy(object: GameObject) {
    console.log("DELETE", typeof object);
    object.destroy();
  }
}
