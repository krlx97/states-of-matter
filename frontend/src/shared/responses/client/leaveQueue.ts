import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {intervals, playerStore, queueStore} from "stores";

const leaveQueue = (): void => {
  socketService.socket.on("leaveQueue", (): void => {
    queueStore.update((store) => {
      store.joinedAt = 0;
      store.timeInQueue = "00:00";
      document.title = "States of Matter";

      return store;
    });

    playerStore.update((store) => {
      store.status = PlayerStatus.ONLINE;
      store.queueId = 0;
      return store;
    });

    clearInterval(intervals[2]);
  });
};

export {leaveQueue};
