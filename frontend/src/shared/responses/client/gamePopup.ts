import {modalService, socketService, soundService} from "services";
import GamePopupComponent from "../../../client/Play/modals/GamePopup.svelte";
import { gamePopupStore } from "stores";

const gamePopup = (): void => {
  socketService.socket.on("gamePopup", (params): void => {
    document.title = "Match found | States of Matter";
    soundService.play("duelFound");
    gamePopupStore.set(params.gamePopup);
    modalService.open(GamePopupComponent);
  });
};

export {gamePopup};
