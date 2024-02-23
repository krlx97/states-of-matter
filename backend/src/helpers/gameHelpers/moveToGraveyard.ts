import {EffectId} from "@som/shared/enums";
import {revenge} from "./effect/revenge";
import {unity} from "./effect/unity";
import type {Field, GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

const moveToGraveyard = (player: GamePlayer, minion: GameMinionCard, field: MinionField): Animations => {
  const hasRevengeBuff = minion.buffs.find((buff) => buff.id === EffectId.REVENGE) !== undefined;
  const hasUnityBuff = minion.buffs.find((buff) => buff.id === EffectId.UNITY) !== undefined;
  const animations: Animations = [];

  minion.health.current = minion.health.default;
  minion.damage.current = minion.damage.default;
  minion.buffs = [];
  minion.debuffs = [];

  player.graveyard.push(minion);
  player.field[field] = undefined;

  animations.push({
    type: "DEATH",
    field,
    name: player.name
  });

  if (hasRevengeBuff) {
    animations.push(...revenge.onDeath({player, playerMinionField: field}));
  }

  if (hasUnityBuff) {
    animations.push(...unity.onDeath({player}));
  }

  return animations;
};

export {moveToGraveyard};
