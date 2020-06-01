import * as PIXI from "pixi.js";
import Player from "./objects/Player";
import * as io from "socket.io-client";
import { SYNC_GAME } from "./constants";
import IPlayer from "./models/IPlayer";
import GameObjectManager from "./managers/GameObjectManager";

//Create a Pixi Application
let app = new PIXI.Application({
  width: 1920,
  height: 969,
  backgroundColor: 0x333333,
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

document.body.appendChild(app.view);

const socket = io("192.168.178.60:3000");

new GameObjectManager(app, socket);
