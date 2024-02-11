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

    if ($playerReceiver.social.blocked.includes($playerSender.name)) {
      return error("This player has blocked you.");
    }

    if ($playerSender.social.blocked.includes(name)) {
      return error("You have blocked this player.");
    }

    if ($playerReceiver.social.requests.includes($playerSender.name)) {
      return error("You have already sent the request to this player.");
    }

    if ($playerSender.social.requests.includes(name)) {
      return error("This player has already sent you the request.");
    }

    if ($playerSender.social.friends.includes(name)) {
      return error("This player is already your friend.");
    }

    const $playerUpdate = await $players.updateOne({name}, {
      $push: {
        "social.requests": $playerSender.name
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("notification", {
      color: "success",
      message: "Friend request sent."
    });

    server.io.to($playerReceiver.socketId).emit("addFriend", {
      name: $playerSender.name
    });
  });
};

export {addFriend};
