import {leap} from "apis/eos";
import type {SocketEvent} from "models";

const airdrop: SocketEvent = (socket): void => {
  socket.on("airdrop", async (params) => {
    const transaction = await leap.transact({
      contract: "eternisvm131",
      action: "tokenairdrop",
      permission: "active",
      data: params
    });

    if (!transaction) {
      socket.emit("notification", "Error while signing airdrop action.");
      return;
    }

    socket.emit("airdrop");
  });
};

export {airdrop};
