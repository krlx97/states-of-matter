import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {LobbyView} from "@som/shared/types/views";

const joinLobby: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$lobbies, $players} = mongo;

  socket.on("joinLobby", async (params) => {
    const {id} = params;

    const [$player, $lobby] = await Promise.all([
      $players.findOne({socketId}),
      $lobbies.findOne({id})
    ]);

    if (!$player) {
      return error("Player not found.");
    }

    if (!$lobby) {
      return error("Lobby not found.");
    }

    if ($player.lobbyId) {
      return error("You are already in a lobby.");
    }

    if ($player.gameId) {
      return error("You can't join a lobby while in game.");
    }

    if ($lobby.challengee) {
      return error("Lobby is full.");
    }

    if (!playerHelpers.isDeckValid($player.decks[$player.deckId])) {
      return error("Invalid deck.");
    }

    const {name, experience, level, elo, avatarId, bannerId, games} = $player;

    const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
      $lobbies.findOneAndUpdate({id}, {
        $set: {
          challengee: {name, experience, level, elo, avatarId, bannerId, games}
        }
      }, {
        returnDocument: "after"
      }),
      $players.updateOne({socketId}, {
        $set: {
          lobbyId: id,
          status: PlayerStatus.IN_LOBBY
        }
      }),
      $players.findOne({
        name: $lobby.host.name
      })
    ]);

    if (!$lobbyUpdate) {
      return error("Error updating lobby.");
    }

    if (!$playerUpdate.modifiedCount) {
     return error("Error updating player.");
    }

    if (!$playerHost) {
      return error("Lobby host not found.");
    }

    const {host, challengee, messages} = $lobbyUpdate;
    const lobby: LobbyView = {id, host, challengee, messages};

    socket.emit("joinLobbySender", {lobby});
    server.io.to($playerHost.socketId).emit("joinLobbyReceiver", {challengee});
    server.io.emit("updateFriend", {name, status: PlayerStatus.IN_LOBBY});
  });
};

export {joinLobby};
