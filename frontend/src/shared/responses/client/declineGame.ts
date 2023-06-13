import {PlayerStatus, QueueId} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {gamePopupStore, playerStore} from "stores";

const declineGame = (): void => {
  socketService.socket.on("declineGame", (): void => {
    playerStore.update((store) => {
      store.status = PlayerStatus.ONLINE;
      store.queueId = QueueId.NONE;
      store.gamePopupId = 0;

      return store;
    });

    gamePopupStore.update((store) => {
      store.playersAccepted = 0;
      return store;
    });

    modalService.close();
  });
};

export {declineGame};
