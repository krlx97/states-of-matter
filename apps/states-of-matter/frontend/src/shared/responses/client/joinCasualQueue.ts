import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {casualQueueJoinTime, playerStore} from "stores";

const joinCasualQueue = (): void => {
  const {socket} = socketService;

  socket.on("joinCasualQueue", (): void => {
    casualQueueJoinTime.set(Date.now());

    playerStore.update((store) => {
      store.status = PlayerStatus.IN_CASUAL_QUEUE;
      return store;
    });

    socket.emit("updateStatus");
  });
};

export {joinCasualQueue};
