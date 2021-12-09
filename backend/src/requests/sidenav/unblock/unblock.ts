import type {Request} from "../../../models";
import type {Unblock} from "./unblock.models";

const unblock: Request<Unblock> = async (services, params) => {
  const {ioService, playerService} = services;
  const {username} = params;
  const {socketId} = ioService;

  const isUpdated = playerService.update({socketId}, {
    $pull: {
      "social.blocked": username
    }
  });

  if (!isUpdated) { return; }

  ioService.emit("unblock", {username});
};

export default unblock;
