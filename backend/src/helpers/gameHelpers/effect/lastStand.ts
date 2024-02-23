import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";

interface LastStand {
  opponent: GamePlayer;
  opponentMinion: GameMinionCard;
  opponentMinionField: MinionField;
  opponentTrap: GameTrapCard;
}

const lastStand = (params: LastStand): Animations => {
  const {opponent, opponentMinion, opponentMinionField, opponentTrap} = params;
  const animations: Animations = [];

  animations.push({
    type: "TRAP",
    name: opponent.name,
    card: opponentTrap
  }, {
    type: "HEALTH",
    field: opponentMinionField,
    name: opponent.name,
    increment: 1 - opponentMinion.health.current
  }, {
    type: "FLOATING_TEXT",
    field: opponentMinionField,
    name: opponent.name,
    text: `Last stand`
  }, {
    type: "FLOATING_TEXT",
    field: opponentMinionField,
    name: opponent.name,
    text: `+ Taunt`
  });

  opponentMinion.buffs.push({
    id: EffectId.TAUNT,
    data: {}
  });

  opponentMinion.health.current = 1;

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return animations;
};

export {lastStand};
