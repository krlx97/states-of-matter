import {EffectId} from "@som/shared/enums";
import {heartOfSteel} from "./triggerEffect/heartOfSteel";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import gameEngine from ".";

/**
* MODIFY THIS FUNCTION SO THAT IT CHECKS WHETHER HP IS <0, CALLS ALL ONDEATH EFFECTS
* AND MOVES THE CARD TO GRAVEYARD.
*/
const deductHealth = (
  attacker: GamePlayer,
  attacked: GamePlayer,
  attackerMinion: GameMinionCard,
  attackedMinion: GameMinionCard
): void => {
  const shieldBuff = attackerMinion.buffs.find((buff) => buff.id === EffectId.SHIELD);

  if (shieldBuff) { // has shield
    const amt = shieldBuff.data.amount;

    if (amt > attackedMinion.damage) { // shield reduced
      shieldBuff.data.amount -= attackedMinion.damage
    } else if (amt <= attackedMinion.damage) { // shield broken
      if (attacker.trap && attacker.trap.effect === EffectId.HEART_OF_STEEL) {
        heartOfSteel({minion: attackerMinion, player: attacker, trap: attacker.trap});
      }

      const remaining = shieldBuff.data.amount - attackedMinion.damage;

      if (remaining < 0) {
        if (attackedMinion.buffs.find((buff) => buff.id === EffectId.LEECH)) {
          gameEngine.triggerEffect.leech({player: attacked, minion: attackedMinion});
        }

        if (attackerMinion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
          attackerMinion.health -= 1;
        } else {
          attackerMinion.health -= remaining;
        }
      }

      const index = attackerMinion.buffs.indexOf(shieldBuff);
      attackerMinion.buffs.splice(index, 1);
    }
  } else { // no shield
    if (attackedMinion.buffs.find((buff) => buff.id === EffectId.LEECH)) {
      gameEngine.triggerEffect.leech({player: attacked, minion: attackedMinion});
    }

    if (attackerMinion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
      attackerMinion.health -= 1;
    } else {
      attackerMinion.health -= attackedMinion.damage;
    }
  }

  if (attackerMinion.health <= 0) {
    const hasAcidicDeathBuff = attackerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
    const hasSelfDescturctDebuff = attackerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
  }
};

export {deductHealth};
