import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const unblockFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("unblockFriend", async (params) => {
    const {name} = params;

    const $playerUpdate = await $players.updateOne({socketId}, {
      $pull: {
        "social.blocked": name
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Failed to update player.");
    }

    socket.emit("unblockFriend", {name});
  });
};

export {unblockFriend};
