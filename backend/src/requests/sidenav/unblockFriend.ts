import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const unblockFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $players} = mongo;

  socket.on("unblockFriend", async (params) => {
    const {name} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const $accountUpdate = await $accounts.updateOne({name: $player.name}, {
      $pull: {
        "social.blocked": name
      }
    });

    if (!$accountUpdate.modifiedCount) {
      return error("Failed to update account.");
    }

    socket.emit("unblockFriend", {name});
  });
};

export {unblockFriend};
