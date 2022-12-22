import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {casualQueueJoinTime, playerStore} from "stores";

const joinRankedQueue = (): void => {
  const {socket} = socketService;

  socket.on("joinRankedQueue", (): void => {
    casualQueueJoinTime.set(Date.now());

    playerStore.update((store) => {
      store.status = PlayerStatus.IN_RANKED_QUEUE;
      return store;
    });

    socket.emit("updateStatus");
  });
};

export {joinRankedQueue};
