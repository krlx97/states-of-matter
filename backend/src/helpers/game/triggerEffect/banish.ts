import type {Effect} from "@som/shared/types/backend";
import type {Field, GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface Banish {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
  field: Field;
}

const banish: Effect<Banish> = (params) => {
  const {player, opponent, minion, trap, field} = params;

  player.minion[field] = undefined;
  player.hand.push(minion);
  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, ""];
};

export {banish};
