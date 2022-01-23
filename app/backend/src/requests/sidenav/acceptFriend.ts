import type {AcceptFriendReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const acceptFriend: SocketRequest<AcceptFriendReq> = async (services, params) => {
  const {chatService, playerService, socketService} = services;
  const {username} = params;
  const {socketId} = socketService;
  const sender = await playerService.findAndUpdate({socketId}, {
    $pull: {
      "social.requests": username
    },
    $push: {
      "social.friends": username
    }
  }, {
    returnDocument: "after"
  });

  if (!sender) { return; }

  const receiver = await playerService.findAndUpdate({username}, {
    $push: {
      "social.friends": sender.username
    }
  }, {
    returnDocument: "after"
  });

  if (!receiver) { return; }

  const isInsertedChat = await chatService.insert({
    players: [sender.username, receiver.username],
    messages: []
  });

  if (!isInsertedChat) { return; }

  socketService.emit().acceptFriendSender({
    username: receiver.username,
    avatarId: receiver.avatarId,
    status: receiver.status
  });

  socketService.emit(receiver.socketId).acceptFriendReceiver({
    username: sender.username,
    avatarId: sender.avatarId,
    status: sender.status
  });
};

export default acceptFriend;
