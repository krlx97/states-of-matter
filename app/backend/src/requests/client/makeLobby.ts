import {randomInt} from "crypto";
import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

const makeLobby: SocketRequest = async (services) => {
  const {lobbyService, playerService, socketService} = services;
  const {socketId} = socketService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  if (player.lobbyId) {
    const msg = "You are already in a lobby.";
    socketService.emit().notification({msg});
    return;
  }

  if (player.gameId) {
    const msg = "You can't make a lobby while in game.";
    socketService.emit().notification({msg});
  }

  const {username, avatarId} = player;
  const lobbyId = randomInt(1, 1000000);
  const [isInsertedLobby, isUpdatedPlayer] = await Promise.all([
    lobbyService.insert({
      lobbyId,
      host: {username, avatarId},
      challengee: {
        username: "",
        avatarId: 0
      }
    }),
    playerService.update({socketId}, {
      $set: {
        lobbyId,
        status: PlayerStatus.INLOBBY
      }
    })
  ]);

  if (!isInsertedLobby || !isUpdatedPlayer) { return; }

  const lobby = await lobbyService.find({lobbyId});

  if (!lobby) { return; }

  socketService.emit().makeLobby({lobby});
};

export default makeLobby;
