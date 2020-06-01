import IGameObject from "./IGameObject";

export default interface IPlayer extends IGameObject {
  type: "PLAYER";
  socketId: string;
  dead: boolean;
}

export function instanceOfPlayer(object: any): object is IPlayer {
  return object.type && object.type === "PLAYER";
}
