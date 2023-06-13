import {moveToGraveyard} from "../moveToGraveyard";
import type {Effect} from "@som/shared/types/backend";
import type {Field, GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface Smite {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
  field: Field;
}

const smite: Effect<Smite> = (params) => {
  const {player, opponent, minion, trap, field} = params;

  moveToGraveyard(player, minion, field);

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, ""];
};

export {smite};
