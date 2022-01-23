import type {DeclineFriendReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const declineFriend: SocketRequest<DeclineFriendReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {username} = params;
  const {socketId} = socketService;
  const isUpdated = await playerService.update({socketId}, {
    $pull: {
      "social.requests": username
    }
  });

  if (!isUpdated) { return; }

  socketService.emit().declineFriend({username});
};

export default declineFriend;
