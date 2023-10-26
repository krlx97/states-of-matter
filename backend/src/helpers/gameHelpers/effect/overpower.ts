import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface Overpower {
  opponent: GamePlayer;
  damage: number;
}

const overpower = (params: Overpower) => {
  const {opponent, damage} = params;
  opponent.field.hero.health -= damage;
  return [true, ""];
};

export {overpower};
