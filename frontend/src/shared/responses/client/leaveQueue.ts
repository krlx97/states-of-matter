import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {intervalsStore, playerStore, queueStore} from "stores";
import { get } from "svelte/store";

const leaveQueue = (): void => {
  const {socket} = socketService;

  socket.on("leaveQueue", (): void => {
    queueStore.update((store) => {
      store.joinedAt = 0;
      store.timeInQueue = "00:00";
      document.title = "States of Matter";
      // clearInterval(store.interval);

      return store;
    });

    clearInterval(get(intervalsStore).queueTimer);

    playerStore.update((store) => {
      store.status = PlayerStatus.ONLINE;
      store.queueId = 0;
      return store;
    });
  });
};

export {leaveQueue};
