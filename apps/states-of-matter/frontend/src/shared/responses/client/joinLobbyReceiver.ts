import {socketService} from "services";
import {lobbyStore} from "stores";

export const joinLobbyReceiver = () => {
  const {socket} = socketService;

  socket.on("joinLobbyReceiver", (params) => {
    lobbyStore.update((lobby) => {
      lobby.challengee = params.challengee;
      return lobby;
    });
  });
};
