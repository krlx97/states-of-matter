import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService} from "services";
import {playerStore} from "stores/data";
import type { Res } from "models";

const exitGameReceiver: Res = () => {
  const {username} = get(playerStore);

  playerStore.update((store) => {
    store.status = PlayerStatus.ONLINE;
    return store;
  });

  socketService.emit("updateFriend", {username});
};

export default exitGameReceiver;
