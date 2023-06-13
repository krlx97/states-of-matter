import {mongo, server} from "apis";
import type {UpdateFilter} from "mongodb";
import type {Account, SocketRequest} from "@som/shared/types/backend";

const acceptFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {accounts, chats, players} = mongo;
  const {io} = server;

  socket.on("acceptFriend", async (params) => {
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

    const [$accountSender, $accountReceiver, $chatInsert] = await Promise.all([
      accounts.findOneAndUpdate({
        name: $playerSender.name
      }, {
        $pull: {
          "social.requests": name
        },
        $push: {
          "social.friends": name
        }
      } as UpdateFilter<Account> | Partial<Account>, { // bug: https://github.com/Automattic/mongoose/issues/10075
        returnDocument: "after"
      }),

      accounts.findOneAndUpdate({name}, {
        $push: {
          "social.friends": $playerSender.name
        }
      } as UpdateFilter<Account> | Partial<Account>, { // bug: https://github.com/Automattic/mongoose/issues/10075
        returnDocument: "after"
      }),

      chats.insertOne({
        players: [$playerSender.name, $playerReceiver.name],
        messages: []
      })
    ]);

    if (!$accountSender.value) {
      return error("Account sender not found.");
    }

    if (!$accountReceiver.value) {
      return error("Account receiver not found.");
    }

    if (!$chatInsert.insertedId) {
      return error("Failed to insert chat.");
    }

    socket.emit("acceptFriendSender", {
      name: $playerReceiver.name,
      avatarId: $accountReceiver.value.avatarId,
      status: $playerReceiver.status
    });

    io.to($playerReceiver.socketId).emit("acceptFriendReceiver", {
      name: $playerSender.name,
      avatarId: $accountSender.value.avatarId,
      status: $playerSender.status
    });
  });
};

export {acceptFriend};
