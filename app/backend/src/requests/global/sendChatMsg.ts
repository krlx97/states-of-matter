import type {App} from "models";

export const sendChatMsg = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$chats, $players} = mongoService;
  const {io, socket} = socketService;

  socket.on("sendChatMsg", async (params) => {
    const {sender, receiver, text, date} = params;
    const $updateChat = await $chats.updateOne({
      players: {$all: [sender, receiver]}
    }, {
      $push: {
        messages: {sender, text, date}
      }
    });

    if (!$updateChat.modifiedCount) { return; }

    socket.emit("sendChatMsgSender", {sender, receiver, text, date});

    const $receiver = await $players.findOne({
      username: receiver
    });

    if (!$receiver || !$receiver.socketId) { return; }

    io.to($receiver.socketId).emit("sendChatMsgReceiver", {sender, text, date});
  });
};
