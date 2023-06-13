import {randomInt} from "crypto";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

const getRandomMinion = (player: GamePlayer): GameMinionCard | undefined => {
  const list: Array<GameMinionCard> = [];
  const fields = Object.keys(player.minion) as Array<keyof typeof player.minion>;

  fields.forEach((field) => {
    const minion = player.minion[field];

    if (minion) {
      list.push(minion);
    }
  });

  return list[randomInt(list.length)];
};

export {getRandomMinion};
