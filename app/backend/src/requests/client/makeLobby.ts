import {randomInt} from "crypto";
import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

export const makeLobby: SocketRequest = (services) => {
  const {mongoService, socketService, gameEngine} = services;
  const {$lobbies, $players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("makeLobby", async () => {
    const player = await $players.findOne({socketId});

    if (!player) {
      socket.emit("notification", "Player not found.");
      return;
    }
    if (player.lobbyId) {
      socket.emit("notification", "You are already in a lobby.");
      return;
    }
    if (player.gameId) {
      socket.emit("notification", "You can't make a lobby while in game.");
      return;
    }
    if(!gameEngine.checkPlayersDeck(player.decks[player.deckId])){
      socket.emit("notification", "Invalid deck.");
      return;
    }

    const {username, avatarId} = player;
    const lobbyId = randomInt(1, 1000000);
    const [insertLobby, updatePlayer] = await Promise.all([
      $lobbies.insertOne({
        lobbyId,
        host: {username, socketId, avatarId},
        challengee: {
          username: "",
          socketId: "",
          avatarId: 0
        }
      }),
      $players.updateOne({socketId}, {
        $set: {
          lobbyId,
          status: PlayerStatus.INLOBBY
        }
      })
    ]);

    if (!insertLobby.insertedId || !updatePlayer.modifiedCount) { return; }

    const lobby = await $lobbies.findOne({lobbyId});

    if (!lobby) { return; }

    socket.emit("makeLobby", {lobby});
  });
};
