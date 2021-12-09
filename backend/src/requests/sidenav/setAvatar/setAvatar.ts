import type {Request} from "../../../models";
import type {SetAvatar} from "./setAvatar.models";

const setAvatar: Request<SetAvatar> = async (services, params) => {
  const {ioService, playerService} = services;
  const {avatarId} = params;
  const {socketId} = ioService;

  const player = await playerService.findAndUpdate({socketId}, {
    $set: {avatarId}
  }, {returnDocument: "after"});

  if (!player) { return; }

  ioService.emit("setAvatarSender", {avatarId});

  const {username} = player;
  const socketIds = await ioService.getSocketIds(player.social.friends);

  ioService.emitTo(socketIds, "setAvatarReceiver", {username, avatarId});
};

export default setAvatar;
