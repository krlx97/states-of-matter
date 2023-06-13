import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface RisingFury {
  minionCard: GameMinionCard;
}

const risingFury: Effect<RisingFury> = (params) => {
  const {minionCard} = params;

  minionCard.health += 1;
  minionCard.damage += 1;

  return [true, ""];
};

export {risingFury};
