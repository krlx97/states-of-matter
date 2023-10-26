import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const updateStatus: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $players} = mongo;

  socket.on("updateFriend", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    const $account = await $accounts.findOne({name: $player.name});

    if (!$account) {
      return error("Player account not found.");
    }

    const {name, status} = $player;
    const socketIds = await playerHelpers.getSocketIds($account.social.friends);

    if (socketIds.length) {
      server.io.to(socketIds).emit("updateFriend", {name, status});
    }
  });
};

export {updateStatus};
