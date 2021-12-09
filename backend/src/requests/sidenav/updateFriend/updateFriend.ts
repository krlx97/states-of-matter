import type {Request} from "../../../models";
import type {UpdateFriend} from "./updateFriend.models";

const updateFriend: Request<UpdateFriend> = async (services, params) => {
  const {ioService, playerService} = services;
  // const {username} = params;
  const {socketId} = ioService;

  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {username, status} = player;
  const socketIds = await ioService.getSocketIds(player.social.friends);

  ioService.emitTo(socketIds, "updateFriend", {username, status});
};

export default updateFriend;
