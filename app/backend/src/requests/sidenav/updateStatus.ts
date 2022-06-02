import {playersDb} from "apis/mongo";
import {getSocketIds} from "helpers/player";
import {ioServer} from "apis/server";
import type {SocketEvent} from "models";

const updateStatus: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("updateStatus", async () => {
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {username, status, social} = $player;
    const socketIds = await getSocketIds(social.friends);

    ioServer.to(socketIds).emit("updateStatus", {username, status});
  });
};

export {updateStatus};
