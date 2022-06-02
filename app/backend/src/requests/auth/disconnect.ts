import {PlayerStatus} from "@som/shared/enums";
import {playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import {getSocketIds} from "helpers/player";
import type {SocketEvent} from "models";

const disconnect: SocketEvent = (socket): void => {
  socket.on("disconnect", async (reason) => {
    const socketId = socket.id;
    const player = await playersDb.findOneAndUpdate({socketId}, {
      $set: {
        socketId: "",
        status: PlayerStatus.OFFLINE
      }
    }, {
      returnDocument: "after"
    });

    if (!player.value) { return; }

    const {username, status, social} = player.value;
    const socketIds = await getSocketIds(social.friends);

    ioServer.to(socketIds).emit("updateStatus", {username, status});
  });
};

export {disconnect};
