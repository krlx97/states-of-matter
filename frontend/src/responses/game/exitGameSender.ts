import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService } from "services";
import {playerStore} from "stores/data";

interface Params {}

const exitGameSender = (params: Params): void => {
  const {username} = get(playerStore);

  playerStore.update((store) => {
    store.status = PlayerStatus.ONLINE;
    return store;
  });

  socketService.emit("updateFriend", {username});
};

export default exitGameSender;