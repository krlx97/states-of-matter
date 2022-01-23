import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {playerStore} from "stores/data";
import {gameStore} from "game/stores";

import type {StartGameRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const startGame: Res<StartGameRes> = (params) => {
  playerStore.update((player) => {
    player.status = PlayerStatus.INGAME;
    return player;
  });

  gameStore.set(params.game);
  socketService.updateStatus();
};

export default startGame;
