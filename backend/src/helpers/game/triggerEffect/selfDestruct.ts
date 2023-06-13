import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";

interface SelfDesctruct {
  player: GamePlayer;
}

const selfDestruct: Effect<SelfDesctruct> = (params) => {
  params.player.hero.health -= 3;
  return [true, ""];
};

export {selfDestruct};
