import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface Backstab {
  opponent: GamePlayer;
  minion: GameMinionCard;
}

const backstab = (params: Backstab) => {
  const {opponent, minion} = params;

  opponent.field.hero.mana -= 1;
  minion.damage += 2;

  return [true, ""];
};

export {backstab};
