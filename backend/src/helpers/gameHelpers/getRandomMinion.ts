import {CardType} from "@som/shared/enums";
import {randomInt} from "crypto";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

const getRandomMinion = (player: GamePlayer): GameMinionCard | undefined => {
  const list: Array<GameMinionCard> = [];
  const fields = Object.keys(player.field) as Array<keyof typeof player.field>;

  fields.forEach((field) => {
    const minion = player.field[field];

    if (minion && minion.type !== CardType.HERO) {
      list.push(minion);
    }
  });

  return list[randomInt(list.length)];
};

export {getRandomMinion};
