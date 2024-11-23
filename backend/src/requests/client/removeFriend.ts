import {mongo, server} from "app";
import type {UpdateFilter} from "mongodb";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Player} from "@som/shared/types/mongo";

const removeFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("removeFriend", async (params) => {
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

    if (!$playerSender.friends.includes(name)) {
      return error("Player receiver is not your friend.");
    }

    const $playerSenderUpdate = await $players.findOneAndUpdate({
      name: $playerSender.name
    }, {
      $pull: {
        friends: name
      } as UpdateFilter<Player> | Partial<Player>
    }, {
      returnDocument: "after"
    });

    if (!$playerSenderUpdate) {
      return error("Error updating player.");
    }

    socket.emit("removeFriendSender", {name});

    server.io.to($playerReceiver.socketId).emit("removeFriendReceiver", {
      name: $playerSender.name
    });
  });
};

export {removeFriend};
