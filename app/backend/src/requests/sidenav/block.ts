import { chatsDb, playersDb } from "apis/mongo";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const block: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("block", async (params) => {
    const {username} = params;
    const [sender, receiver] = await Promise.all([
      playersDb.findOne({socketId}),
      playersDb.findOne({username})
    ]);

    if (!sender || !receiver) { return; }

    const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
      playersDb.updateOne({socketId}, {
        $pull: {
          "social.friends": username
        },
        $push: {
          "social.blocked": username
        }
      }),
      playersDb.updateOne({username}, {
        $pull: {
          "social.friends": sender.username
        }
      }),
      chatsDb.deleteOne({
        players: {
          $all: [receiver.username, sender.username]
        }
      })
    ]);

    if (
      !isUpdatedSender.modifiedCount ||
      !isUpdatedReceiver.modifiedCount ||
      !isDeletedChat.deletedCount
    ) { return; }

    socket.emit("blockSender", {username});
    ioServer.to(receiver.socketId).emit("blockReceiver", {
      username: sender.username
    });
  });
};

export {block};
