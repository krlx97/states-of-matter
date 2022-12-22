import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {casualQueueJoinTime, playerStore} from "stores";

const leaveCasualQueue = (): void => {
  const {socket} = socketService;

  socket.on("leaveCasualQueue", (): void => {
    console.log("left");
    casualQueueJoinTime.set(0);

    playerStore.update((store) => {
      store.status = PlayerStatus.ONLINE;
      return store;
    });

    socket.emit("updateStatus");
  });
};

export {leaveCasualQueue};
