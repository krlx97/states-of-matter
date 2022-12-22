import {leap} from "apis/eos";
import type {SocketEvent} from "models";

const unstakeToken: SocketEvent = (socket): void => {
  socket.on("unstakeToken", async (params) => {
    const transaction = await leap.transact({
      contract: "eternisvm131",
      action: "unstake",
      permission: "active",
      data: params
    });

    if (!transaction) { return; }

    socket.emit("unstakeToken", {
      token: params.token
    });
  });
};

export {unstakeToken};
