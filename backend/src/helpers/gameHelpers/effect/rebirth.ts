import {CardType, EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Rebirth {
  player: GamePlayer;
  minion: GameMinionCard;
  field: MinionField;
}

const rebirth = (params: Rebirth): Animations => {
  const {player, minion, field} = params;
  const animations: Animations = [];

  animations.push({
    type: "SUMMON",
    name: player.name,
    field,
    minion,
    necromancyFixPositive: true
  }, {
    type: "FLOATING_TEXT",
    field,
    text: "REBIRTH",
    name: player.name
  });

  if (minion.effect === EffectId.NECROMANCY) {
    minion.damage.current += 2;
    minion.health.current += 2;
    minion.buffs.push({
      id: EffectId.NECROMANCY,
      data: {damage: 2, health: 2}
    });

    animations.push({
      type: "FLOATING_TEXT",
      field,
      text: "NECROMANCY",
      name: player.name
    }, {
      type: "DAMAGE",
      name: player.name,
      field,
      increment: 2
    }, {
      type: "HEALTH",
      name: player.name,
      field,
      increment: 2
    });
  }

  if (minion.effect === EffectId.PROTECTOR) {
    minion.buffs.push({
      id: EffectId.SHIELD,
      data: {amount: 3}
    });

    animations.push({
      type: "FLOATING_TEXT",
      field,
      text: "PROTECTOR",
      name: player.name
    }, {
     type: "FLOATING_TEXT",
      field,
      text: "+3 Shield",
      name: player.name
    });
  }

  player.field[field] = minion;
  player.graveyard.splice(player.graveyard.indexOf(minion), 1);

  return animations;
};

export {rebirth};
