import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores/data";

import type {Res} from "models";

const destroyLobby: Res = () => {
  lobbyStore.set({
    lobbyId: 0,
    host: {
      username: "",
      avatarId: 0
    },
    challengee: {
      username: "",
      avatarId: 0
    }
  });

  playerStore.update((player) => {
    player.status = PlayerStatus.ONLINE;
    return player;
  });

  socketService.updateStatus();
};

export default destroyLobby;
