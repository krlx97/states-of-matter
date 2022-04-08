import type {UpdateFilter} from "mongodb";
import type {App} from "models";
import type {Player} from "services/MongoService/PlayerService.models";

export const acceptFriend = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$chats, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("acceptFriend", async (params) => {
    const {username} = params;
    const $sender = await $players.findOneAndUpdate({socketId}, {
      $pull: {
        "social.requests": username
      },
      $push: {
        "social.friends": username
      }
    } as UpdateFilter<Player> | Partial<Player>, { // bug: https://github.com/Automattic/mongoose/issues/10075
      returnDocument: "after"
    });

    if (!$sender.value) { return; }

    const receiver = await $players.findOneAndUpdate({username}, {
      $push: {
        "social.friends": $sender.value.username
      }
    } as UpdateFilter<Player> | Partial<Player>, {
      returnDocument: "after"
    });

    if (!receiver.value) { return; }

    const insertChat = await $chats.insertOne({
      players: [$sender.value.username, receiver.value.username],
      messages: []
    });

    if (!insertChat.insertedId) { return; }

    socket.emit("acceptFriendSender", {
      username: receiver.value.username,
      avatarId: receiver.value.avatarId,
      status: receiver.value.status
    });

    io.to(receiver.value.socketId).emit("acceptFriendReceiver", {
      username: $sender.value.username,
      avatarId: $sender.value.avatarId,
      status: $sender.value.status
    });
  });
};
