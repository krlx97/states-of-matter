import type {Request} from "../../../models";
import type {AddFriend} from "./addFriend.model";

const addFriend: Request<AddFriend> = async (services, params) => {
  const {ioService, playerService} = services;
  const {username} = params;
  const {socketId} = ioService;

  const sender = await playerService.find({socketId});
  const receiver = await playerService.find({username});

  if (!sender || !receiver) { return; }

  if (sender.username === username) {
    ioService.notification("You can't add yourself as a friend.");
    return;
  }
  if (receiver.social.blocked.includes(username)) {
    ioService.notification("This player has blocked you.");
    return;
  }
  if (sender.social.blocked.includes(username)) {
    ioService.notification("You have blocked this player.");
    return;
  }
  if (receiver.social.requests.includes(username)) {
    ioService.notification("You have already sent the request to this player.");
    return;
  }
  if (sender.social.requests.includes(username)) {
    ioService.notification("This player has already sent you the request.");
    return;
  }
  if (sender.social.friends.includes(username)) {
    ioService.notification("This player is already your friend.");
    return;
  }

  const isUpdated = await playerService.update({username}, {
    $push: {
      "social.requests": sender.username
    }
  });

  if (!isUpdated) { return; }

  ioService.notification("Friend request sent.");
  ioService.emitTo(receiver.socketId, "addFriend", {username: sender.username});
};

export default addFriend;
