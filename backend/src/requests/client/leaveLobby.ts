import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const leaveLobby: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$lobbies, $players} = mongo;

  socket.on("leaveLobby", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    if (!$player.lobbyId) {
      return error("You are not in a lobby.");
    }

    const id = $player.lobbyId;
    const $lobby = await $lobbies.findOne({id});

    if (!$lobby) {
      return error("Lobby not found.");
    }

    if ($lobby.host.name === $player.name) {
      return error("Lobby host can't leave lobby.");
    }

    const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
      $lobbies.updateOne({id}, {
        $set: {
          challengee: undefined
        }
      }),
      $players.updateOne({socketId}, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      }),
      $players.findOne({
        name: $lobby.host.name
      })
    ]);

    if (!$lobbyUpdate.modifiedCount) {
      return error("Error updating lobby.");
    }

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    if (!$playerHost) {
      return error("Lobby host not found.");
    }

    socket.emit("leaveLobbySender");
    server.io.to($playerHost.socketId).emit("leaveLobbyReceiver");
  });
};

export {leaveLobby};
