import { EffectId } from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";
import { randomInt } from "crypto";
import { moveToGraveyard } from "../moveToGraveyard";
import { deductHealth2 } from "../deductHealth2";

interface Ricochet {
  player: GamePlayer;
  opponent: GamePlayer;
  minionCard: GameMinionCard;
  trapCard: GameTrapCard;
}

const ricochet: Effect<Ricochet> = (params) => {
  const {player, opponent, minionCard, trapCard} = params;

  const possibleMinions: Array<{minion: GameMinionCard, key: keyof typeof opponent.minion}> = [];
  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;

  minionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push({minion, key});
      }
    }
  });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {minion, key} = possibleMinions[randomMinion];

    deductHealth2(opponent, minion, minionCard.damage);

    if (minion.health <= 0) {
      moveToGraveyard(opponent, minion, key);
    }
  }

  opponent.graveyard.push(trapCard);
  opponent.trap = undefined;

  return [true, ""];
};

export {ricochet};
