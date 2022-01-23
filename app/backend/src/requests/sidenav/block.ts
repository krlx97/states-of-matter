import type {BlockReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const block: SocketRequest<BlockReq> = async (services, params) => {
  const {chatService, playerService, socketService} = services;
  const {username} = params;
  const {socketId} = socketService;
  const [sender, receiver] = await Promise.all([
    playerService.find({socketId}),
    playerService.find({username})
  ]);

  if (!sender || !receiver) { return; }

  const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
    playerService.update({socketId}, {
      $pull: {
        "social.friends": username
      },
      $push: {
        "social.blocked": username
      }
    }),
    playerService.update({username}, {
      $pull: {
        "social.friends": sender.username
      }
    }),
    chatService.delete({
      players: {
        $all: [username, sender.username]
      }
    })
  ]);

  if (!isUpdatedSender || !isUpdatedReceiver || !isDeletedChat) { return; }

  socketService.emit().blockFriendSender({username});

  if (!receiver.socketId) { return; }

  socketService.emit(receiver.socketId).blockFriendReceiver({
    username: sender.username
  });
};

export default block;
