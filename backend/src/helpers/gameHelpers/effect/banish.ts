import type {GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";

interface Banish {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
  field: MinionField;
}

const banish = (params: Banish) => {
  const {player, opponent, minion, trap, field} = params;

  player.field[field] = undefined;
  player.hand.push(minion);
  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, ""];
};

export {banish};
