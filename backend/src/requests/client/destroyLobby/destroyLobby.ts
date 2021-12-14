import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models";

const destroyLobby: Request = async (services) => {
  const {ioService, lobbyService, playerService} = services;
  const {socketId} = ioService;

  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {username, lobbyId} = player;

  if (!lobbyId) {
    ioService.notification("You are not in a lobby.");
    return;
  }

  const lobby = await lobbyService.find({lobbyId});

  if (!lobby) { return; }

  if (username !== lobby.host.username) {
    ioService.notification("You are not the lobby host.");
    return;
  }

  const [isDeletedLobby, isUpdatedPlayer] = await Promise.all([
    lobbyService.delete({lobbyId}),
    playerService.update({socketId}, {
      $set: {
        lobbyId: 0,
        status: PlayerStatus.ONLINE
      }
    }),
    
  ]);

  if (!isDeletedLobby || !isUpdatedPlayer) { return; }

  if (lobby.challengee.username) {
    const challengee = await playerService.findAndUpdate({username: lobby.challengee.username}, {
      $set: {
        lobbyId: 0,
        status: PlayerStatus.ONLINE
      }
    }, {returnDocument: "after"});

    if (!challengee) { return; }

    ioService.emitTo(challengee.socketId, "destroyLobbyReceiver");
  }


  ioService.emit("destroyLobbySender");
};

export default destroyLobby;
