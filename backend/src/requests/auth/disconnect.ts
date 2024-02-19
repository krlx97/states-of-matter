import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const disconnect: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("disconnect", async () => {
    const $playerUpdate = await $players.findOneAndUpdate({socketId}, {
      $set: {
        socketId: "",
        status: PlayerStatus.OFFLINE
      }
    }, {
      returnDocument: "after"
    });

    if (!$playerUpdate) {
      return error("Error updating player.");
    }

    const {name, status, social} = $playerUpdate;
    const socketIds = await playerHelpers.getSocketIds(social.friends);
    server.io.to(socketIds).emit("updateFriend", {name, status});
  });
};

export {disconnect};
