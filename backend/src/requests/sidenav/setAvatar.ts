import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const setAvatar: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("setAvatar", async (params) => {
    const {avatarId} = params;

    if (avatarId < 1000 || avatarId > 1999) {
      return error("Invalid avatar.");
    }

    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    if (avatarId === 1001 && $player.elo < 250) {
      return error("Can't select this avatar.");
    }

    if (avatarId === 1002 && $player.elo < 500) {
      return error("Can't select this avatar.");
    }

    if (avatarId === 1003 && $player.elo < 750) {
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

    const {name, social} = $playerUpdate;
    const socketIds = await playerHelpers.getSocketIds(social.friends);

    socket.emit("updatePlayer", {avatarId});
    server.io.to(socketIds).emit("updateFriend", {name, avatarId});
  });
};

export {setAvatar};
