import type {Request} from "../../../models";
import type {Unfriend} from "./unfriend.models";

const unfriend: Request<Unfriend> = async (services, params) => {
  const {chatService, ioService, playerService} = services;
  const {username} = params;
  const {socketId} = ioService;

  const sender = await playerService.findAndUpdate({socketId}, {
    $pull: {
      "social.friends": username
    }
  }, {returnDocument: "after"});

  if (!sender) { return; }

  const receiver = await playerService.findAndUpdate({username}, {
    $pull: {
      "social.friends": sender.username
    }
  }, {returnDocument: "after"});

  if (!receiver) { return; }

  const isDeletedChat = await chatService.delete({players: [username, sender.username]});

  if (!isDeletedChat) { return; }

  ioService.emit("unfriendSender", {username});
  ioService.emitTo(receiver.socketId, "unfriendReceiver", {username: sender.username});
};

export default unfriend;
