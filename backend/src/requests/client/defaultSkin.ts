import {mongo} from "apis";
import type {SocketRequest} from "@som/shared/types/backend";

const defaultSkin: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {players} = mongo;

  socket.on("defaultSkin", async (params) => {
    const $player = await players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const {cardId} = params;
    const $playerUpdate = await players.updateOne({socketId}, {
      $pull: {
        skins: {cardId}
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Failed to set default skin");
    }

    socket.emit("defaultSkin", {cardId});
  });
};

export {defaultSkin};
