import {verifyMessage} from "ethers";
import jsonwebtoken from "jsonwebtoken";
import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import { PlayerStatus } from "@som/shared/enums";

const signinMetamask: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("signinMetamask", async (params) => {
    const {address, signature, rememberMe} = params;
    const $player = await $players.findOne({address});

    if (!$player) {
      return error("Account not found.");
    }

    const recoveredAddress = verifyMessage(`signin${$player.nonce}`, signature);

    if (recoveredAddress !== $player.address) {
      return error("Invalid signature.");
    }

    const $playerUpdate = await $players.updateOne({address}, {
      $set: {
        nonce: $player.nonce + 1
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating account.");
    }

    const expiresIn = rememberMe ? "30d" : "2h";
    const {name} = $player;
    const token = jsonwebtoken.sign({name}, "som", {expiresIn});
    const auth = await playerHelpers.authenticate(socketId, $player.name);
    const [data, errorMessage] = auth;

    if (!data) {
      return error(errorMessage);
    }

    socket.emit("signin", {...data, token});
    server.io.emit("updateFriend", {name, status: PlayerStatus.ONLINE});
  });
};

export {signinMetamask};
