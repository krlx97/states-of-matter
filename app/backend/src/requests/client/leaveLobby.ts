import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

const leaveLobby: SocketRequest = async (services) => {
  const {lobbyService, playerService, socketService} = services;
  const {socketId} = socketService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {lobbyId} = player;

  if (lobbyId <= 0) {
    const msg = "You are not in a lobby.";
    socketService.emit().notification({msg});
    return;
  }

  const lobby = await lobbyService.find({lobbyId});

  if (!lobby) { return; }

  const [updatedLobby, isUpdatedPlayer] = await Promise.all([
    lobbyService.findAndUpdate({lobbyId}, {
      $set: {
        challengee: {
          username: "",
          avatarId: 0
        }
      }
    }, {
      returnDocument: "after"
    }),
    playerService.update({socketId}, {
      $set: {
        lobbyId: 0,
        status: PlayerStatus.ONLINE
      }
    })
  ]);

  if (!updatedLobby || !isUpdatedPlayer) { return; }

  socketService.emit().leaveLobbySender();

  const host = await playerService.find({
    username: updatedLobby.host.username
  });

  if (!host || !host.socketId) { return; }

  socketService.emit(host.socketId).leaveLobbyReceiver();
};

export default leaveLobby;
