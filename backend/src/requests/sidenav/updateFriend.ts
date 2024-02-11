import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const updateFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("updateFriend", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    const {name, avatarId, bannerId, elo, level, experience, status, games} = $player;
    const friends = await playerHelpers.getSocketIds($player.social.friends);

    if (friends.length) {
      server.io.to(friends).emit("updateFriend", {name, avatarId, bannerId, elo, level, experience, status, games});
    }
  });
};

export {updateFriend};
