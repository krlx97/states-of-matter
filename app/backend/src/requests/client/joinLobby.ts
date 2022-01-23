import {PlayerStatus} from "@som/shared/enums";
import type {JoinLobbyReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const joinLobby: SocketRequest<JoinLobbyReq> = async (services, params) => {
  console.log("joinLobby")
  const {lobbyService, playerService, socketService} = services;
  const {lobbyId} = params;
  const {socketId} = socketService;

  const [player, lobby] = await Promise.all([
    playerService.find({socketId}),
    lobbyService.find({lobbyId})
  ]);

  if (!player) { return; }

  if (!lobby) {
    const msg = "Lobby not found.";
    socketService.emit().notification({msg});
    return;
  }

  if (player.lobbyId > 0) {
    const msg = "You are already in a lobby.";
    socketService.emit().notification({msg});
    return;
  }

  if (player.gameId > 0) {
    const msg = "You can't join a lobby while in game.";
    socketService.emit().notification({msg});
    return;
  }

  if (lobby.challengee.username) {
    const msg = "Lobby is full.";
    socketService.emit().notification({msg});
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

  socketService.emit().joinLobbySender({lobby: updated});

  const host = await playerService.find({username: updated.host.username});

  if (!host || !host.socketId) { return; }

  const {challengee} = updated;

  socketService.emit(host.socketId).joinLobbyReceiver({challengee});
};

export default joinLobby;
