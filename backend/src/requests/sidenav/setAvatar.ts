import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const setAvatar: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("setAvatar", async (params) => {
    const {avatarId} = params;

    if (avatarId < 100 || avatarId > 199) {
      return error("Invalid avatar.");
    }

    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    if (avatarId === 101 && $player.elo < 600) {
      return error("Can't select this avatar.");
    }

    if (avatarId === 102 && $player.elo < 800) {
      return error("Can't select this avatar.");
    }

    if (avatarId === 103 && $player.elo < 1000) {
      return error("Can't select this avatar.");
    }

    const $playerUpdate = await $players.findOneAndUpdate({socketId}, {
      $set: {avatarId}
    }, {
      returnDocument: "after"
    });

    if (!$playerUpdate) {
      return error("Failed to update player.");
    }

    const {name} = $playerUpdate;

    socket.emit("updatePlayer", {avatarId});
    server.io.emit("updateFriend", {name, avatarId});
  });
};

export {setAvatar};
