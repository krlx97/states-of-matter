import type {UnfriendReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const unfriend: SocketRequest<UnfriendReq> = async (services, params) => {
  const {chatService, playerService, socketService} = services;
  const {username} = params;
  const {socketId} = socketService;
  const sender = await playerService.findAndUpdate({socketId}, {
    $pull: {
      "social.friends": username
    }
  }, {
    returnDocument: "after"
  });

  if (!sender) { return; }

  const receiver = await playerService.findAndUpdate({username}, {
    $pull: {
      "social.friends": sender.username
    }
  }, {
    returnDocument: "after"
  });

  if (!receiver) { return; }

  const isDeletedChat = await chatService.delete({
    players: {
      $all: [username, sender.username]
    }
  });

  if (!isDeletedChat) { return; }

  socketService.emit().unfriendSender({username});
  socketService.emit(receiver.socketId).unfriendReceiver({
    username: sender.username
  });
};

export default unfriend;
