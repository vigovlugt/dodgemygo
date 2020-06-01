import socketIo from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);
const io = socketIo(server);

const SYNC_PLAYER = "SYNC_PLAYER";
const SYNC_GAME = "SYNC_GAME";

const gameObjects: { [id: string]: any } = {};

io.on("connection", (socket) => {
  console.log("PLAYER JOIN: " + socket.id);

  socket.on(SYNC_PLAYER, (playerData: any) => {
    gameObjects[playerData.id] = { ...playerData, socketId: socket.id };
  });

  socket.on("disconnect", () => {
    console.log("PLAYER LEAVE: " + socket.id);
    const playerObj = Object.values(gameObjects).find(
      (obj) => obj.socketId == socket.id
    );
    if (playerObj) delete gameObjects[playerObj.id];
  });
});

setInterval(() => {
  if (Object.keys(gameObjects).length) {
    io.emit(SYNC_GAME, gameObjects);
  }
}, 1000 / 60);

setInterval(() => {
  console.log(gameObjects);
}, 1000);

server.listen(3000, () => console.log("Listening on :3000"));
