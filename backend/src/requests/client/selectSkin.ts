import {items} from "@som/shared/data";
import {contracts, mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const selectSkin: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("selectSkin" as any, async (params: any): Promise<void> => {
    const {cardId, skinId} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    const item = items.find((item): boolean => item.id === skinId);

    if (!item) {
      return error("Invalid skin.");
    }

    if (item.rarity !== 0) {
      const balance = await contracts.collectibles.balanceOf($player.address, skinId);

      if (balance < 1n) {
        return error("You do not own the skin.");
      }
    }

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
