import {socketService} from "services";
import {gameStore} from "stores";
import {animate} from "./animate";

const attackMinionSave = (): void => {
  socketService.socket.on("attackMinionSave", async (params): Promise<void> => {
    const {game, animations} = params;
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
      (): void => gameStore.set(game),
      animations.length * animationDuration
    );

    // get rid of this? animations could change state (some already do)...
    ;
  });
};

export {attackMinionSave};
