import type {Request} from "../../../models";
import type {AcceptFriend} from "./acceptFriend.models";

const acceptFriend: Request<AcceptFriend> = async (services, params) => {
  const {ioService, playerService} = services;
  const {username} = params;
  const {socketId} = ioService;

  const sender = await playerService.findAndUpdate({socketId}, {
    $pull: {
      "social.requests": username
    },
    $push: {
      "social.friends": username
    }
  }, {returnDocument: "after"});

  if (!sender) { return; }

  const receiver = await playerService.findAndUpdate({username}, {
    $push: {
      "social.friends": sender.username
    }
  }, {returnDocument: "after"});

  if (!receiver) { return; }

  ioService.emit("acceptFriendSender", {
    username: receiver.username,
    avatarId: receiver.avatarId,
    status: receiver.status
  });

  ioService.emitTo(receiver.socketId, "acceptFriendReceiver", {
    username: sender.username,
    avatarId: sender.avatarId,
    status: sender.status
  });
};

export default acceptFriend;
