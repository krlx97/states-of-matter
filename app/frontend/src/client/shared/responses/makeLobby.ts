import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores/data";

import type {MakeLobbyRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const makeLobby: Res<MakeLobbyRes> = (params) => {
  lobbyStore.set(params.lobby);

  playerStore.update((player) => {
    player.status = PlayerStatus.INLOBBY;
    return player;
  });

  socketService.updateStatus();
};

export default makeLobby;
