import {Effect} from "@som/shared/enums";
import type {GameMinion, GamePlayer} from "models/game";

const smite = (opponent: GamePlayer, minion: GameMinion): void => {
  if (opponent.trap && opponent.trap.effects.includes(Effect.SMITE)) {
      // summonedMinion.health = summonedMinion.maxHealth;

      // graveyard.push(summonedMinion);
      // minion[field] = undefined;

      // opponent.graveyard.push(opponent.trap);
      // opponent.trap = undefined;
    }
};

export {smite};
