import {socketService} from "services";
import {modalStore} from "stores";

const acceptGame = (): void => {
  socketService.socket.on("acceptGame", (): void => {
    modalStore.update((store) => {
      if (!store.data.playerA.hasAccepted) {
        store.data.playerA.hasAccepted = true;
        return store;
      }
      if (!store.data.playerB.hasAccepted) {
        store.data.playerB.hasAccepted = true;
        return store;
      }
    });
  });
};

export {acceptGame};
