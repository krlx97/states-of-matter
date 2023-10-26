import type {GameMinionCard} from "@som/shared/types/mongo";

interface Rampage {
  minion: GameMinionCard;
}

const rampage = (params: Rampage) => {
  params.minion.damage += 1;
  return [true, ""];
};

export {rampage};
