import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService} from "services";
import {gameStore, playerStore} from "stores/data";

interface Params { game: any; }

const startGameReceiver = (params: Params): void => {
  const {username} = get(playerStore);

  playerStore.update((player) => {
    player.status = PlayerStatus.INGAME;
    return player;
  });

  gameStore.set(params.game);
  socketService.emit("updateFriend", {username});
};

export default startGameReceiver;
