import {EffectId} from "@som/shared/enums";
import {randomInt} from "crypto";
import type {GameMinion, GamePlayer} from "models/game";

const quickShot = (minion: GameMinion, opponent: GamePlayer): void => {
  if (minion.effect === EffectId.QUICK_SHOT && !minion.hasTriggeredEffect) {
    const possibleMinions: Array<GameMinion> = [];
    const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;

    minionKeys.forEach((key) => {
      const minion = opponent.minion[key];

      if (!minion) { return; }

      possibleMinions.push(minion);
    });

    if (possibleMinions.length < 1) { return; }

    let randomMinion = 0;

    if (possibleMinions.length > 1) {
      randomMinion = randomInt(possibleMinions.length);
    }

    possibleMinions[randomMinion].health -= 2;
    minion.hasTriggeredEffect = true;
  }
};

export {quickShot};
