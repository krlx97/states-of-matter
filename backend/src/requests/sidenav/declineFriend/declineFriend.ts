import type {Request} from "../../../models";
import type {DeclineFriend} from "./declineFriend.models";

const declineFriend: Request<DeclineFriend> = async (services, params) => {
  const {ioService, playerService} = services;
  const {username} = params;
  const {socketId} = ioService;

  const isUpdated = await playerService.update({socketId}, {
    $pull: {
      "social.requests": username
    }
  });

  if (!isUpdated) { return; }

  ioService.emit("declineFriend", {username});
};

export default declineFriend;
