import {getAddress} from "ethers";
import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const getNonce: SocketRequest = (socket, error): void => {
  socket.on("getNonce", async (params) => {
    const address = getAddress(params.address);

    if (!address) {
      return error("Invalid address.");
    }

    const $player = await mongo.$players.findOne({address});

    if (!$player) {
      return error("Player not found.");
    }

    const {nonce} = $player;

    socket.emit("getNonce", {nonce});
  });
};

export {getNonce};
