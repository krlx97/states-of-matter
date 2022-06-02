import {randomInt} from "crypto";
import {PlayerStatus} from "@som/shared/enums";
import {lobbiesDb, playersDb} from "apis/mongo";
import {isDeckValid} from "helpers/player";
import type {SocketEvent} from "models";

const makeLobby: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("makeLobby", async () => {
    const player = await playersDb.findOne({socketId});

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
    if (!isDeckValid(player.decks[player.deckId])) {
      socket.emit("notification", "Invalid deck.");
      return;
    }

    const {username, avatarId} = player;
    const lobbyId = randomInt(1, 1000000);
    const [insertLobby, updatePlayer] = await Promise.all([
      lobbiesDb.insertOne({
        lobbyId,
        host: {username, socketId, avatarId},
        challengee: {
          username: "",
          socketId: "",
          avatarId: 0
        }
      }),
      playersDb.updateOne({socketId}, {
        $set: {
          lobbyId,
          status: PlayerStatus.INLOBBY
        }
      })
    ]);

    if (!insertLobby.insertedId || !updatePlayer.modifiedCount) { return; }

    const lobby = await lobbiesDb.findOne({lobbyId});

    if (!lobby) { return; }

    socket.emit("makeLobby", {lobby});
  });
};

export {makeLobby};
