import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface OnNormalSummon {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

interface OnAttack {
  opponent: GamePlayer;
  opponentMinion: GameMinionCard;
  opponentMinionField: MinionField;
}

const poisonousTouch = {
  onNormalSummon (params: OnNormalSummon): Animations {
    const {player, playerMinion, playerMinionField} = params;
    const animations: Animations = [];

    playerMinion.buffs.push({
      id: EffectId.POISONOUS_TOUCH,
      data: {}
    });

    animations.push({
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "POISONOUS TOUCH"
    });

    return animations;
  },
  onAttack (params: OnAttack): Animations {
    const {opponent, opponentMinion, opponentMinionField} = params;
    const animations: Animations = [];

    const neurotoxin = opponentMinion.debuffs.find(
      (debuff): boolean => debuff.id === EffectId.NEUROTOXIN
    );

    if (!neurotoxin) {
      opponentMinion.debuffs.push({
        id: EffectId.NEUROTOXIN,
        data: {}
      });

      animations.push({
        type: "FLOATING_TEXT",
        field: opponentMinionField,
        name: opponent.name,
        text: "NEUROTOXIN"
      });
    }

    return animations;
  }
};

export {poisonousTouch};
