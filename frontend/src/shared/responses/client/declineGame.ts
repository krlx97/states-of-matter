import {PlayerStatus, QueueId} from "@som/shared/enums";
import {modalService, notificationService, socketService, soundService} from "services";
import {gamePopupStore, playerStore} from "stores";

const declineGame = (): void => {
  socketService.socket.on("declineGame", (): void => {
    soundService.play("cancel");

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

    notificationService.show("Match has been declined. You have been removed from the queue.");

    modalService.close();
  });
};

export {declineGame};
