import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type { Animations } from "@som/shared/types/game";
import type {FieldKeys, GamePlayer} from "@som/shared/types/mongo";

interface Shell {
  player: GamePlayer;
}

const shell = (params: Shell): Animations => {
  const {player} = params;
  const animations: Animations = [];
  const fieldKeys = Object.keys(player.field) as FieldKeys;

  fieldKeys.forEach((fieldKey): void => {
    const card = player.field[fieldKey];

    if (!card) { return; }

    const shieldBuff = card.buffs.find(
      (buff): boolean => buff.id === EffectId.SHIELD
    );

    const unbreakableBuff = card.buffs.find(
      (buff): boolean => buff.id === EffectId.UNBREAKABLE
    );

    const amount = unbreakableBuff ? 2 : 1;

    if (shieldBuff) {
      shieldBuff.data.amount += amount;
    } else {
      card.buffs.push({
        id: EffectId.SHIELD,
        data: {amount}
      });
    }

    animations.push({
      type: "FLOATING_TEXT",
      field: fieldKey,
      name: player.name,
      text: `+${amount} Shield`
    });
  });

  return animations;
};

export {shell};
