import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

interface Leech {
  player: GamePlayer;
  minion: GameMinionCard;
}

const leech: Effect<Leech> = (params) => {
  const {player, minion} = params;
  player.hero.health += minion.damage;
  return [true, ""];
};

export {leech};
