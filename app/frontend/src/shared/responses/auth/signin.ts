import {get} from "svelte/store";
import {socketService} from "services";
import {lobbyStore, gameStore, playerStore, socialStore} from "stores";

export const signin = () => {
  const {socket} = socketService;

  socket.on("signin", (params) => {
    const {player, friends, lobby, game} = params;
    const {privateKey} = get(playerStore);

    playerStore.set(player);
    playerStore.update((store) => {
      store.privateKey = privateKey;
      return store;
    });
    socialStore.update((store) => {
      store.friends = friends;
      return store;
    });

    if (lobby) { lobbyStore.set(lobby); }
    if (game) { gameStore.set(game); }

    socket.emit("updateStatus");
  });
};
