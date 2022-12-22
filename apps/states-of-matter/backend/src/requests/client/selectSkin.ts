import {leap} from "apis/eos";
import type {SocketEvent} from "models";

const selectSkin: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("selectSkin", async (params) => {
    const {serial, username, signature} = params;

    const transaction = await leap.transact({
      contract: "eternisom141",
      action: "selectskin",
      permission: "active",
      data: {
        name: username,
        signature,
        serial
      }
    });

    socket.emit("selectSkin", {serial});
  });
};

export {selectSkin};
