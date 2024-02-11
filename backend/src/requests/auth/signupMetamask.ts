import {verifyMessage} from "ethers";
import {mongo} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const signupMetamask: SocketRequest = (socket, error): void => {
  const {$players} = mongo;

  socket.on("signupMetamask", async (params) => {
    const {name, address, signature} = params;

    if (name.length < 3) {
      return error("Minimum 3 characters.");
    }

    if (name.length > 16) {
      return error("Maximum 16 characters.");
    }

    const $player = await $players.findOne({name});

    if ($player) {
      return error("Name taken.");
    }

    const recoveredAddress = verifyMessage("signup", signature);

    if (recoveredAddress !== address) {
      return error("Invalid signature.");
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
