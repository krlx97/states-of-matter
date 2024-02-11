import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Player} from "@som/shared/types/mongo";
import type {UpdateFilter} from "mongodb";

const blockFriend: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$chats, $players} = mongo;

  socket.on("blockFriend", async (params) => {
    const {name} = params;

    const $playerSenderUpdate = await $players.findOneAndUpdate({socketId}, {
      $pull: {
        "social.friends": name
      },
      $push: {
        "social.blocked": name
      }
    } as UpdateFilter<Player> | Partial<Player>);

    if (!$playerSenderUpdate) {
      return error("Sender not found.");
    }

    const $playerReceiverUpdate = await $players.findOneAndUpdate({name}, {
      $pull: {
        "social.friends": $playerSenderUpdate.name
      }
    } as UpdateFilter<Player> | Partial<Player>);

    if (!$playerReceiverUpdate) {
      return error("Receiver not found.");
    }

    const $chatDelete = await $chats.deleteOne({
      players: {
        $all: [$playerSenderUpdate.name, name]
      }
    });

    if (!$chatDelete.deletedCount) {
      return error("Error deleting chat.");
    }

    socket.emit("blockFriendSender", {name});

    server.io.to($playerReceiverUpdate.socketId).emit("blockFriendReceiver", {
      name: $playerSenderUpdate.name
    });
  });
};

export {blockFriend};
