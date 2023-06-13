import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {casualQueueJoinTime, playerStore} from "stores";

const leaveQueue = (): void => {
  const {socket} = socketService;

  socket.on("leaveQueue", (): void => {
    casualQueueJoinTime.set(0);

    playerStore.update((store) => {
      store.status = PlayerStatus.ONLINE;
      store.queueId = 0;
      return store;
    });

    socket.emit("updateFriend");
  });
};

export {leaveQueue};
