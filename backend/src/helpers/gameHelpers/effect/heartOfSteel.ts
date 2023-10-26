import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface HeartOfSteel {
  minion: GameMinionCard;
  player: GamePlayer;
  trap: GameTrapCard;
}

const heartOfSteel = (params: HeartOfSteel) => {
  params.minion.damage += 3;
  params.player.graveyard.push(params.trap);
  params.player.trap = undefined;

  return [true, ""];
};

export {heartOfSteel};
