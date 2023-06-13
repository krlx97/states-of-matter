import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface Frostbite {
  minion: GameMinionCard;
  player: GamePlayer;
  trap: GameTrapCard;
}

const frostbite: Effect<Frostbite> = (params) => {
  const {minion, player, trap} = params;

  minion.damage = 1;
  player.graveyard.push(trap);
  player.trap = undefined;

  return [true, `Frostbite triggered`];
};

export {frostbite};
