import { EffectId } from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";
import { randomInt } from "crypto";

interface Regeneration {
  player: GamePlayer;
}

const regeneration: Effect<Regeneration> = (params) => {
  const {player} = params;
  const minionKeys = Object.keys(player.minion) as Array<keyof typeof player.minion>;
  const possibleKeys: Array<"a" | "b" | "c" | "d"> = [];

  minionKeys.forEach((key) => {
    const Minion = player.minion[key];
    if (!Minion) { return; }

    if (Minion.buffs.find((buff) => buff.id !== EffectId.REGENERATION)) {
      possibleKeys.push(key);
    }
  });

  if (possibleKeys.length) {
    const rand = randomInt(possibleKeys.length)
    const min = player.minion[possibleKeys[rand]];
    if (!min) { return [false, ""]; }
    min.health += 2;
  }

  return [true, ""];
};

export {regeneration};
