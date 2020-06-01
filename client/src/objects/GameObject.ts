import IGameObject from "../models/IGameObject";
import * as PIXI from "pixi.js";

export default class GameObject extends PIXI.Container {
  public id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }

  sync(gameObject: IGameObject) {
    this.x = gameObject.x;
    this.y = gameObject.y;
  }

  update(delta: number) {}
}
