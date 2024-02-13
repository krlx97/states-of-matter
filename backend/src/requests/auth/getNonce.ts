import type {SocketRequest} from "@som/shared/types/backend";
import { mongo } from "app";
import { getAddress } from "ethers";

const getNonce: SocketRequest = (socket, error): void => {
  const {$players} = mongo;

  socket.on("getNonce", async (params) => {
    const address = getAddress(params.address);

    if (!address) {
      return error("Invalid address.");
    }

    const $player = await $players.findOne({address});

    if (!$player) {
      return error("Player not found.");
    }

    const {nonce} = $player;

    socket.emit("getNonce", {nonce});
  })
};

export {getNonce};
