import type {GamePlayer} from "@som/shared/types/mongo";

interface SelfDesctruct {
  player: GamePlayer;
}

const selfDestruct = (params: SelfDesctruct) => {
  params.player.field.hero.health -= 3;
  return [true, ""];
};

export {selfDestruct};
