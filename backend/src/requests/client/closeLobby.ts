import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const closeLobby: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players, $lobbies} = mongo;

  socket.on("closeLobby", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const {name, lobbyId} = $player;

    if (!lobbyId) {
      return error("You are not in a lobby.");
    }

    const id = lobbyId;
    const $lobby = await $lobbies.findOne({id});

    if (!$lobby) {
      return error("Lobby not found.");
    }

    const {host, challengee} = $lobby;

    if (host.name !== name) {
      return error("You are not the lobby host.");
    }

    const [$lobbyDelete, $playerUpdate, $challengeeUpdate] = await Promise.all([
      $lobbies.deleteOne({id}),
      $players.updateOne({socketId}, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      }),
      challengee.name && $players.findOneAndUpdate({
        name: challengee.name
      }, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      }, {
        returnDocument: "after"
      })
    ]);

    if (!$lobbyDelete.deletedCount) {
      return error("Error deleting lobby.");
    }

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating host.");
    }

    if ($challengeeUpdate && !$challengeeUpdate.value) {
      return error("Error updating challengee.");
    }

    socket.emit("closeLobby");

    if (challengee.name) {
      const $challengee = await $players.findOneAndUpdate({
        name: challengee.name
      }, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      }, {
        returnDocument: "after"
      });

      if (!$challengee.value) {
        return error("Error updating challengee.");
      }

      server.io.to($challengee.value.socketId).emit("closeLobby");
    }
  });
};

export {closeLobby};
