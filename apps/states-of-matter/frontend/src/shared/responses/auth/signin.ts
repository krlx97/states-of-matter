import {get} from "svelte/store";
import {eccService, socketService} from "services";
import {accountStore, lobbyStore, gameStore, playerStore, socialStore} from "stores";

export const signin = () => {
  const {socket} = socketService;

  socket.on("signin", (params) => {
    const {accountFrontend, playerFrontend, lobbyFrontend, gameFrontend} = params;
    const selectedSkins = new Map();

    for (const {key, value} of playerFrontend.selectedSkins) {
      selectedSkins.set(key, value);
    }

    playerStore.set(playerFrontend);

    accountStore.update((store) => {
      store.profile.name = accountFrontend.profile.name;
      store.profile.nonce = accountFrontend.profile.nonce;
      store.profile.privateKeyHash = accountFrontend.profile.privateKeyHash;
      store.profile.avatarId = accountFrontend.profile.avatarId;
      store.profile.isActivated = accountFrontend.profile.isActivated;
      store.profile.joinedAt = accountFrontend.profile.joinedAt;
      store.wallet = accountFrontend.wallet;
      store.social = accountFrontend.social;
      return store;
    });

    playerStore.update((store) => {
      store.selectedSkins = selectedSkins;
      return store;
    });

    socialStore.update((store) => {
      store.friends = accountFrontend.social.friends;
      return store;
    });

    if (lobbyFrontend) {
      lobbyStore.set(lobbyFrontend);
    }

    if (gameFrontend) {
      gameStore.set(gameFrontend);
    }

    console.log(gameFrontend);

    socket.emit("updateStatus");
  });
};
