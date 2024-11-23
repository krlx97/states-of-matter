import {randomInt} from "crypto";
import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {LobbyView} from "@som/shared/types/views";

const createLobby: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players, $lobbies} = mongo;

  socket.on("createLobby", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    if ($player.lobbyId) {
      return error("Already in a lobby.");
    }

    if ($player.queueId) {
      return error("Can't make a lobby while in queue.");
    }

    if ($player.gameId) {
      return error("Can't make a lobby while in game.");
    }

    if (!playerHelpers.isDeckValid($player.decks[$player.deckId])) {
      return error("Invalid deck.");
    }

    const {name, experience, level, elo, avatarId, bannerId, games} = $player;
    const lobbyId = randomInt(1, 1000000001);
    const status = PlayerStatus.IN_LOBBY;

    const lobby: LobbyView = {
      id: lobbyId,
      host: {name, experience, level, elo, avatarId, bannerId, games},
      challengee: undefined,
      messages: []
    }

    const [$lobbyInsert, $playerUpdate] = await Promise.all([
      $lobbies.insertOne(lobby),
      $players.updateOne({socketId}, {
        $set: {lobbyId, status}
      })
    ]);

    if (!$lobbyInsert.insertedId) {
      return error("Error inserting lobby.");
    }

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("createLobby", {lobby});
    server.io.emit("updateFriend", {name, status});
  });
};

export {createLobby};
