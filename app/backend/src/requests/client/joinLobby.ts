import {PlayerStatus} from "@som/shared/enums";
import { ioServer } from "apis/server";
import {lobbiesDb, playersDb} from "apis/mongo";
import {isDeckValid} from "helpers/player";
import type {SocketEvent} from "models";

const joinLobby: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("joinLobby", async (params) => {
    const {lobbyId} = params;
    const [player, lobby] = await Promise.all([
      playersDb.findOne({socketId}),
      lobbiesDb.findOne({lobbyId})
    ]);

    if (!player) {
      socket.emit("notification", "Player not found.");
      return;
    }
    if (!lobby) {
      socket.emit("notification", "Lobby not found.");
      return;
    }
    if (player.lobbyId) {
      socket.emit("notification", "You are already in a lobby.");
      return;
    }
    if (player.gameId) {
      socket.emit("notification", "You can't join a lobby while in game.");
      return;
    }
    if (lobby.challengee.username) {
      socket.emit("notification", "Lobby is full.");
      return;
    }
    if (!isDeckValid(player.decks[player.deckId])) {
      socket.emit("notification", "Invalid deck.");
      return;
    }

    const {username, avatarId} = player;
    const [modifiedLobby, updatedPlayer] = await Promise.all([
      lobbiesDb.findOneAndUpdate({lobbyId}, {
        $set: {
          challengee: {username, socketId, avatarId}
        }
      }, {
        returnDocument: "after"
      }),
      playersDb.updateOne({socketId}, {
        $set: {
          lobbyId,
          status: PlayerStatus.INLOBBY
        }
      })
    ]);

    if (!modifiedLobby.value || !updatedPlayer.modifiedCount) {
      socket.emit("notification", "Error joining lobby.");
      return;
    }

    const {challengee} = modifiedLobby.value;

    socket.emit("joinLobbySender", {lobby});
    ioServer
      .to(modifiedLobby.value.host.socketId)
      .emit("joinLobbyReceiver", {challengee});
  });
};

export {joinLobby};
