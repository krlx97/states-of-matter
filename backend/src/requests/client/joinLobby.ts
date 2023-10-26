import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import {playerHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {LobbyView} from "@som/shared/types/views";

const joinLobby: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $lobbies, $players} = mongo;

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

    if ($lobby.challengee.name) {
      return error("Lobby is full.");
    }

    if (!playerHelpers.isDeckValid($player.decks[$player.deckId])) {
      return error("Invalid deck.");
    }

    const {name} = $player;
    const $account = await $accounts.findOne({name});

    if (!$account) {
      return error("Eternitas account not found for player.");
    }

    const {avatarId} = $account;

    const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
      $lobbies.findOneAndUpdate({id}, {
        $set: {
          challengee: {name, avatarId}
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

    if (!$lobbyUpdate.value) {
      return error("Error updating lobby.");
    }

    if (!$playerUpdate.modifiedCount) {
     return error("Error updating player.");
    }

    if (!$playerHost) {
      return error("Lobby host not found.");
    }

    const {host, challengee} = $lobbyUpdate.value;
    const lobby: LobbyView = {id, host, challengee};

    socket.emit("joinLobbySender", {lobby});
    server.io.to($playerHost.socketId).emit("joinLobbyReceiver", {challengee});
  });
};

export {joinLobby};
