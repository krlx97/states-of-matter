import {socketService} from "services";
import {playerStore} from "stores";

const finishTutorial = (): void => {
  const {socket} = socketService;

  socket.on("finishTutorial", (params): void => {
    playerStore.update((store) => {
      store.tutorial[params.tutorial] = true;
      return store;
    });
  });
};

export {finishTutorial};
