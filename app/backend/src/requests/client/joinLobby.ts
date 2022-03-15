import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

export const joinLobby: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$lobbies, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("joinLobby", async (params) => {
    const {lobbyId} = params;
    const [$player, $lobby] = await Promise.all([
      $players.findOne({socketId}),
      $lobbies.findOne({lobbyId})
    ]);

    if (!$player) {
      socket.emit("notification", "Player not found.");
      return;
    }
    if (!$lobby) {
      socket.emit("notification", "Lobby not found.");
      return;
    }
    if ($player.lobbyId) {
      socket.emit("notification", "You are already in a lobby.");
      return;
    }
    if ($player.gameId) {
      socket.emit("notification", "You can't join a lobby while in game.");
      return;
    }
    if ($lobby.challengee.username) {
      socket.emit("notification", "Lobby is full.");
      return;
    }

    const {username, avatarId} = $player;
    const [modifiedLobby, updatedPlayer] = await Promise.all([
      $lobbies.findOneAndUpdate({lobbyId}, {
        $set: {
          challengee: {username, socketId, avatarId}
        }
      }, {
        returnDocument: "after"
      }),
      $players.updateOne({socketId}, {
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

    const lobby = modifiedLobby.value;
    const {challengee} = modifiedLobby.value;

    socket.emit("joinLobbySender", {lobby});
    io.to($lobby.host.socketId).emit("joinLobbyReceiver", {challengee});
  });
};
