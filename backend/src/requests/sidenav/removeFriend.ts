import {mongo, server} from "app";
import type {UpdateFilter} from "mongodb";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Account} from "@som/shared/types/mongo";

const removeFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $chats, $players} = mongo;

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

    const [
      $accountSenderUpdate,
      $accountReceiverUpdate,
      $chatDelete
    ] = await Promise.all([
      $accounts.findOneAndUpdate({
        name: $playerSender.name
      }, {
        $pull: {
          "social.friends": name
        } as UpdateFilter<Account> | Partial<Account>
      }, {
        returnDocument: "after"
      }),

      $accounts.findOneAndUpdate({name}, {
        $pull: {
          "social.friends": $playerSender.name
        } as UpdateFilter<Account> | Partial<Account>
      }, {
        returnDocument: "after"
      }),

      $chats.deleteOne({
        players: {
          $all: [name, $playerSender.name]
        }
      })
    ]);

    if (!$accountSenderUpdate) {
      return error("Account sender not found.");
    }

    if (!$accountReceiverUpdate) {
      return error("Account receiver not found.");
    }

    if (!$chatDelete.deletedCount) {
      return error("Failed to delete chat.");
    }

    socket.emit("removeFriendSender", {name});

    server.io.to($playerReceiver.socketId).emit("removeFriendReceiver", {
      name: $accountSenderUpdate.name
    });
  });
};

export {removeFriend};
