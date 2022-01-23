import type {SocketRequest} from "models";

const updateFriend: SocketRequest = async (services) => {
  const {playerService, socketService} = services;
  const {socketId} = socketService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {username, status, social: {friends}} = player;
  const socketIds = await socketService.getSocketIds(friends);

  socketService.emit(socketIds).updateFriend({username, status});
};

export default updateFriend;
