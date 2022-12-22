import {leap} from "apis/eos";
import type {SocketEvent} from "models";

const deselectSkin: SocketEvent = (socket): void => {
  socket.on("deselectSkin", async (params) => {
    const {id, username, signature} = params;

    const transaction = await leap.transact({
      contract: "eternisom141",
      action: "deselectskin",
      permission: "active",
      data: {
        cardId: id,
        name: username,
        signature
      }
    });

    socket.emit("deselectSkin", {id});
  });
};

export {deselectSkin};
