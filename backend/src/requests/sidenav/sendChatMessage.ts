import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const sendChatMessage: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players, $chats} = mongo;

  socket.on("sendChatMessage", async (params) => {
    const {receiver, text} = params;

    if (text.length > 256) {
      return error("Message too long.");
    }

    const [$playerSender, $playerReceiver] = await Promise.all([
      $players.findOne({socketId}),
      $players.findOne({
        name: receiver
      })
    ]);

    if (!$playerSender) {
      return error("Player sender not found, try relogging.");
    }

    if (!$playerReceiver) {
      return error("Player receiver not found, try relogging.");
    }

    if (!$playerSender.social.friends.includes(receiver)) {
      return error("This user isn't your friend.");
    }

    const $chat = await $chats.findOne({
      players: {
        $all: [$playerSender.name, receiver]
      }
    });

    if (!$chat) {
      return error("Chat not found.");
    }

    const date = Date.now();

    if ($chat.lastSender === $playerSender.name) {
      $chat.unseen += 1;
    } else {
      $chat.lastSender = $playerSender.name;
      $chat.unseen = 1;
    }

    $chat.messages.push({
      name: $playerSender.name,
      text,
      date
    });

    if ($chat.messages.length > 100) {
      $chat.messages.shift();
    }

    const $chatReplace = await $chats.replaceOne({
      players: {
        $all: [$playerSender.name, receiver]
      }
    }, $chat);

    if (!$chatReplace.modifiedCount) {
      return error("Error updating chat.");
    }

    const sender = $playerSender.name;

    socket.emit("sendChatMessageSender", {sender, receiver, text, date});

    server
      .io
      .to($playerReceiver.socketId)
      .emit("sendChatMessageReceiver", {sender, text, date});
  });
};

export {sendChatMessage};
