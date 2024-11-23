import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface Leech {
  player: GamePlayer;
  minion: GameMinionCard;
}

const leech = (params: Leech) => {
  const {player, minion} = params;
  player.field.hero.health += minion.damage;
  return [true, ""];
};

export {leech};
