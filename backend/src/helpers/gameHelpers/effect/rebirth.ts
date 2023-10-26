import {CardType, EffectId} from "@som/shared/enums";
import type {GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Rebirth {
  player: GamePlayer;
  target?: number;
  field?: MinionField;
}

const rebirth = (params: Rebirth) => {
  const {player, target, field} = params;

  if (!target) {
    return [false, "Target for revival not specified."];
  }

  if (!field) {
    return [false, "Field for Special Summon not specified."];
  }

  if (player.field[field]) {
    return [false, `Minion already exists on the field ${field}.`];
  }

  const toRevive = player.graveyard.find((card) => card.gid === target);

  if (!toRevive) {
    return [false, "Card with the given ID not found in the graveyard."];
  }

  if (toRevive.type !== CardType.MINION) {
    return [false, "Selected card for revival must be a Minion."];
  }

  if (toRevive.effect === EffectId.ELUSIVE) {
    return [false, "Rebirth negated."];
  }

  if (toRevive.effect === EffectId.NECROMANCY) {
    toRevive.damage += 2;
    toRevive.health += 2;
    toRevive.buffs.push({
      id: EffectId.NECROMANCY,
      data: {damage: 2, health: 2}
    });
  }

  if (toRevive.effect === EffectId.PROTECTOR) {
    toRevive.buffs.push({id: EffectId.SHIELD, data: {amount: 3}});
  }

  player.field[field] = toRevive;
  player.graveyard.splice(player.graveyard.indexOf(toRevive), 1);

  return [true, "Successfully revived."];
};

export {rebirth};
