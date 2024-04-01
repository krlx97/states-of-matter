import jsonwebtoken from "jsonwebtoken";
import {PlayerStatus} from "@som/shared/enums";
import {server, settings} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const authenticate: SocketRequest = (socket, error): void => {
  socket.on("authenticate", async (params) => {
    const decoded: any = jsonwebtoken.verify(params.token, settings.jwt);
    const {name} = decoded;
    const auth = await playerHelpers.authenticate(socket.id, name);
    const [data, errorMessage] = auth;

    if (!data) {
      return error(errorMessage);
    }

    socket.emit("signin", {...data, token: undefined});
    server.io.emit("updateFriend", {name, status: PlayerStatus.ONLINE});
  });
};

export {authenticate};
