import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models";

const leaveLobby: Request = async (services) => {
  const {ioService, lobbyService, playerService} = services;
  const {socketId} = ioService;

  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {lobbyId} = player;

  if (lobbyId <= 0) {
    ioService.notification("You are not in a lobby.");
    return;
  }

  const lobby = await lobbyService.find({lobbyId});

  if (!lobby) { return; }

  const updated = await lobbyService.findAndUpdate({lobbyId}, {
    $set: {
      challengee: {username: "", avatarId: 0}
    }
  }, {returnDocument: "after"});

  const isPlayerUpdated = await playerService.update({socketId}, {
    $set: {
      lobbyId: 0,
      status: PlayerStatus.ONLINE
    }
  });

  if (!updated || !isPlayerUpdated) { return; }

  ioService.emit("leaveLobbySender");

  const host = await playerService.find({username: updated.host.username});

  if (!host || !host.socketId) { return; }

  ioService.emitTo(host.socketId, "leaveLobbyReceiver");
};

export default leaveLobby;
