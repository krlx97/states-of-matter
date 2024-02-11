import {PlayerStatus, QueueId} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {gameStore, playerStore} from "stores";
import GameStartedComponent from "../../../client/play/modals/GameStarted.svelte";

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
  });
};

export {startGame};
