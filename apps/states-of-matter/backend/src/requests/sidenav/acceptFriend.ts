import type {UpdateFilter} from "mongodb";
import type {SocketEvent} from "models";
import { accountsDb, chatsDb, playersDb } from "apis/mongo";
import { Player } from "@som/shared/types/mongo";
import { ioServer } from "apis/server";

const acceptFriend: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("acceptFriend", async (params) => {
    const {username} = params;

    const $player = await playersDb.findOne({socketId});
    const $receiverP = await playersDb.findOne({name: username});

    if (!$player || ! $receiverP) { return; }

    const $sender = await accountsDb.findOneAndUpdate({name: $player.name}, {
      $pull: {
        "social.requests": username
      },
      $push: {
        "social.friends": username
      }
    } as UpdateFilter<Player> | Partial<Player>, { // bug: https://github.com/Automattic/mongoose/issues/10075
      returnDocument: "after"
    });

    if (!$sender.value) { return; }

    const receiver = await accountsDb.findOneAndUpdate({name: username}, {
      $push: {
        "social.friends": $sender.value.name
      }
    } as UpdateFilter<Player> | Partial<Player>, {
      returnDocument: "after"
    });

    if (!receiver.value) { return; }

    const insertChat = await chatsDb.insertOne({
      players: [$sender.value.name, receiver.value.name],
      messages: []
    });

    if (!insertChat.insertedId) { return; }

    socket.emit("acceptFriendSender", {
      username: receiver.value.name,
      avatarId: 1, // fetch from chain
      status: 1
    });

    ioServer.to($receiverP.socketId).emit("acceptFriendReceiver", {
      username: $sender.value.name,
      avatarId: 1, // fetch from chain
      status: $player.status // fetch from accountsDb
    });
  });
};

export {acceptFriend};
