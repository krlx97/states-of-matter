import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {intervalsStore, playerStore, queueStore} from "stores";

const joinQueue = (): void => {
  const {socket} = socketService;

  socket.on("joinQueue", (params): void => {
    queueStore.update((store) => {
      store.joinedAt = Date.now();
      return store;
    });

    intervalsStore.update((store) => {
      store.queueTimer = setInterval((): void => {

        queueStore.update((store) => {
          const date = new Date(Date.now() - store.joinedAt);
          const minutes = date.getMinutes();
          const seconds = date.getSeconds();
          store.timeInQueue = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
          document.title = `${store.timeInQueue} | States of Matter`;
          return store;
        });

      }, 1000);

      return store;
    });

    // queueStore.update((store) => {
    //   store.joinedAt = Date.now();
    //   store.interval = setInterval((): void => {
    //     const date = new Date(Date.now() - store.joinedAt);
    //     const minutes = date.getMinutes();
    //     const seconds = date.getSeconds();

    //     store.timeInQueue = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    //     document.title = `${store.timeInQueue} | States of Matter`;
    //   }, 1000);

    //   return store;
    // });

    playerStore.update((store) => {
      store.status = PlayerStatus.IN_QUEUE;
      store.queueId = params.queueId;
      return store;
    });

    socket.emit("updateFriend");
  });
};

export {joinQueue};
