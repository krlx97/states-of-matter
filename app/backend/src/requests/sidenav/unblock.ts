import type {UnblockReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const unblock: SocketRequest<UnblockReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {username} = params;
  const {socketId} = socketService;
  const isUpdated = playerService.update({socketId}, {
    $pull: {
      "social.blocked": username
    }
  });

  if (!isUpdated) { return; }

  socketService.emit().unblockFriend({username} as any); // ;w;
};

export default unblock;
