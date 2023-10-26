import { randomInt } from "crypto";
import { CardType, EffectId } from "@som/shared/enums";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface Regeneration {
  player: GamePlayer;
}

const regeneration = (params: Regeneration) => {
  const {player} = params;
  const minionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;
  const possibleKeys: Array<"a" | "b" | "c" | "d"> = [];

  minionKeys.forEach((key) => {
    const Minion = player.field[key];
    if (!Minion || Minion.type === CardType.HERO) { return; }

    if (Minion.buffs.find((buff) => buff.id !== EffectId.REGENERATION)) {
      possibleKeys.push(key);
    }
  });

  if (possibleKeys.length) {
    const rand = randomInt(possibleKeys.length)
    const min = player.field[possibleKeys[rand]];
    if (!min) { return [false, ""]; }
    min.health += 2;
  }

  return [true, ""];
};

export {regeneration};
