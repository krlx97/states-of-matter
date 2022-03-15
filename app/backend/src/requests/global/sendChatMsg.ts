import type {Services} from "models";

export const sendChatMsg = (services: Services): void => {
  const {mongoService, socketService} = services;
  const {$chats, $players} = mongoService;
  const {io, socket} = socketService;

  socket.on("sendChatMsg", async (params) => {
    const {sender, receiver, text, date} = params;
    const updateChat = await $chats.updateOne({
      players: {$all: [sender, receiver]}
    }, {
      $push: {
        messages: {sender, text, date}
      }
    });

    if (!updateChat.modifiedCount) { return; }

    socket.emit("sendChatMsgSender", {sender, receiver, text, date});

    const player = await $players.findOne({
      username: receiver
    });

    if (!player || !player.socketId) { return; }

    io.to(player.socketId).emit("sendChatMsgReceiver", {sender, text, date});
  });
};
