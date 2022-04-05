import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

export const disconnect: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("disconnect", async (reason) => {
    const $player = await $players.findOneAndUpdate({socketId}, {
      $set: {
        socketId: "",
        status: PlayerStatus.OFFLINE
      }
    }, {
      returnDocument: "after"
    });

    if (!$player.value) { return; }

    const {username, status, social} = $player.value;
    const socketIds = await mongoService.getSocketIds(social.friends);

    io.to(socketIds).emit("updateStatus", {username, status});
  });
};
