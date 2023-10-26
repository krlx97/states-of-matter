import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const sendChatMessage: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $players, $chats} = mongo;
  const {io} = server;

  socket.on("sendChatMessage", async (params) => {
    const {receiver, text} = params;

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

    const $account = await $accounts.findOne({
      name: $playerSender.name
    });

    if (!$account) {
      return error("Account not found.");
    }

    if (!$account.social.friends.includes(receiver)) {
      return error("This user isn't your friend.");
    }

    const date = new Date();

    const $chatUpdate = await $chats.updateOne({
      players: {
        $all: [$playerSender.name, receiver]
      }
    }, {
      $push: {
        messages: {
          name: $playerSender.name,
          text,
          date
        }
      } // pop first if length > 100!
    });

    if (!$chatUpdate.modifiedCount) {
      return error("Error updating chat.");
    }

    socket.emit("sendChatMessageSender", {
      sender: $playerSender.name,
      receiver,
      text,
      date
    });

    io.to($playerReceiver.socketId).emit("sendChatMessageReceiver", {
      sender: $playerSender.name,
      text,
      date
    });
  });
};

export {sendChatMessage};
