import {EffectId} from "@som/shared/enums";
import type {GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

interface Constriction {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
  playerMinionField: MinionField;
}

const constriction = (params: Constriction): Animations => {
  const {player, playerMinion, opponent, opponentTrap, playerMinionField} = params;
  const fields = Object.keys(player.field) as Array<keyof typeof player.field>;

  const sum = fields.reduce((amount, field) => {
    const minion = player.field[field];
    return minion && minion.buffs.find((buff) => buff.id === EffectId.OVERCHARGE) ? amount + 1 : amount;
  }, 0);

  if (playerMinion.damage.current >= sum) {
    playerMinion.damage.current -= sum;
  } else {
    playerMinion.damage.current = 0;
  }

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
    text: "CONSTRICTION"
  }, {
    type: "DAMAGE",
    field: playerMinionField,
    name: player.name,
    increment: -sum
  }];
};

export {constriction};
