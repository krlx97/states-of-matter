import {socketService} from "services";
import {lobbyStore} from "stores";

const leaveLobbyReceiver = (): void => {
  socketService.socket.on("leaveLobbyReceiver", (): void => {
    lobbyStore.update((lobby) => {
      lobby.challengee = {
        name: "",
        avatarId: 0
      };

      return lobby;
    });
  });
};

export {leaveLobbyReceiver};
