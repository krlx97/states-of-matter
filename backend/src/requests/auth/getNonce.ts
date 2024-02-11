import type {SocketRequest} from "@som/shared/types/backend";
import { mongo } from "app";

const getNonce: SocketRequest = (socket, error): void => {
  const {$players} = mongo;

  socket.on("getNonce", async (params) => {
    const {address} = params;
    const $player = await $players.findOne({address});

    if (!$player) {
      return error("Player not found.");
    }

    const {nonce} = $player;

    socket.emit("getNonce", {nonce});
  })
};

export {getNonce};
