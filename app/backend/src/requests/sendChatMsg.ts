import type {SendChatMsgReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const sendChatMsg: SocketRequest<SendChatMsgReq> = async (services, params) => {
  const {chatService, playerService, socketService} = services;
  const {sender, receiver, text, date} = params;
  const msg = await chatService.pushChatMsg([sender, receiver], {sender, text, date});

  if (!msg) { return; }

  socketService.emit().sendChatMsgSender({sender, receiver, text, date});

  const player = await playerService.find({
    username: receiver
  });

  if (!player || !player.socketId) { return; }

  socketService.emit(player.socketId).sendChatMsgReceiver({sender, text, date});
};

export default sendChatMsg;
