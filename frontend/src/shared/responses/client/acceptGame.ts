import {socketService} from "services";
import {gamePopupStore} from "stores";

const acceptGame = (): void => {
  socketService.socket.on("acceptGame", (params): void => {
    gamePopupStore.update((store) => {
      if (params.who === "player") {
        store.hasPlayerAccepted = true;
      } else {
        store.hasOpponentAccepted = true;
      }

      return store;
    });
  });
};

export {acceptGame};
