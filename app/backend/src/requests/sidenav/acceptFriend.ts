import type {UpdateFilter} from "mongodb";
import type {SocketEvent} from "models";
import { chatsDb, playersDb } from "apis/mongo";
import { Player } from "@som/shared/types/mongo";
import { ioServer } from "apis/server";

const acceptFriend: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("acceptFriend", async (params) => {
    const {username} = params;
    const $sender = await playersDb.findOneAndUpdate({socketId}, {
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

    const receiver = await playersDb.findOneAndUpdate({username}, {
      $push: {
        "social.friends": $sender.value.username
      }
    } as UpdateFilter<Player> | Partial<Player>, {
      returnDocument: "after"
    });

    if (!receiver.value) { return; }

    const insertChat = await chatsDb.insertOne({
      players: [$sender.value.username, receiver.value.username],
      messages: []
    });

    if (!insertChat.insertedId) { return; }

    socket.emit("acceptFriendSender", {
      username: receiver.value.username,
      avatarId: receiver.value.avatarId,
      status: receiver.value.status
    });

    ioServer.to(receiver.value.socketId).emit("acceptFriendReceiver", {
      username: $sender.value.username,
      avatarId: $sender.value.avatarId,
      status: $sender.value.status
    });
  });
};

export {acceptFriend};
