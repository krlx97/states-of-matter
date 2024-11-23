import {compare} from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import {mongo, server, settings} from "app";
import {playerHelpers} from "helpers";
import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "@som/shared/types/backend";

const signinPassword: SocketRequest = (socket, error): void => {
  socket.on("signinPassword", async (params) => {
    const {name, password, rememberMe} = params;
    const $player = await mongo.$players.findOne({name});

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
    const token = jsonwebtoken.sign({name}, settings.jwt, {expiresIn});
    const auth = await playerHelpers.authenticate(socket.id, $player.name);
    const [data, errorMessage] = auth;

    if (!data) {
      return error(errorMessage);
    }

    socket.emit("signin", {...data, token});
    server.io.emit("updateFriend", {name, status: PlayerStatus.ONLINE});
  });
};

export {signinPassword};
