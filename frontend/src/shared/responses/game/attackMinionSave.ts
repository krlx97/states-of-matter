import {socketService} from "services";
import {gameStore} from "stores";
import {animate} from "./animate";

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

const attackMinionSave = (): void => {
  socketService.socket.on("attackMinionSave", async (params): Promise<void> => {
    const {game, animations} = params;

    for (const animation of animations) {
      const {type} = animation;

      if (type === "DAMAGE") {
        animate.number(animation);
      } else if (type === "DEATH") {
        animate.death(animation);
      } else if (type === "FLOATING_TEXT") {
        animate.floatingText(animation);
      }

      await timeout(700);
    }

    // get rid of this? animations could change state (some already do)...
    gameStore.set(game);
  });
};

export {attackMinionSave};
