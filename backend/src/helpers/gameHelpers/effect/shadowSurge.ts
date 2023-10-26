import type {GameMinionCard} from "@som/shared/types/mongo";

interface ShadowSurge {
  minion: GameMinionCard;
}

const shadowSurge = (params: ShadowSurge) => {
  params.minion.canAttack = true;
  return [true, ""];
};

export {shadowSurge};
