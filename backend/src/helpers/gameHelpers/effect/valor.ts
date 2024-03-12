import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GamePlayer, FieldKeys} from "@som/shared/types/mongo";

interface Valor {
  player: GamePlayer;
  opponent: GamePlayer;
}

const valor = (params: Valor): Animations => {
  const {player, opponent} = params;
  const animations: Animations = [];
  const fieldKeys = Object.keys(player.field) as FieldKeys;

  const damage = fieldKeys.reduce((acc, fieldKey) => {
    const card = player.field[fieldKey];

    const shieldBuff = card
      ?.buffs
      .find(({id}): boolean => id === EffectId.SHIELD);

    if (!card || !shieldBuff) {
      return acc;
    }

    animations.push({
      type: "FLOATING_TEXT",
      field: fieldKey,
      name: player.name,
      text: `-${shieldBuff.data.amount} Shield`
    });

    acc += shieldBuff.data.amount;

    card.buffs.splice(card.buffs.indexOf(shieldBuff, 1));

    return acc;
  }, 0);

  opponent.field.hero.health.current -= damage;

  animations.push({
    type: "SHAKE",
    attacker: undefined,
    attacked: {
      name: opponent.name,
      decrement: damage,
      field: "hero"
    }
    // playerB: opponent.name,
    // playerBNumber: damage,
    // playerBField: "hero"
  }, {
    type: "HEALTH",
    field: "hero",
    name: opponent.name,
    decrement: damage,
    increment: undefined
  });

  return animations;
};

export {valor};
