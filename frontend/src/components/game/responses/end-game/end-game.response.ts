import {PlayerStatus} from "enums";
import {socketService} from "services";
import {playerStore} from "stores/data";
import type {Res} from "models";

const endGame: Res = () => {
  playerStore.update((store) => {
    store.gameId = 0;
    store.status = PlayerStatus.ONLINE;
    return store;
  });

  socketService.emit("updateFriend");
};

export default endGame;
