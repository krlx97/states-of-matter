import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

interface Backstab {
  opponent: GamePlayer;
  minion: GameMinionCard;
}

const backstab: Effect<Backstab> = (params) => {
  const {opponent, minion} = params;

  opponent.hero.mana -= 1;
  minion.damage += 2;

  return [true, ""];
};

export {backstab};
