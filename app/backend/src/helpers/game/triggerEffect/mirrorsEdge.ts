import {Effect} from "@som/shared/enums";
import type {GamePlayer} from "models/game";

const mirrorsEdge = (player: GamePlayer, opponent: GamePlayer, damage: number): boolean => {
  if (opponent.trap && opponent.trap.effects.includes(Effect.MIRRORS_EDGE)) {
    player.hero.health -= damage;

    opponent.graveyard.push(opponent.trap);
    opponent.trap = undefined;

    return true;
  }

  return false;
};

export {mirrorsEdge};
