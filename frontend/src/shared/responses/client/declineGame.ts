import {PlayerStatus, QueueId} from "@som/shared/enums";
import {modalService, socketService, soundService} from "services";
import {gamePopupStore, notificationsStore, playerStore} from "stores";

const declineGame = (): void => {
  socketService.socket.on("declineGame", (): void => {
    soundService.play("duelDecline");

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
    notificationsStore.update((store) => {
      const id = Math.random();
      store.push({id, color: "warn", message: "Match has been declined. You have been removed from the queue."});
      return store;
    });

    modalService.close();
  });
};

export {declineGame};
