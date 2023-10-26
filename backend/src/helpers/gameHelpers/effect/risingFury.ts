import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface RisingFury {
  minionCard: GameMinionCard;
}

const risingFury = (params: RisingFury) => {
  const {minionCard} = params;

  minionCard.health += 1;
  minionCard.damage += 1;

  return [true, ""];
};

export {risingFury};
