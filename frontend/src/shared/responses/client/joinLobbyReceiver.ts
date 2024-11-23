import {socketService} from "services";
import {lobbyStore} from "stores";

const joinLobbyReceiver = (): void => {
  socketService.socket.on("joinLobbyReceiver", (params): void => {
    lobbyStore.update((store) => {
      store.challengee = params.challengee;
      return store;
    });
  });
};

export {joinLobbyReceiver};
