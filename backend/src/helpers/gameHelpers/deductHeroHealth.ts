import {EffectId} from "@som/shared/enums";
import {heartOfSteel} from "./effect/heartOfSteel";
import type {Field, GameMinionCard, GamePlayer} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

const deductHeroHealth = (
  player: GamePlayer,
  // minion: GameMinionCard,
  damage: number,
  // field: Field
): Animations => {
  const {hero} = player.field;
  const shieldBuff = hero.buffs.find(
    (buff): boolean => buff.id === EffectId.SHIELD
  );

  const animations: Animations = [];

  if (shieldBuff) { // has shield
    const amt = shieldBuff.data.amount;

    if (amt > damage) { // shield reduced
      shieldBuff.data.amount -= damage
      animations.push({
        type: "FLOATING_TEXT",
        field: "hero",
        name: player.name,
        text: `-${damage} Shield`
      });
    } else if (amt <= damage) { // shield broken
      // if (player.trap && player.trap.effect === EffectId.HEART_OF_STEEL) {
      //   animations.push(...heartOfSteel({opponentMinion: minion, opponent: player, opponentTrap: player.trap, field}));
      // }

      const remaining = damage - shieldBuff.data.amount;

      if (remaining > 0) {
        if (hero.buffs.find((buff) => buff.id === EffectId.RESILIENT) && remaining > 1) {
          hero.health.current -= 1;
        } else {
          hero.health.current -= remaining;
        }
      }

      animations.push({
        type: "FLOATING_TEXT",
        field: "hero",
        name: player.name,
        text: `-${shieldBuff.data.amount} Shield`
      }, {
        type: "HEALTH",
        field: "hero",
        name: player.name,
        decrement: remaining,
        increment: undefined,
      });

      hero.buffs.splice(hero.buffs.indexOf(shieldBuff), 1);
    }
  } else { // no shield
    if (hero.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
      hero.health.current -= 1;
    } else {
      hero.health.current -= damage;
    }

    animations.push({
      type: "HEALTH",
      field: "hero",
      name: player.name,
      decrement: damage,
      increment: undefined,
    });
  }

  return animations;
};

export {deductHeroHealth};
