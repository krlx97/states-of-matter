import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const disconnect: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("disconnect", async () => {
    const $playerUpdate = await mongo.$players.findOneAndUpdate({socketId}, {
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

    const {name, status} = $playerUpdate;
    server.io.emit("updateFriend", {name, status});
  });
};

export {disconnect};
