import {leap} from "apis/eos";
import {playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import type {SocketEvent} from "models";

const transferToken: SocketEvent = (socket): void => {
  socket.on("transferToken", async (params) => {
    const transaction = await leap.transact({
      contract: "eternisvm131",
      action: "transfer",
      permission: "active",
      data: params
    });

    if (!transaction) { return; }

    const {from, to, quantity} = params;

    socket.emit("transferTokenSender", {to, quantity});

    const receiver = await playersDb.findOne({
      name: to
    });

    if (!receiver || !receiver.socketId) { return; }

    ioServer.to(receiver.socketId).emit("transferTokenReceiver", {from, quantity});
  });
};

export {transferToken};
