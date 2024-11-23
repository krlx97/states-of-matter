import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const getAddress: SocketRequest = (socket, error): void => {
  const {$players} = mongo;

  socket.on("getAddress" as any, async ({name}: any): Promise<void> => {
    const $player = await $players.findOne({name});

    if (!$player) {
      return error("Player not found.");
    }

    if (!$player.address) {
      return error("This player hasn't connected an address yet.");
    }

    const {address} = $player;

    socket.emit("getAddress" as any, {address});
  });
};

export {getAddress};
