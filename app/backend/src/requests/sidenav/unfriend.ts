import type {App} from "models";
import type {Player} from "services/MongoService/PlayerService.models";

export const unfriend = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$chats, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("unfriend", async (params) => {
    const {username} = params;
    const sender = await $players.findOneAndUpdate({socketId}, {
      $pull: {
        "social.friends": username
      } as Partial<Player>
    }, {
      returnDocument: "after"
    });

    if (!sender.value) { return; }

    const receiver = await $players.findOneAndUpdate({username}, [{
      $pull: {
        "social.friends": sender.value.username
      }
    }], {
      returnDocument: "after"
    });

    if (!receiver.value) { return; }

    const deleteChat = await $chats.deleteOne({
      players: {
        $all: [username, sender.value.username]
      }
    });

    if (!deleteChat.deletedCount) { return; }

    socket.emit("unfriendSender", {username});
    io.to(receiver.value.socketId).emit("unfriendReceiver", {
      username: sender.value.username
    });
  });
};
