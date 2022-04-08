import {PlayerStatus} from "@som/shared/enums";
import type {App} from "models";

export const leaveLobby = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$lobbies, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("leaveLobby", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      socket.emit("notification", "Player not found.");
      return;
    }
    if (!$player.lobbyId) {
      socket.emit("notification", "You are not in a lobby.");
      return;
    }

    const {lobbyId} = $player;
    const $lobby = await $lobbies.findOne({lobbyId});

    if (!$lobby) {
      socket.emit("notification", "Lobby not found.");
      return;
    }

    const [$updateLobby, $updatePlayer] = await Promise.all([
      $lobbies.updateOne({lobbyId}, {
        $set: {
          challengee: {
            username: "",
            socketId: "",
            avatarId: 0
          }
        }
      }),
      $players.updateOne({socketId}, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      })
    ]);

    if (!$updateLobby.modifiedCount || !$updatePlayer.modifiedCount) { return; }

    socket.emit("leaveLobbySender");
    io.to($lobby.host.socketId).emit("leaveLobbyReceiver");
  });
};
