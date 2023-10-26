import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const addFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $players} = mongo;

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

    const [$accountSender, $accountReceiver] = await Promise.all([
      $accounts.findOne({name: $playerSender.name}),
      $accounts.findOne({name: $playerReceiver.name})
    ]);

    if (!$accountSender) {
      return error("Account sender not found.");
    }

    if (!$accountReceiver) {
      return error("Account receiver not found.");
    }

    if ($accountSender.name === name) {
      return error("You can't add yourself as a friend.");
    }

    if ($accountReceiver.social.blocked.includes($accountSender.name)) {
      return error("This player has blocked you.");
    }

    if ($accountSender.social.blocked.includes(name)) {
      return error("You have blocked this player.");
    }

    if ($accountReceiver.social.requests.includes($accountSender.name)) {
      return error("You have already sent the request to this player.");
    }

    if ($accountSender.social.requests.includes(name)) {
      return error("This player has already sent you the request.");
    }

    if ($accountSender.social.friends.includes(name)) {
      return error("This player is already your friend.");
    }

    const $playerUpdate = await $accounts.updateOne({name}, {
      $push: {
        "social.requests": $accountSender.name
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("notification", "Friend request sent.");

    server.io.to($playerReceiver.socketId).emit("addFriend", {
      name: $accountSender.name
    });
  });
};

export {addFriend};
