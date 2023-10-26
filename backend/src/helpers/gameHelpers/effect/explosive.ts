import {getAdjacentMinions} from "../getAdjacentMinions";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Field, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

interface Explosive {
  player: GamePlayer;
  playerMinionField: MinionField;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const explosive = (params: Explosive): Animations => {
  const {player, playerMinionField, opponent, opponentTrap} = params;
  const fields = getAdjacentMinions(playerMinionField) as MinionField[];

  fields.forEach((field) => {
    const minion = player.field[field];

    if (minion) {
      minion.health -= 2;

      if (minion.health <= 0) {
        moveToGraveyard(player, minion, field);
      }
    }
  });

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [];
};

export {explosive};
