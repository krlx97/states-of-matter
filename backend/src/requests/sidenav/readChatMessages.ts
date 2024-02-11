import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const readChatMessages: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$chats, $players} = mongo;

  socket.on("readChatMessages", async (params) => {
    const {name} = params;

    const [$playerSender, $playerReceiver] = await Promise.all([
      $players.findOne({socketId}),
      $players.findOne({name})
    ]);

    if (!$playerSender) {
      return error("Player not found.");
    }

    if (!$playerReceiver) {
      return error("Receiver not found.");
    }

    const $chatUpdate = await $chats.updateOne({
      players: {
        $all: [$playerSender.name, name]
      }
    }, {
      $set: {
        unseen: 0
      }
    });

    if (!$chatUpdate) {
      return error("Error updating chat.");
    }

    socket.emit("readChatMessages", {name});

    server.io.to($playerReceiver.socketId).emit("readChatMessages", {
      name: $playerSender.name
    });
  });
};

export {readChatMessages};
