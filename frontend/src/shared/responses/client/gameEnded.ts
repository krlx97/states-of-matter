import {GameType, PlayerStatus} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {playerStore} from "stores";
import GameEndedComponent from "../../../client/play/modals/GameEnded.svelte"

const gameEnded = (): void => {
  socketService.socket.on("gameEnded", (params): void => {
    const {isWinner, gameType} = params;

    modalService.open(GameEndedComponent, params);

    playerStore.update((store) => {
      const {casual, ranked} = store.games;

      store.status = PlayerStatus.ONLINE;
      store.gameId = 0;

      if (gameType === GameType.CASUAL) {
        isWinner ? casual.won += 1 : casual.lost += 1;
      } else if (gameType === GameType.RANKED) {
        isWinner ? ranked.won += 1 : ranked.lost += 1;
      }

      return store;
    });
  });
};

export {gameEnded};
