import { Animations } from "@som/shared/types/game";
import {moveToGraveyard} from "../moveToGraveyard";
import type {GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";

interface Smite {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
  field: MinionField;
}

const smite = (params: Smite): Animations => {
  const {player, opponent, minion, trap, field} = params;
  const animations: Animations = [];

  animations.push({
    type: "TRAP",
    name: opponent.name,
    card: trap
  });

  animations.push(...moveToGraveyard(player, minion, field));

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return animations;
};

export {smite};
