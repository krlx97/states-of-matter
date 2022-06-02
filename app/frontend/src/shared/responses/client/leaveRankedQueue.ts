import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {casualQueueJoinTime, playerStore} from "stores";

const leaveRankedQueue = (): void => {
  const {socket} = socketService;

  socket.on("leaveRankedQueue", (): void => {
    casualQueueJoinTime.set(0);

    playerStore.update((store) => {
      store.status = PlayerStatus.ONLINE;
      return store;
    });

    socket.emit("updateStatus");
  });
};

export {leaveRankedQueue};
