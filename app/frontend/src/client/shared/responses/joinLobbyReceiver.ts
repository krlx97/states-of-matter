import {lobbyStore} from "stores/data";

import type {JoinLobbyReceiverRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const joinLobbyReceiver: Res<JoinLobbyReceiverRes> = (params) => {
  lobbyStore.update((lobby) => {
    lobby.challengee = params.challengee;
    return lobby;
  });
};

export default joinLobbyReceiver;
