import {mongo, server} from "apis";
import {getSocketIds} from "helpers/player";
import type {SocketRequest} from "@som/shared/types/backend";

const updateStatus: SocketRequest = (socket): void => {
  const socketId = socket.id;
  const {accounts, players} = mongo;
  const {io} = server;

  socket.on("updateFriend", async () => {
    const $player = await players.findOne({socketId});

    if (!$player) { return; }

    const $account = await accounts.findOne({name: $player.name});

    if (!$account) { return; }

    const {name, status} = $player;
    const socketIds = await getSocketIds($account.social.friends);

    if (socketIds.length) {
      io.to(socketIds).emit("updateFriend", {name, status});
    }
  });
};

export {updateStatus};
