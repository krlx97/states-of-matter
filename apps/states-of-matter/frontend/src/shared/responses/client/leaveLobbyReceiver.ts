import {socketService} from "services";
import {lobbyStore} from "stores";

export const leaveLobbyReceiver = () => {
  const {socket} = socketService;

  socket.on("leaveLobbyReceiver", () => {
    lobbyStore.update((lobby) => {
      lobby.challengee = {
        name: "",
        socketId: "",
        avatarId: 0
      };

      return lobby;
    });
  });
};
