import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GamePlayer} from "@som/shared/types/mongo";

interface SmokeBomb {
  player: GamePlayer;
}

const smokeBomb = (params: SmokeBomb): Animations => {
  const {player} = params;
  const animations: Animations = [];
  const minionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;

  minionKeys.forEach((key): void => {
    const minion = player.field[key];

    if (!minion) {
      return;
    }

    const elusiveBuff = minion
      .buffs
      .find((buff): boolean => buff.id === EffectId.ELUSIVE);

    if (elusiveBuff) {
      return;
    }

    minion.buffs.push({
      id: EffectId.STEALTH,
      data: {}
    });

    animations.push({
      type: "FLOATING_TEXT",
      name: player.name,
      field: key,
      text: "Stealth"
    });
  });

  return animations;
};

export {smokeBomb};
