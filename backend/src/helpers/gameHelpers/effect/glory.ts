import {randomInt} from "crypto";
import {CardType, EffectId} from "@som/shared/enums";
import type {GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";
import { moveToGraveyard } from "../moveToGraveyard";
import { deductHealth } from "../deductHealth";
import { insertBuff } from "../insertBuff";
import { Animations } from "@som/shared/types/game";

interface Glory {
  player: GamePlayer;
  opponent: GamePlayer;
  minion: GameMinionCard;
  playerMinionField: MinionField;
}

const glory = (params: Glory): Animations => {
  const {player, opponent, minion, playerMinionField} = params;
  const animations: Animations = [];
  const possibleMinions: Array<{Minion: GameMinionCard, key: MinionField}> = [];
  const minionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;

  minionKeys.forEach((key) => {
    const Minion = opponent.field[key];

    if (Minion && Minion.type !== CardType.HERO && key !== "hero") {
      const hasElusiveBuff = Minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push({Minion, key});
      }
    }
  });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {Minion, key} = possibleMinions[randomMinion];

    animations.push({
      type: "FLOATING_TEXT",
      name: opponent.name,
      field: key,
      text: "GLORY"
    });
    animations.push(...deductHealth(opponent, Minion, 1, key));

    if (Minion.health.current <= 0) {
      animations.push(...moveToGraveyard(opponent, Minion, key));
      minion.buffs.push({id: EffectId.TAUNT, data: {}})
      animations.push({
        type: "FLOATING_TEXT",
        name: player.name,
        field: playerMinionField,
        text: "TAUNT"
      });
    }
  }

  return animations;
};

export {glory};
