import {isAddress, verifyMessage} from "ethers";
import {mongo} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const signupMetamask: SocketRequest = (socket, error): void => {
  const {$players} = mongo;

  socket.on("signupMetamask", async (params) => {
    const {name, address, signature} = params;

    if (name.length < 3) {
      return error("Name minimum 3 characters.");
    }

    if (name.length > 16) {
      return error("Name maximum 16 characters.");
    }

    if (!isAddress(address)) {
      return error("Invalid address");
    }

    const recoveredAddress = verifyMessage("signup", signature);

    if (recoveredAddress !== address) {
      return error("Invalid signature.");
    }

    const [$player, $player2] = await Promise.all([
      $players.findOne({name}),
      $players.findOne({address})
    ]);

    if ($player) {
      return error("Name taken.");
    }

    if ($player2) {
      return error("Address taken.");
    }

    const insertPlayer = await $players.insertOne(
      playerHelpers.playerTemplate(name, "", address)
    );

    if (!insertPlayer.insertedId) {
      return error("Error creating account, please try again.");
    }

    socket.emit("notification", {
      color: "success",
      message: "Account created successfully."
    });
  });
};

export {signupMetamask};
