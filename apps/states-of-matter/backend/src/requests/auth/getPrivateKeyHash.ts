import {accountsDb} from "apis/mongo";
import type {SocketEvent} from "models";

const getPrivateKeyHash: SocketEvent = (socket): void => {
  socket.on("getPrivateKeyHash", async (params) => {
    const {name} = params;
    const account = await accountsDb.findOne({name});

    if (!account) {
      socket.emit("notification", "Account not found.");
      return;
    }

    const {privateKeyHash} = account;
    socket.emit("getPrivateKeyHash", {privateKeyHash});
  });
};

export {getPrivateKeyHash};
