import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const setBanner: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("setBanner", async (params) => {
    const {bannerId} = params;

    if (bannerId < 200 || bannerId > 299) {
      return error("Invalid banner.");
    }

    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    if (bannerId === 201 && $player.elo < 600) {
      return error("Can't select this avatar.");
    }

    if (bannerId === 202 && $player.elo < 800) {
      return error("Can't select this avatar.");
    }

    if (bannerId === 203 && $player.elo < 1000) {
      return error("Can't select this avatar.");
    }

    const $playerUpdate = await $players.findOneAndUpdate({socketId}, {
      $set: {bannerId}
    }, {
      returnDocument: "after"
    });

    if (!$playerUpdate) {
      return error("Failed to update player.");
    }

    const {name} = $playerUpdate;

    socket.emit("updatePlayer", {bannerId});
    server.io.emit("updateFriend", {name, bannerId});
  });
};

export {setBanner};
