import type {SetAvatarReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const setAvatar: SocketRequest<SetAvatarReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {avatarId} = params;
  const {socketId} = socketService;

  const player = await playerService.findAndUpdate({socketId}, {
    $set: {avatarId}
  }, {
    returnDocument: "after"
  });

  if (!player) { return; }

  const {username, social: {friends}} = player;

  socketService.emit().setAvatarSender({avatarId});

  const socketIds = await socketService.getSocketIds(friends);

  if (!socketIds.length) { return; }

  socketService.emit(socketIds).setAvatarReceiver({username, avatarId});
};

export default setAvatar;
