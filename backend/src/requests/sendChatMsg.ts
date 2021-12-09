import type {Request} from "../models";

interface Params {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}

const sendChatMsg: Request<Params> = async (services, params) => {
  const {chatService, ioService, playerService} = services;
  const {sender, receiver, text, date} = params;
  const msg = await chatService.pushChatMsg([sender, receiver], {sender, text, date});

  if (!msg) { return; }

  ioService.emit("sendChatMsgSender", {sender, receiver, text, date});

  const player = await playerService.find({username: receiver});

  if (!player || !player.socketId) { return; }

  ioService.emitTo(player.socketId, "sendChatMsgReceiver", {sender, text, date});
};

export default sendChatMsg;
