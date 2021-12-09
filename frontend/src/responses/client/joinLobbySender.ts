import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores/data";

interface Params { lobby: any; }

const joinLobbySender = (params: Params): void => {
  const {username} = get(playerStore);

  lobbyStore.set(params.lobby);

  playerStore.update((store) => {
    store.status = PlayerStatus.INLOBBY;
    return store;
  });

  socketService.emit("updateFriend", {username});
};

export default joinLobbySender;
