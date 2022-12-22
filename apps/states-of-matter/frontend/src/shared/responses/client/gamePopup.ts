import {miscService, socketService} from "services";

const gamePopup = (): void => {
  socketService.socket.on("gamePopup", (params): void => {
    miscService.openModal("gamePopup", params);
  });
};

export {gamePopup};
