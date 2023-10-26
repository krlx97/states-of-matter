import {items} from "@som/shared/data";
import {contracts, mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const selectSkin: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $players} = mongo;

  socket.on("selectSkin", async (params) => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    const {name} = $player;
    const $account = await $accounts.findOne({name});

    if (!$account) {
      return error("Account not found.");
    }

    const {id} = params;
    const item = items.find((item) => item.id === id);

    if (!item || item.type !== 2) { // 2 === skin, make ItemType enum?
      return error("Selected item isn't a skin.");
    }

    const balance = await contracts.skins.balanceOf($account.publicKey, id);

    if (balance.lte(0)) {
      return error("You do not own the skin.");
    }

    const $playerUpdate = await $players.updateOne({
      socketId,
      "skins.cardId": item.cardId
    }, {
      $set: {
        "skins.$": {cardId: item.cardId, skinId: id}
      }
    });

    if (!$playerUpdate.modifiedCount) {
      // most likely failed because skins.$ object not found, in that case add
      // it instead.
      const $playerUpdate2 = await $players.updateOne({socketId}, {
        $addToSet: {
          skins: {cardId: item.cardId, skinId: id}
        }
      });

      if (!$playerUpdate2) {
        return error("Failed to set the skin.");
      }
    }

    socket.emit("selectSkin", {
      cardId: item.cardId,
      skinId: id
    });
  });
};

export {selectSkin};
