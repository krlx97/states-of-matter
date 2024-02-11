import {randomInt} from "crypto";
import {CardType, EffectId} from "@som/shared/enums";
import {deductHealth} from "../deductHealth";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface QuickShot {
  opponent: GamePlayer;
}

const quickShot = (params: QuickShot): Animations => {
  const {opponent} = params;

  type PossibleMinionKey = keyof typeof opponent.field;
  type PossibleMinionKeys = Array<PossibleMinionKey>;

  interface PossibleMinion {
    minion: GameMinionCard;
    key: PossibleMinionKey;
  }

  type PossibleMinions = Array<PossibleMinion>;

  const possibleMinions: PossibleMinions = [];
  const minionKeys = Object.keys(opponent.field) as PossibleMinionKeys;
  const animations: Animations = [];

  minionKeys.forEach((key): void => {
    const minion = opponent.field[key];

    if (minion && minion.type !== CardType.HERO) {
      const hasElusiveBuff = minion.buffs.find(
        (buff): boolean => buff.id === EffectId.ELUSIVE
      );

      if (!hasElusiveBuff) {
        possibleMinions.push({minion, key});
      }
    }
  });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {minion, key} = possibleMinions[randomMinion];

    animations.push({
      type: "FLOATING_TEXT",
      field: key,
      name: opponent.name,
      text: "QUICK SHOT"
    })
    animations.push(...deductHealth(opponent, minion, 2, key));

    if (minion.health.current <= 0) {
      animations.push(...moveToGraveyard(opponent, minion, (key as any)));
    }
  }

  return animations;
};

export {quickShot};
