import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models";
import type {JoinLobby} from "./joinLobby.models";

const joinLobby: Request<JoinLobby> = async (services, params) => {
  const {ioService, lobbyService, playerService} = services;
  const {lobbyId} = params;
  const {socketId} = ioService;

  const [player, lobby] = await Promise.all([
    playerService.find({socketId}),
    lobbyService.find({lobbyId})
  ]);

  if (!player) { return; }

  if (!lobby) {
    ioService.notification("Lobby not found.");
    return;
  }

  if (player.lobbyId > 0) {
    ioService.notification("You are already in a lobby.");
    return;
  }

  if (player.gameId > 0) {
    ioService.notification("You can't join a lobby while in game.");
    return;
  }

  if (lobby.challengee.username) {
    ioService.notification("Lobby is full.");
    return;
  }

  const {username, avatarId} = player;
  const updated = await lobbyService.findAndUpdate({lobbyId}, {
    $set: {
      challengee: {username, avatarId}
    }
  }, {returnDocument: "after"});

  const isPlayerUpdated = await playerService.update({socketId}, {
    $set: {
      lobbyId,
      status: PlayerStatus.INLOBBY
    }
  });

  if (!updated || !isPlayerUpdated) { return; }

  ioService.emit("joinLobbySender", {lobby: updated});

  const host = await playerService.find({username: updated.host.username});

  if (!host || !host.socketId) { return; }

  const {challengee} = updated;

  ioService.emitTo(host.socketId, "joinLobbyReceiver", {challengee});
};

export default joinLobby;
