import {randomInt} from "crypto";
import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import { moveToGraveyard } from "../moveToGraveyard";
import { deductHealth2 } from "../deductHealth2";
import { insertBuff } from "../insertBuff";

interface Glory {
  opponent: GamePlayer;
  minion: GameMinionCard;
}

const glory: Effect<Glory> = (params) => {
  const {opponent, minion} = params;
  const possibleMinions: Array<{Minion: GameMinionCard, key: keyof typeof opponent.minion}> = [];
  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;

  minionKeys.forEach((key) => {
    const Minion = opponent.minion[key];

    if (Minion) {
      const hasElusiveBuff = Minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push({Minion, key});
      }
    }
  });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {Minion, key} = possibleMinions[randomMinion];

    deductHealth2(opponent, Minion, 2);

    if (minion.health <= 0) {
      moveToGraveyard(opponent, Minion, key);
      insertBuff(minion, EffectId.TAUNT); // refactor this, minion = player, Minion = opponent
    }
  }

  return [true, ""];
};

export {glory};
