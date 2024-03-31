import {contracts, mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const selectSkin: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("selectSkin" as any, async (params: any): Promise<void> => {
    const {cardId, skinId} = params;

    // if (!item || item.type !== 2) {
    //   return error("Selected item isn't a skin.");
    // }

    // const balance = await contracts.skins.balanceOf($player.address, id);

    // if (balance.lte(0)) {
    //   return error("You do not own the skin.");
    // }

    const $playerUpdate = await $players.updateOne({
      socketId,
      "skins.cardId": cardId
    }, {
      $set: {
        "skins.$": {cardId, skinId}
      }
    });

    if (!$playerUpdate.modifiedCount) {
      // most likely failed because skins.$ object not found, in that case add
      // it instead.
      const $playerUpdate2 = await $players.updateOne({socketId}, {
        $addToSet: {
          skins: {cardId, skinId}
        }
      });

      if (!$playerUpdate2) {
        return error("Failed to set the skin.");
      }
    }

    socket.emit("selectSkin", {cardId, skinId});
  });
};

export {selectSkin};
