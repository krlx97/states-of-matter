import { chatsDb, playersDb } from "apis/mongo";
import { Player } from "@som/shared/types/mongo";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const unfriend: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("unfriend", async (params) => {
    const {username} = params;
    const sender = await playersDb.findOneAndUpdate({socketId}, {
      $pull: {
        "social.friends": username
      } as Partial<Player>
    }, {
      returnDocument: "after"
    });

    if (!sender.value) { return; }

    const receiver = await playersDb.findOneAndUpdate({username}, [{
      $pull: {
        "social.friends": sender.value.username
      }
    }], {
      returnDocument: "after"
    });

    if (!receiver.value) { return; }

    const deleteChat = await chatsDb.deleteOne({
      players: {
        $all: [username, sender.value.username]
      }
    });

    if (!deleteChat.deletedCount) { return; }

    socket.emit("unfriendSender", {username});
    ioServer.to(receiver.value.socketId).emit("unfriendReceiver", {
      username: sender.value.username
    });
  });
};

export {unfriend};
