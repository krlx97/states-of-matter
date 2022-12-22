import {leap} from "apis/eos";
import type {SocketEvent} from "models";

const stake: SocketEvent = (socket): void => {
  socket.on("stake", async (params) => {
    const transaction = await leap.transact({
      contract: "eternisvm131",
      action: "stake",
      permission: "active",
      data: params
    });

    if (!transaction) { return; }

    socket.emit("stakeToken", {
      token: params.token
    });
  });
};

export {stake};
