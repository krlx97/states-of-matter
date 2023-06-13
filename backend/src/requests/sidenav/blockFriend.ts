import {mongo, server} from "apis";
import type {SocketRequest} from "@som/shared/types/backend";

const blockFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {accounts, chats, players} = mongo;
  const {io} = server;

  socket.on("blockFriend", async (params) => {
    const {name} = params;

    const [$playerSender, $playerReceiver] = await Promise.all([
      players.findOne({socketId}),
      players.findOne({name})
    ]);

    if (!$playerSender) {
      return error("Player sender not found.");
    }

    if (!$playerReceiver) {
      return error("Player receiver not found.");
    }

    const [
      $accountSenderUpdate,
      $accountReceiverUpdate,
      $chatDelete
    ] = await Promise.all([
      accounts.updateOne({
        name: $playerSender.name
      }, {
        $pull: {
          "social.friends": $playerReceiver.name
        },
        $push: {
          "social.blocked": $playerReceiver.name
        }
      }),

      accounts.updateOne({
        name: $playerReceiver.name
      }, {
        $pull: {
          "social.friends": $playerSender.name
        }
      }),

      chats.deleteOne({
        players: {
          $all: [$playerReceiver.name, $playerSender.name]
        }
      })
    ]);

    if (!$accountSenderUpdate.modifiedCount) {
      return error("Account sender not found.");
    }

    if (!$accountReceiverUpdate.modifiedCount) {
      return error("Account receiver not found.");
    }

    if (!$chatDelete.deletedCount) {
      return error("Failed to delete chat.");
    }

    socket.emit("blockFriendSender", {name});

    io.to($playerReceiver.socketId).emit("blockFriendReceiver", {
      name: $playerSender.username
    });
  });
};

export {blockFriend};
