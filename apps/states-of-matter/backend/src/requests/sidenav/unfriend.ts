import { accountsDb, chatsDb, playersDb } from "apis/mongo";
import { Player } from "@som/shared/types/mongo";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const unfriend: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("unfriend", async (params) => {
    const {username} = params;

    const asd = await playersDb.findOne({socketId});

    if (!asd) { return; }

    const sender = await accountsDb.findOneAndUpdate({name: asd.name}, {
      $pull: {
        "social.friends": username
      } as any
    }, {
      returnDocument: "after"
    });

    if (!sender.value) { return; }

    const receiver = await accountsDb.findOneAndUpdate({name: username}, {
      $pull: {
        "social.friends": sender.value.name
      } as any // ??????
    }, {
      returnDocument: "after"
    });

    if (!receiver.value) { return; }

    const $receiverP = await playersDb.findOne({name: username});

    if (!$receiverP) return;

    const deleteChat = await chatsDb.deleteOne({
      players: {
        $all: [username, sender.value.name]
      }
    });

    if (!deleteChat.deletedCount) { return; }

    socket.emit("unfriendSender", {username});
    ioServer.to($receiverP.socketId).emit("unfriendReceiver", {
      username: sender.value.name
    });
  });
};

export {unfriend};
