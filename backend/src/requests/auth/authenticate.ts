import jsonwebtoken from "jsonwebtoken";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import { PlayerStatus } from "@som/shared/enums";
import { server } from "app";

const authenticate: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("authenticate", async (params) => {
    const decoded: any = jsonwebtoken.verify(params.token, "som");
    const {name} = decoded;
    const auth = await playerHelpers.authenticate(socketId, name);
    const [data, errorMessage] = auth;

    if (!data) {
      return error(errorMessage);
    }

    socket.emit("signin", {...data, token: undefined});
    server.io.emit("updateFriend", {name, status: PlayerStatus.ONLINE});
  });
};

export {authenticate};
