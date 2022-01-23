import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores/data";

import type {JoinLobbySenderRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const joinLobbySender: Res<JoinLobbySenderRes> = (params) => {
  lobbyStore.set(params.lobby);

  playerStore.update((store) => {
    store.status = PlayerStatus.INLOBBY;
    return store;
  });

  socketService.updateStatus();
};

export default joinLobbySender;
