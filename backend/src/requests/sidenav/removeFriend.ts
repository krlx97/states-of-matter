import {mongo, server} from "app";
import type {UpdateFilter} from "mongodb";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Player} from "@som/shared/types/mongo";

const removeFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$chats, $players} = mongo;

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
      $playerSenderUpdate,
      $playerReceiverUpdate,
      $chatDelete
    ] = await Promise.all([
      $players.findOneAndUpdate({
        name: $playerSender.name
      }, {
        $pull: {
          "social.friends": name
        } as UpdateFilter<Player> | Partial<Player>
      }, {
        returnDocument: "after"
      }),

      $players.findOneAndUpdate({name}, {
        $pull: {
          "social.friends": $playerSender.name
        } as UpdateFilter<Player> | Partial<Player>
      }, {
        returnDocument: "after"
      }),

      $chats.deleteOne({
        players: {
          $all: [name, $playerSender.name]
        }
      })
    ]);

    if (!$playerSenderUpdate) {
      return error("Account sender not found.");
    }

    if (!$playerReceiverUpdate) {
      return error("Account receiver not found.");
    }

    if (!$chatDelete.deletedCount) {
      return error("Failed to delete chat.");
    }

    socket.emit("removeFriendSender", {name});

    server.io.to($playerReceiver.socketId).emit("removeFriendReceiver", {
      name: $playerSender.name
    });
  });
};

export {removeFriend};
