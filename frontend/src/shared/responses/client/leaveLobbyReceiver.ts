import {socketService} from "services";
import {lobbyStore} from "stores";

const leaveLobbyReceiver = (): void => {
  socketService.socket.on("leaveLobbyReceiver", (): void => {
    lobbyStore.update((lobby) => {
      lobby.challengee = undefined;
      return lobby;
    });
  });
};

export {leaveLobbyReceiver};
