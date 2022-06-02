import {chatsDb, playersDb} from "apis/mongo";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const sendChatMsg: SocketEvent = (socket): void => {
  socket.on("sendChatMsg", async (params) => {
    const {sender, receiver, text, date} = params;
    const $updateChat = await chatsDb.updateOne({
      players: {$all: [sender, receiver]}
    }, {
      $push: {
        messages: {sender, text, date}
      }
    });

    if (!$updateChat.modifiedCount) { return; }

    socket.emit("sendChatMsgSender", {sender, receiver, text, date});

    const $receiver = await playersDb.findOne({
      username: receiver
    });

    if (!$receiver || !$receiver.socketId) { return; }

    ioServer.to($receiver.socketId).emit("sendChatMsgReceiver", {sender, text, date});
  });
};

export {sendChatMsg};
