import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const setBanner: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("setBanner", async (params) => {
    const {bannerId} = params;

    if (bannerId < 2000 || bannerId > 2999) {
      return error("Invalid banner.");
    }

    // check whether player owns the avatar here!

    const $playerUpdate = await $players.findOneAndUpdate({socketId}, {
      $set: {bannerId}
    }, {
      returnDocument: "after"
    });

    if (!$playerUpdate) {
      return error("Failed to update player.");
    }

    const {name, social} = $playerUpdate;
    const socketIds = await playerHelpers.getSocketIds(social.friends);

    socket.emit("updatePlayer", {bannerId});
    server.io.to(socketIds).emit("updateFriend", {name, bannerId});
  });
};

export {setBanner};
