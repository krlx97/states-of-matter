import {EffectId} from "@som/shared/enums";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

interface Constriction {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const constriction = (params: Constriction): Animations => {
  const {player, playerMinion, opponent, opponentTrap} = params;
  const fields = Object.keys(player.field) as Array<keyof typeof player.field>;

  const sum = fields.reduce((amount, field) => {
    const minion = player.field[field];
    return minion && minion.buffs.find((buff) => buff.id === EffectId.OVERCHARGE) ? amount + 1 : amount;
  }, 0);

  if (playerMinion.damage >= sum) {
    playerMinion.damage -= sum;
  } else {
    playerMinion.damage = 0;
  }

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [true, "Last stand triggered"] as any;
};

export {constriction};
