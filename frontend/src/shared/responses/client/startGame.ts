import {PlayerStatus, QueueId} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {gameStore, intervals, intervalsStore, nodeStore, playerStore} from "stores";
import GameStartedComponent from "../../../client/Play/modals/GameStarted.svelte";
import { get } from "svelte/store";

const TURN_DURATION_MS = 90000;


const startGame = (): void => {
  const {socket} = socketService;

  socket.on("startGame", (params): void => {
    const {playerA, playerB, game} = params;

    modalService.close();
    modalService.open(GameStartedComponent, {playerA, playerB});

    // hide game load between game popup and game started popup transitions
    setTimeout((): void => {
      playerStore.update((store) => {
        store.status = PlayerStatus.IN_GAME;
        store.queueId = QueueId.NONE;
        store.lobbyId = 0;
        store.gamePopupId = 0;
        store.gameId = game.id;

        return store;
      });

      gameStore.set(game);

      socket.emit("updateFriend");
    }, 400);

    const endTurnTime = game.endTurnTime;

    clearInterval(intervals[0]);

    intervals[0] = setInterval(() => {
      const time = Date.now();
      let rem = endTurnTime - time;
      let x = (rem / TURN_DURATION_MS) * 100;

      if (time <= endTurnTime) {
        nodeStore.update((store) => {
          store.barHeight = `${x}%`;
          return store;
        });
      }
    }, 1000 / 60);
  });
};

export {startGame};
