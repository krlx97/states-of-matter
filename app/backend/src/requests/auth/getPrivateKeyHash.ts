import {playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const getPrivateKeyHash: SocketEvent = (socket): void => {
  socket.on("getPrivateKeyHash", async (params) => {
    const {username} = params;
    const player = await playersDb.findOne({username});

    if (!player) {
      socket.emit("notification", "Player not found.");
      return;
    }

    const {privateKeyHash} = player;
    socket.emit("getPrivateKeyHash", {privateKeyHash});
  });
};

export {getPrivateKeyHash};
