import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";

interface Banish {
  player: GamePlayer;
  opponent: GamePlayer;
  playerMinion: GameMinionCard;
  opponentTrap: GameTrapCard;
  playerMinionField: MinionField;
}

const banish = (params: Banish): Animations => {
  const {player, opponent, playerMinion, opponentTrap, playerMinionField} = params;

  player.field[playerMinionField] = undefined;
  player.hand.push(playerMinion);
  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [{
    type: "TRAP",
    name: opponent.name,
    card: opponentTrap
  }, {
    type: "FLOATING_TEXT",
    field: playerMinionField,
    name: player.name,
    text: "BANISH"
  }];
};

export {banish};
