import type {AddFriendReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const addFriend: SocketRequest<AddFriendReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {username} = params;
  const {socketId} = socketService;
  const [sender, receiver] = await Promise.all([
    playerService.find({socketId}),
    playerService.find({username})
  ]);

  if (!sender || !receiver) { return; }

  if (sender.username === username) {
    socketService.emit().notification({msg: "You can't add yourself as a friend."});
    return;
  }
  if (receiver.social.blocked.includes(sender.username)) {
    socketService.emit().notification({msg: "This player has blocked you."});
    return;
  }
  if (sender.social.blocked.includes(username)) {
    socketService.emit().notification({msg: "You have blocked this player."});
    return;
  }
  if (receiver.social.requests.includes(sender.username)) {
    socketService.emit().notification({msg: "You have already sent the request to this player."});
    return;
  }
  if (sender.social.requests.includes(username)) {
    socketService.emit().notification({msg: "This player has already sent you the request."});
    return;
  }
  if (sender.social.friends.includes(username)) {
    socketService.emit().notification({msg: "This player is already your friend."});
    return;
  }

  const isUpdated = await playerService.update({username}, {
    $push: {
      "social.requests": sender.username
    }
  });

  if (!isUpdated) { return; }

  socketService.emit().notification({msg: "Friend request sent."});
  socketService.emit(receiver.socketId).addFriend({username: sender.username});
};

export default addFriend;
