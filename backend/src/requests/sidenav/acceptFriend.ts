import {mongo, server} from "app";
import type {UpdateFilter} from "mongodb";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Player} from "@som/shared/types/mongo";

const acceptFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$chats, $players} = mongo;

  socket.on("acceptFriend", async (params) => {
    const {name} = params;

    const $playerSenderUpdate = await $players.findOneAndUpdate({socketId}, {
      $pull: {
        "social.requests": name
      },
      $push: {
        "social.friends": name
      }
    } as UpdateFilter<Player> | Partial<Player>, { // bug: https://github.com/Automattic/mongoose/issues/10075
      returnDocument: "after"
    });

    if (!$playerSenderUpdate) {
      return error("Error updating sender.");
    }

    const $playerReceiverUpdate = await $players.findOneAndUpdate({name}, {
      $push: {
        "social.friends": $playerSenderUpdate.name
      }
    } as UpdateFilter<Player> | Partial<Player>, { // bug: https://github.com/Automattic/mongoose/issues/10075
      returnDocument: "after"
    });

    if (!$playerReceiverUpdate) {
      return error("Error updating receiver.");
    }

    const $chatInsert = await $chats.insertOne({
      players: [$playerSenderUpdate.name, $playerReceiverUpdate.name],
      lastSender: $playerSenderUpdate.name,
      unseen: 0,
      messages: []
    });

    if (!$chatInsert.insertedId) {
      return error("Error inserting chat.");
    }

    socket.emit("acceptFriendSender", {
      name: $playerReceiverUpdate.name,
      avatarId: $playerReceiverUpdate.avatarId,
      bannerId: $playerReceiverUpdate.bannerId,
      experience: $playerReceiverUpdate.experience,
      level: $playerReceiverUpdate.level,
      elo: $playerReceiverUpdate.elo,
      status: $playerReceiverUpdate.status,
      games: $playerReceiverUpdate.games,
      lastSender: $playerSenderUpdate.name
    });

    server.io.to($playerReceiverUpdate.socketId).emit("acceptFriendReceiver", {
      name: $playerSenderUpdate.name,
      avatarId: $playerSenderUpdate.avatarId,
      bannerId: $playerSenderUpdate.bannerId,
      experience: $playerSenderUpdate.experience,
      level: $playerSenderUpdate.level,
      elo: $playerSenderUpdate.elo,
      status: $playerSenderUpdate.status,
      games: $playerSenderUpdate.games,
    });
  });
};

export {acceptFriend};
