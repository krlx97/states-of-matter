import {GameType, PlayerStatus} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {animationsQueue, gameStore, intervals, isAnimating, playerStore} from "stores";
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
      cancelAnimationFrame(intervals[0]); // game timer
      // clearInterval(intervals[0]);
      clearInterval(intervals[1]); // animations loop

      intervals[0] = undefined;
      intervals[1] = undefined;

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

      gameStore.set({
        id: 0,
        type: GameType.CUSTOM,
        currentPlayer: "",
        currentTurn: 0,
        gameLogs: [],
        player: {
          name: "",
          field: {
            hero: {
              gid: 0,
              id: 0,
              type: 0,
              name: "",
              klass: 0,
              health: 0,
              maxHealth: 0,
              mana: 0,
              maxMana: 0,
              ability: 0
              ,effect: 0,
              buffs: [],
              debuffs: []
            },

            a: undefined, b: undefined, c: undefined, d: undefined},
          trap: undefined,
          deck: 0,
          hand: [],
          graveyard: [],
          selectedSkins: {
            avatars: [],
            border: 0,
            back: 0
          }
        },
        opponent: {
          name: "",
          field: {
            hero: {
              gid: 0,
              id: 0,
              type: 0,
              name: "",
              klass: 0,
              health: 0,
              maxHealth: 0,
              mana: 0,
              maxMana: 0,
              ability: 0
              ,effect: 0,
              buffs: [],
              debuffs: []
            },

            a: undefined, b: undefined, c: undefined, d: undefined},
          trap: false,
          deck: 0,
          hand: 0,
          graveyard: [],
          selectedSkins: {
            avatars: [],
            border: 0,
            back: 0
          }
        }
      });
    }, 50);
  });
};

export {gameEnded};
