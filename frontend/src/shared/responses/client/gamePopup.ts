import {modalService, socketService, soundService} from "services";
import GamePopupComponent from "../../../client/play/modals/GamePopup.svelte";

const gamePopup = (): void => {
  socketService.socket.on("gamePopup", (): void => {
    document.title = "Match found | States of Matter";
    soundService.play("matchFound");
    modalService.open(GamePopupComponent);
  });
};

export {gamePopup};
