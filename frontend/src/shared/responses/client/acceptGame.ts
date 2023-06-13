import {socketService} from "services";
import {gamePopupStore} from "stores";

const acceptGame = (): void => {
  socketService.socket.on("acceptGame", (): void => {
    gamePopupStore.update((store) => {
      store.playersAccepted ++;
      return store;
    });
  });
};

export {acceptGame};
