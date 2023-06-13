import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface HeartOfSteel {
  minion: GameMinionCard;
  player: GamePlayer;
  trap: GameTrapCard;
}

const heartOfSteel: Effect<HeartOfSteel> = (params) => {
  params.minion.damage += 3;
  params.player.graveyard.push(params.trap);
  params.player.trap = undefined;

  return [true, ""];
};

export {heartOfSteel};
