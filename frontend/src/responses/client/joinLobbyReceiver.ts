import {lobbyStore} from "stores/data";

interface Params { challengee: any; }

const joinLobbyReceiver = (params: Params): void => {
  lobbyStore.update((lobby) => {
    lobby.challengee = params.challengee;
    return lobby;
  });
};

export default joinLobbyReceiver;
