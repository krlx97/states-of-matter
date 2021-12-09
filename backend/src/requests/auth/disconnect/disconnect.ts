import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models/index.js";

const disconnect: Request = async (services) => {
  const {ioService, playerService} = services;
  const {socketId} = ioService;

  const player = await playerService.findAndUpdate({socketId}, {
    $set: {
      socketId: "",
      status: PlayerStatus.OFFLINE
    }
  }, {returnDocument: "after"});

  if (!player) { return; }

  const {username, status, social: {friends}} = player;

  // ====================
  // lobbyId > 0
  //   findLobby(lobbyId)
  // -----
  // host username === player username
  //   destroyLobby(lobbyId)
  //   socket emitTo challengee to update view
  // -----
  // challengee username === player username
  //   leaveLobby(lobbyId)
  //   socket emitTo host to update view
  // ====================

  const socketIds = await ioService.getSocketIds(friends);
  ioService.emitTo(socketIds, "updateFriend", {username, status});
};

export default disconnect;
