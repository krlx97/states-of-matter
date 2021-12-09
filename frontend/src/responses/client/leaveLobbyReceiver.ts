import {lobbyStore} from "stores/data";

const leaveLobbyReceiver = (): void => {
  lobbyStore.update((store) => {
    store.challengee = {
      username: "",
      avatarId: 0
    };

    return store;
  });
};

export default leaveLobbyReceiver;
