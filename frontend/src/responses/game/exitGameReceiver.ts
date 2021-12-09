import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService} from "services";
import {playerStore} from "stores/data";

interface Params {}

const exitGameReceiver = (params: Params): void => {
  const {username} = get(playerStore);

  playerStore.update((player) => {
    player.status = PlayerStatus.ONLINE;
    return player;
  });

  socketService.emit("updateFriend", {username});
};

export default exitGameReceiver;
