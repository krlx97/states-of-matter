import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService} from "services";
import {playerStore} from "stores/data";
import {gameStore} from "game/stores";

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
