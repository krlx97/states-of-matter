import {GameType} from "@som/shared/enums";
import {mongo} from "app";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const startCustomGame: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$lobbies, $players} = mongo;

  socket.on("startCustomGame", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found, please relog.");
    }
    if (!$player.lobbyId) {
      return error("You are not in a lobby.");
    }

    const id = $player.lobbyId;
    const $lobby = await $lobbies.findOne({id});

    if (!$lobby) {
      return error("Lobby not found.");
    }

    if ($player.name !== $lobby.host.name) {
      return error("You are not the host.");
    }

    const $lobbyDelete = await $lobbies.deleteOne({id});

    if (!$lobbyDelete.deletedCount) {
      return error("Failed to delete lobby.");
    }

    const {host, challengee} = $lobby;

    await gameHelpers.startGame(
      $lobby.id,
      GameType.CUSTOM,
      host.name,
      challengee.name
    );
  });
};

export {startCustomGame};
