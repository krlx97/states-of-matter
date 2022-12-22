import {PlayerStatus} from "@som/shared/enums";
import { ioServer } from "apis/server";
import {lobbiesDb, playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const leaveLobby: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("leaveLobby", async () => {
    const $player = await playersDb.findOne({socketId});

    if (!$player) {
      socket.emit("notification", "Player not found.");
      return;
    }
    if (!$player.lobbyId) {
      socket.emit("notification", "You are not in a lobby.");
      return;
    }

    const {lobbyId} = $player;
    const $lobby = await lobbiesDb.findOne({lobbyId});

    if (!$lobby) {
      socket.emit("notification", "Lobby not found.");
      return;
    }

    const [$updateLobby, $updatePlayer] = await Promise.all([
      lobbiesDb.updateOne({lobbyId}, {
        $set: {
          challengee: {
            name: "",
            socketId: "",
            avatarId: 0
          }
        }
      }),
      playersDb.updateOne({socketId}, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      })
    ]);

    if (!$updateLobby.modifiedCount || !$updatePlayer.modifiedCount) { return; }

    socket.emit("leaveLobbySender");
    ioServer.to($lobby.host.socketId).emit("leaveLobbyReceiver");
  });
};

export {leaveLobby};
