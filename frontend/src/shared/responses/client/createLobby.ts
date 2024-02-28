import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores";

const createLobby = (): void => {
  socketService.socket.on("createLobby", (params): void => {
    const {lobby} = params;

    lobbyStore.set(lobby);

    playerStore.update((store) => {
      store.status = PlayerStatus.IN_LOBBY;
      store.lobbyId = lobby.id;
      return store;
    });
  });
};

export {createLobby};
