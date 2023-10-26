import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const declineFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $players} = mongo;

  socket.on("declineFriend", async (params) => {
    const {name} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const $accountUpdate = await $accounts.updateOne({
      name: $player.name
    }, {
      $pull: {
        "social.requests": name
      }
    });

    if (!$accountUpdate.modifiedCount) {
      return error("Failed to update account.");
    }

    socket.emit("declineFriend", {name});
  });
};

export {declineFriend};
