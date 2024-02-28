import {GameType, PlayerStatus} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {playerStore} from "stores";
import GameEndedComponent from "../../../client/Play/modals/GameEnded.svelte"
import { animate } from "../game/animate";

const gameEnded = (): void => {
  socketService.socket.on("gameEnded", (params): void => {
    const {isWinner, gameType, animations} = params;

    const animationDuration = 800;

    animations.forEach((animation, i): void => {
      const {type} = animation;
      const ms = animationDuration * i;

      if (type === "DAMAGE") {
        setTimeout((): void => animate.damage(animation), ms);
      } else if (type === "HEALTH") {
        setTimeout((): void => animate.health(animation), ms);
      } else if (type === "MANA_CAPACITY") {
        setTimeout((): void => animate.manaCapacity(animation), ms);
      } else if (type === "DEATH") {
        setTimeout((): void => animate.death(animation), ms);
      } else if (type === "FLOATING_TEXT") {
        setTimeout((): void => animate.floatingText(animation), ms);
      } else if (type === "SUMMON") {
        setTimeout((): void => animate.summon(animation), ms);
      } else if (type === "TRAP") {
        setTimeout((): void => animate.trap(animation), ms);
      } else if (type === "MAGIC") {
        setTimeout((): void => animate.magic(animation), ms);
      } else if (type === "SHAKE") {
        setTimeout((): void => {
          animate.shake({damageTaken: animation.playerANumber, field: animation.playerAField, name: animation.playerA});
          animate.shake({damageTaken: animation.playerBNumber, field: animation.playerBField, name: animation.playerB});
        }, ms)
      } else if (type === "TRAP_SET") {
        setTimeout((): void => animate.trapset(animation), ms);
      }
    });

    setTimeout(
      (): void => {
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


          store.rewards.ees = `${BigInt(store.rewards.ees) + BigInt(params.eesReward)}`;

          return store;
        });
      },
      animations.length * animationDuration
    );
  });
};

export {gameEnded};
