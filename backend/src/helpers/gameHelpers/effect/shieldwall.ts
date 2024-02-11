import {EffectId} from "@som/shared/enums";
import {getAdjacentMinions} from "../getAdjacentMinions";
import type {Animations} from "@som/shared/types/game";
import type {GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Shieldwall {
  player: GamePlayer;
  playerMinionField: MinionField;
}

const shieldwall = (params: Shieldwall): Animations => {
  const {player, playerMinionField} = params;
  const animations: Animations = [];
  const fields = getAdjacentMinions(playerMinionField);

  animations.push({
    type: "FLOATING_TEXT",
    field: playerMinionField,
    name: player.name,
    text: `SHIELDWALL`
  });

  fields.forEach((field): void => {
    const minion = player.field[field as keyof typeof player.field];

    if (minion) {
      const shieldBuff = minion.buffs.find(
        (buff): boolean => buff.id === EffectId.SHIELD
      );

      const unbreakableBuff = minion.buffs.find(
        (buff): boolean => buff.id === EffectId.UNBREAKABLE
      );

      const amount = unbreakableBuff ? 2 : 1;

      if (shieldBuff) {
        shieldBuff.data.amount += amount;
      } else {
        minion.buffs.push({
          id: EffectId.SHIELD,
          data: {amount}
        });
      }

      animations.push({
        type: "FLOATING_TEXT",
        field: field as keyof typeof player.field,
        name: player.name,
        text: `+${amount} Shield`
      });
    }
  });

  return animations;
};

export {shieldwall};
