import {hash} from "bcrypt";
import {mongo} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const signupPassword: SocketRequest = (socket, error): void => {
  const {$players} = mongo;

  socket.on("signupPassword", async (params) => {
    const {name, password} = params;

    if (name.length < 3) {
      return error("Name minimum 3 characters.");
    }

    if (name.length > 16) {
      return error("Name maximum 16 characters.");
    }

    if (password.length < 6) {
      return error("Password minimum 6 characters.");
    }

    const $player = await $players.findOne({name});

    if ($player) {
      return error("Name taken.");
    }

    const passwordHash = await hash(password, 12);

    const insertPlayer = await $players.insertOne(
      playerHelpers.playerTemplate(name, passwordHash, "")
    );

    if (!insertPlayer.insertedId) {
      return error("Error creating player, please try again.");
    }

    socket.emit("notification", {
      color: "success",
      message: "Account created successfully."
    });
  });
};

export {signupPassword};
