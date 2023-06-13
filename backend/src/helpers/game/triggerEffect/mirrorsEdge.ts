import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface MirrorsEdge {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
}

const mirrorsEdge: Effect<MirrorsEdge> = (params) => {
  const {player, opponent, minion, trap} = params;

  player.hero.health -= minion.damage;
  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, ""];
};

export {mirrorsEdge};
