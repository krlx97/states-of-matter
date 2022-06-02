import {transact} from "apis/eos";
import type {SocketEvent} from "models";

const sendToken: SocketEvent = (socket): void => {
  socket.on("sendToken", async (params) => {
  console.log(params);
    const transaction = await transact("transfer", params);

    if (!transaction) {
      socket.emit("notification", "Error sending token.");
      return;
    }
  });
};

export {sendToken};
