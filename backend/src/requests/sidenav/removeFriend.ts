import {mongo, server} from "apis";
import type {UpdateFilter} from "mongodb";
import type {Account, SocketRequest} from "@som/shared/types/backend";

const removeFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {accounts, chats, players} = mongo;
  const {io} = server;

  socket.on("removeFriend", async (params) => {
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
      accounts.findOneAndUpdate({
        name: $playerSender.name
      }, {
        $pull: {
          "social.friends": name
        } as UpdateFilter<Account> | Partial<Account>
      }, {
        returnDocument: "after"
      }),

      accounts.findOneAndUpdate({name}, {
        $pull: {
          "social.friends": $playerSender.name
        } as UpdateFilter<Account> | Partial<Account>
      }, {
        returnDocument: "after"
      }),

      chats.deleteOne({
        players: {
          $all: [name, $playerSender.name]
        }
      })
    ]);

    if (!$accountSenderUpdate.value) {
      return error("Account sender not found.");
    }

    if (!$accountReceiverUpdate.value) {
      return error("Account receiver not found.");
    }

    if (!$chatDelete.deletedCount) {
      return error("Failed to delete chat.");
    }

    socket.emit("removeFriendSender", {name});

    io.to($playerReceiver.socketId).emit("removeFriendReceiver", {
      name: $accountSenderUpdate.value.name
    });
  });
};

export {removeFriend};
