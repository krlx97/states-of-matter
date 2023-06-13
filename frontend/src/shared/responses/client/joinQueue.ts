import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {casualQueueJoinTime, playerStore} from "stores";

const joinQueue = (): void => {
  const {socket} = socketService;

  socket.on("joinQueue", (params): void => {
    casualQueueJoinTime.set(Date.now());

    playerStore.update((store) => {
      store.status = PlayerStatus.IN_QUEUE;
      store.queueId = params.queueId;
      return store;
    });

    socket.emit("updateFriend");
  });
};

export {joinQueue};
