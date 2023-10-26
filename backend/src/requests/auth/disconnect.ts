import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const disconnect: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $players} = mongo;

  socket.on("disconnect", async () => {
    const $playerUpdate = await $players.findOneAndUpdate({socketId}, {
      $set: {
        socketId: "",
        status: PlayerStatus.OFFLINE
      }
    }, {
      returnDocument: "after"
    });

    if (!$playerUpdate.value) {
      return error("Error updating player.");
    }

    const {name, status} = $playerUpdate.value;
    const $account = await $accounts.findOne({name});

    if (!$account) {
      return error("Account not found.");
    }

    const socketIds = await playerHelpers.getSocketIds($account.social.friends);
    server.io.to(socketIds).emit("updateFriend", {name, status});
  });
};

export {disconnect};
