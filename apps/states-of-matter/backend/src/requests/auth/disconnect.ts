import {PlayerStatus} from "@som/shared/enums";
import {accountsDb, playersDb} from "apis/mongo";
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

    const {name, status} = player.value;
    const account = await accountsDb.findOne({name});

    if (!account) { return; }

    const socketIds = await getSocketIds(account.socials.friends);

    ioServer.to(socketIds).emit("updateStatus", {username: name, status});
  });
};

export {disconnect};
