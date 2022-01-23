import {lobbyStore} from "stores/data";

import type {Res} from "models";

const leaveLobbyReceiver: Res = () => {
  lobbyStore.update((store) => {
    store.challengee = {
      username: "",
      avatarId: 0
    };

    return store;
  });
};

export default leaveLobbyReceiver;
