import type {App} from "models";

export const block = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$chats, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("block", async (params) => {
    const {username} = params;
    const [sender, receiver] = await Promise.all([
      $players.findOne({socketId}),
      $players.findOne({username})
    ]);

    if (!sender || !receiver) { return; }

    const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
      $players.updateOne({socketId}, {
        $pull: {
          "social.friends": username
        },
        $push: {
          "social.blocked": username
        }
      }),
      $players.updateOne({username}, {
        $pull: {
          "social.friends": sender.username
        }
      }),
      $chats.deleteOne({
        players: {
          $all: [receiver.username, sender.username]
        }
      })
    ]);

    if (
      !isUpdatedSender.modifiedCount ||
      !isUpdatedReceiver.modifiedCount ||
      !isDeletedChat.deletedCount
    ) { return; }

    socket.emit("blockSender", {username});
    io.to(receiver.socketId).emit("blockReceiver", {
      username: sender.username
    });
  });
};
