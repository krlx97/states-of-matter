import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard} from "@som/shared/types/backend/game";

interface ShadowSurge {
  minion: GameMinionCard;
}

const shadowSurge: Effect<ShadowSurge> = (params) => {
  params.minion.canAttack = true;
  return [true, ""];
};

export {shadowSurge};
