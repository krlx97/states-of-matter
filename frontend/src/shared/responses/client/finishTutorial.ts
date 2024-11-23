import {socketService} from "services";
import {playerStore, tutorialStore} from "stores";

const finishTutorial = (): void => {
  const {socket} = socketService;

  socket.on("finishTutorial", (params): void => {
    playerStore.update((store) => {
      store.tutorial[params.tutorial] = true;
      return store;
    });

    tutorialStore.update((store) => {
      store.name = "";
      store.currentStep = 0;
      return store;
    });
  });
};

export {finishTutorial};
