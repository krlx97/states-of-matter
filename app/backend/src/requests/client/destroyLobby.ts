import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

const destroyLobby: SocketRequest = async (services) => {
  const {lobbyService, playerService, socketService} = services;
  const {socketId} = socketService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {username, lobbyId} = player;

  if (!lobbyId) {
    const msg = "You are not in a lobby.";
    socketService.emit().notification({msg});
    return;
  }

  const lobby = await lobbyService.find({lobbyId});

  if (!lobby) { return; }

  if (username !== lobby.host.username) {
    const msg = "You are not the lobby host.";
    socketService.emit().notification({msg});
    return;
  }

  const [isDeletedLobby, isUpdatedPlayer] = await Promise.all([
    lobbyService.delete({lobbyId}),
    playerService.update({socketId}, {
      $set: {
        lobbyId: 0,
        status: PlayerStatus.ONLINE
      }
    })
  ]);

  if (!isDeletedLobby || !isUpdatedPlayer) { return; }

  if (lobby.challengee.username) {
    const challengee = await playerService.findAndUpdate({
      username: lobby.challengee.username
    }, {
      $set: {
        lobbyId: 0,
        status: PlayerStatus.ONLINE
      }
    }, {
      returnDocument: "after"
    });

    if (!challengee) { return; }

    socketService.emit(challengee.socketId).destroyLobby();
  }

  socketService.emit().destroyLobby();
};

export default destroyLobby;
