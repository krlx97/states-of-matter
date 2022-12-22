import {leap} from "apis/eos";
import type {SocketEvent} from "models";

const sendToken: SocketEvent = (socket): void => {
  socket.on("sendToken", async (params) => {
    const transaction = await leap.transact({
      contract: "eternisvm131",
      action: "transfer",
      permission: "active",
      data: params
    });

    if (!transaction) {
      socket.emit("notification", "Error sending token.");
      return;
    }
  });
};

export {sendToken};
