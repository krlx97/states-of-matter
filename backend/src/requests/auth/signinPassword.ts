import {compare} from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import {mongo} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const signinPassword: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("signinPassword", async (params) => {
    const {name, password, rememberMe} = params;
    const $player = await $players.findOne({name});
    console.log($player);
    if (!$player) {
      return error("Account not found.");
    }

    if (!$player.passwordHash && $player.address) {
      return error("Must login through metamask.");
    }

    const isCorrectPassword = await compare(password, $player.passwordHash);

    if (!isCorrectPassword) {
      return error("Invalid password.");
    }

    const expiresIn = rememberMe ? "30d" : "2h";
    const token = jsonwebtoken.sign({name}, "som", {expiresIn});
    const auth = await playerHelpers.authenticate(socketId, $player.name);
    const [data, errorMessage] = auth;

    if (!data) {
      return error(errorMessage);
    }

    socket.emit("signin", {...data, token});
  });
};

export {signinPassword};
