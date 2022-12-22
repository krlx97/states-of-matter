import {EffectId} from "@som/shared/enums";
import type {GameMinion, GamePlayer} from "models/game";

const smite = (player: GamePlayer, opponent: GamePlayer, minion: GameMinion, field: "a" | "b" | "c" | "d"): boolean => {
  if (opponent.trap && opponent.trap.effect === EffectId.SMITE) {
    minion.health = minion.maxHealth;

    player.graveyard.push(minion);
    player.minion[field] = undefined;

    opponent.graveyard.push(opponent.trap);
    opponent.trap = undefined;

    return true;
  }

  return false;
};

export {smite};
