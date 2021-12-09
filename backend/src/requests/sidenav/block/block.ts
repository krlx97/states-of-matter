import type {Request} from "../../../models";
import type {Block} from "./block.models";

const block: Request<Block> = async (services, params) => {
  const {chatService, ioService, playerService} = services;
  const {username} = params;
  const {socketId} = ioService;

  const sender = await playerService.find({socketId});
  const receiver = await playerService.find({username});

  if (!sender || !receiver) { return; }

  const isUpdatedSender = await playerService.update({socketId}, {
    $pull: {
      "social.friends": username
    },
    $push: {
      "social.blocked": username
    }
  });

  const isUpdatedReceiver = await playerService.update({username}, {
    $pull: {
      "social.friends": sender.username
    }
  });

  const isDeletedChat = await chatService.delete({players: [username, sender.username]});

  if (!isUpdatedSender || !isUpdatedReceiver || !isDeletedChat) { return; }

  ioService.emit("blockSender", {username});

  if (!receiver.socketId) { return; }

  ioService.emitTo(socketId, "blockReceiver", {username: sender.username});
};

export default block;
