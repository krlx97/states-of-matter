import type {Request} from "../../../models";

const updateFriend: Request = async (services) => {
  const {ioService, playerService} = services;
  const {socketId} = ioService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {username, status} = player;
  const socketIds = await ioService.getSocketIds(player.social.friends);

  ioService.emitTo(socketIds, "updateFriend", {username, status});
};

export default updateFriend;
