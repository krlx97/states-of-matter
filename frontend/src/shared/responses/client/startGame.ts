import {PlayerStatus, QueueId} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {playerStore} from "stores";
import GameStartedComponent from "../../../client/play/modals/GameStarted.svelte"

const startGame = (): void => {
  const {socket} = socketService;

  socket.on("startGame", (params): void => {
    modalService.close();
    console.log("closed accept popup");
    modalService.open(GameStartedComponent, params);
    console.log("opened game started popup");

    // playerStore.update((store) => {
    //   store.status = PlayerStatus.IN_GAME;
    //   store.queueId = QueueId.NONE;
    //   store.lobbyId = 0;
    //   store.gamePopupId = 0;
    //   store.gameId = params.game.id;

    //   return store;
    // });

    socket.emit("updateFriend");
  });
};

export {startGame};
