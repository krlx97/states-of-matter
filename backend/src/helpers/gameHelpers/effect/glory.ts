import {randomInt} from "crypto";
import {EffectId} from "@som/shared/enums";
import {deductHealth} from "../deductHealth";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Animations} from "@som/shared/types/game";

import type {
  FieldKeys,
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface Glory {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
  opponent: GamePlayer;
}

const glory = {
  onNormalSummon (params: Glory): Animations {
    const {player, playerMinion, playerMinionField, opponent} = params;

    interface PossibleMinion {
      minion: GameMinionCard;
      field: MinionField;
    }

    type PossibleMinions = Array<PossibleMinion>;

    const possibleMinions: PossibleMinions = [];
    const minionFields = Object.keys(opponent.field) as FieldKeys;
    const animations: Animations = [];

    for (let field of minionFields) {
      if (field === "hero") { continue; }

      const minion = opponent.field[field];
      const hasElusiveBuff = minion?.buffs.find(
        (buff): boolean => buff.id === EffectId.ELUSIVE
      );

      if (minion && !hasElusiveBuff) {
        possibleMinions.push({minion, field});
      }
    }

    if (possibleMinions.length) {
      let randomMinion = randomInt(possibleMinions.length);
      let {minion, field} = possibleMinions[randomMinion];

      animations.push({
        type: "FLOATING_TEXT",
        name: opponent.name,
        field,
        text: "GLORY"
      }, ...deductHealth(opponent, minion, 1, field));

      if (minion.health.current <= 0) {
        animations.push(...moveToGraveyard(opponent, minion, field));

        playerMinion.buffs.push({
          id: EffectId.TAUNT,
          data: {}
        });

        animations.push({
          type: "FLOATING_TEXT",
          name: player.name,
          field: playerMinionField,
          text: "TAUNT"
        });
      }
    }

    return animations;
  }
};

export {glory};
