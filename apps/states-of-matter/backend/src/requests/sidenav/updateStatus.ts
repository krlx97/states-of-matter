import {accountsDb, playersDb} from "apis/mongo";
import {getSocketIds} from "helpers/player";
import {ioServer} from "apis/server";
import type {SocketEvent} from "models";

const updateStatus: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("updateStatus", async () => {
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const $account = await accountsDb.findOne({name: $player.name});

    if (!$account) { return; }

    const {status} = $player;
    const {name, social} = $account;
    const socketIds = await getSocketIds(social.friends);

    if (socketIds.length) {
      ioServer.to(socketIds).emit("updateStatus", {username: name, status});
    }
  });
};

export {updateStatus};
