import {GameType, PlayerStatus} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {animationsQueue, intervals, isAnimating, playerStore} from "stores";
import GameEndedComponent from "../../../client/Play/modals/GameEnded.svelte"
import { animate } from "../game/animate";
import { get } from "svelte/store";

const gameEnded = (): void => {
  socketService.socket.on("gameEnded", (params): void => {
    const {isWinner, gameType, animations} = params;

    animationsQueue.update((store) => {
      store.push(...animations);
      return store;
    });

    let int = setInterval((): void => {
      if (get(isAnimating) || get(animationsQueue).length) { return; }

      clearInterval(int);
      clearInterval(intervals[0]); // game timer
      clearInterval(intervals[1]); // animations loop

      modalService.open(GameEndedComponent, params);

      playerStore.update((store) => {
        const {casual, ranked} = store.games;

        store.status = PlayerStatus.ONLINE;
        store.gameId = 0;

        if (gameType === GameType.CASUAL) {
          isWinner ? casual.won += 1 : casual.lost += 1;
        } else if (gameType === GameType.RANKED) {
          isWinner ? ranked.won += 1 : ranked.lost += 1;
        }

        store.rewards.ees = `${BigInt(store.rewards.ees) + BigInt(params.eesReward)}`;

        return store;
      });
    }, 10);
  });
};

export {gameEnded};
