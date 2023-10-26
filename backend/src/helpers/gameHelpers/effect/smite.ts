import {moveToGraveyard} from "../moveToGraveyard";
import type {GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";

interface Smite {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
  field: MinionField;
}

const smite = (params: Smite) => {
  const {player, opponent, minion, trap, field} = params;

  moveToGraveyard(player, minion, field);

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, ""];
};

export {smite};
