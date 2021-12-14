import {randomInt} from "crypto";
import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models";

const makeLobby: Request = async (services) => {
  const {ioService, lobbyService, playerService} = services;
  const {socketId} = ioService;

  const player = await playerService.find({socketId});

  if (!player) { return; }

  if (player.lobbyId) {
    ioService.notification("You are already in a lobby.");
    return;
  }

  if (player.gameId) {
    ioService.notification("You can't make a lobby while in game.");
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

  ioService.emit("makeLobby", {lobby});
};

export default makeLobby;
