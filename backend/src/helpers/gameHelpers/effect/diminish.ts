import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Diminish {
  opponent: GamePlayer;
  opponentMinion: GameMinionCard;
  opponentMinionField: MinionField;
}

const diminish = (params: Diminish): Animations => {
  const {opponent, opponentMinion, opponentMinionField} = params;
  const animations: Animations = [];

  if (opponentMinion.damage.current > 2) {
    opponentMinion.damage.current -= 2;

    opponentMinion.debuffs.push({
      id: EffectId.DIMINISH,
      data: {
        damage: -2
      }
    });

    animations.push({
      type: "FLOATING_TEXT",
      name: opponent.name,
      field: opponentMinionField,
      text: "DIMINISH"
    }, {
      type: "DAMAGE",
      name: opponent.name,
      field: opponentMinionField,
      increment: (-2)
    });
  } else {
    const val = opponentMinion.damage.current;
    opponentMinion.damage.current = 0;

    opponentMinion.debuffs.push({
      id: EffectId.DIMINISH,
      data: {
        damage: -val
      }
    });

    animations.push({
      type: "FLOATING_TEXT",
      name: opponent.name,
      field: opponentMinionField,
      text: "DIMINISH"
    }, {
      type: "DAMAGE",
      name: opponent.name,
      field: opponentMinionField,
      increment: -val
    });
  }

  return animations;
};

export {diminish};
