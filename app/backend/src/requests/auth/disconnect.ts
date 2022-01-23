import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

const disconnect: SocketRequest = async (services) => {
  const {playerService, socketService} = services;
  const {socketId} = socketService;
  const player = await playerService.findAndUpdate({socketId}, {
    $set: {
      socketId: "",
      status: PlayerStatus.OFFLINE
    }
  }, {
    returnDocument: "after"
  });

  if (!player) { return; }

  const {username, status, social: {friends}} = player;
  const socketIds = await socketService.getSocketIds(friends);

  socketService.emit(socketIds).updateFriend({username, status});
};

export default disconnect;
