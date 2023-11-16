import type {SocketRequest} from "@som/shared/types/backend";
import { mongo } from "app";

const getNonce: SocketRequest = (socket, error): void => {
  const {$accounts} = mongo;

  socket.on("getNonce", async (params) => {
    const {address} = params;
    const $account = await $accounts.findOne({address});

    if (!$account) {
      return error("Account not found.");
    }

    const {nonce} = $account;
    socket.emit("getNonce", {nonce});
  })
};

export {getNonce};
