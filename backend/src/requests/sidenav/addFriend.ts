import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const addFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("addFriend", async (params) => {
    const {name} = params;

    const [$playerSender, $playerReceiver] = await Promise.all([
      $players.findOne({socketId}),
      $players.findOne({name})
    ]);

    if (!$playerSender) {
      return error("Player sender not found.");
    }

    if (!$playerReceiver) {
      return error("Player receiver not found.");
    }

    if ($playerSender.name === name) {
      return error("You can't add yourself as a friend.");
    }

    if ($playerSender.friends.includes(name)) {
      return error("This player is already your friend.");
    }

    const $playerUpdate = await $players.updateOne({socketId}, {
      $push: {
        friends: name
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("addFriendSender", {
      isMutual: $playerReceiver.friends.includes($playerSender.name),
      name: $playerReceiver.name,
      avatarId: $playerReceiver.avatarId,
      bannerId: $playerReceiver.bannerId,
      experience: $playerReceiver.experience,
      level: $playerReceiver.level,
      elo: $playerReceiver.elo,
      status: $playerReceiver.status,
      games: $playerReceiver.games,
    });

    if ($playerReceiver.friends.includes($playerSender.name)) {
      server.io.to($playerReceiver.socketId).emit("addFriendReceiver", {
        // isMutual: $playerSender.friends.includes($playerReceiver.name),
        name: $playerSender.name
      });
    }
  });
};

export {addFriend};
