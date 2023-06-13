import { EffectId } from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface Constriction {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
}

const constriction: Effect<Constriction> = (params) => {
  const {player, opponent, minion, trap} = params;
  const fields = Object.keys(player.minion) as Array<keyof typeof player.minion>;

  const sum = fields.reduce((amount, field) => {
    const minion = player.minion[field];
    return minion && minion.buffs.find((buff) => buff.id === EffectId.OVERCHARGE) ? amount + 1 : amount;
  }, 0);

  if (minion.damage >= sum) {
    minion.damage -= sum;
  } else {
    minion.damage = 0;
  }

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, "Last stand triggered"];
};

export {constriction};
