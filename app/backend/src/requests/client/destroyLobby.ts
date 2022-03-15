import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

export const destroyLobby: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$lobbies, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("destroyLobby", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, lobbyId} = $player;

    if (!lobbyId) {
      socket.emit("notification", "You are not in a lobby.");
      return;
    }

    const lobby = await $lobbies.findOne({lobbyId});

    if (!lobby) { return; }

    if (username !== lobby.host.username) {
      socket.emit("notification", "You are not the lobby host.");
      return;
    }

    const [deleteLobby, updatePlayer] = await Promise.all([
      $lobbies.deleteOne({lobbyId}),
      $players.updateOne({socketId}, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      })
    ]);

    if (!deleteLobby.deletedCount || !updatePlayer.modifiedCount) { return; }

    if (lobby.challengee.username) {
      const challengee = await $players.findOneAndUpdate({
        username: lobby.challengee.username
      }, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      }, {
        returnDocument: "after"
      });

      if (!challengee.value) { return; }
    }

    socket.emit("destroyLobby");
    io.to(lobby.challengee.socketId).emit("destroyLobby");
  });
};
