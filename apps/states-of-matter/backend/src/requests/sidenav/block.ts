import { accountsDb, chatsDb, playersDb } from "apis/mongo";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const block: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("block", async (params) => {
    console.log("init");

    const {username} = params;
    const [sender, receiver] = await Promise.all([
      playersDb.findOne({socketId}),
      playersDb.findOne({name: username})
    ]);

    if (!sender || !receiver) { return; }

    console.log("found them");

    const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
      accountsDb.updateOne({name: sender.name}, {
        $pull: {
          "social.friends": receiver.name
        },
        $push: {
          "social.blocked": receiver.name
        }
      }),
      accountsDb.updateOne({name: receiver.name}, {
        $pull: {
          "social.friends": sender.name
        }
      }),
      chatsDb.deleteOne({
        players: {
          $all: [receiver.name, sender.name]
        }
      })
    ]);

    console.log("tried to delet all.");

    if (
      !isUpdatedSender.modifiedCount ||
      !isUpdatedReceiver.modifiedCount ||
      !isDeletedChat.deletedCount
    ) { return; }

    console.log("deleted all and updating ui");

    socket.emit("blockSender", {username});
    ioServer.to(receiver.socketId).emit("blockReceiver", {
      username: sender.username
    });
  });
};

export {block};
