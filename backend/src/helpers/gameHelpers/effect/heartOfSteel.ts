import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface HeartOfSteel {
  opponent: GamePlayer;
  opponentMinion: GameMinionCard;
  opponentTrap: GameTrapCard;
  field: any;
}

const heartOfSteel = (params: HeartOfSteel): Animations => {
  const {opponent, opponentMinion, opponentTrap, field} = params;

  opponentMinion.damage.current += 3;

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [{
    type: "TRAP",
    name: opponent.name,
    card: opponentTrap
  }, {
    type: "DAMAGE",
    field,
    name: opponent.name,
    increment: 3,
    decrement: 0
  }];
};

export {heartOfSteel};
