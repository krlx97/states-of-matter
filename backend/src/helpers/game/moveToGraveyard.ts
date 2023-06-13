import {cards} from "@som/shared/data";
import {EffectId} from "@som/shared/enums";
import {revenge} from "./triggerEffect/revenge";
import {unity} from "./triggerEffect/unity";
import type {Field, GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

const moveToGraveyard = (player: GamePlayer, minion: GameMinionCard, field: Field): void => {
  const hasRevengeBuff = minion.buffs.find((buff) => buff.id === EffectId.REVENGE) !== undefined;
  const hasUnityBuff = minion.buffs.find((buff) => buff.id === EffectId.UNITY) !== undefined;

  const card: any = cards.find((card) => card.id === minion.id);

  if (!card) return;

  minion.health = minion.maxHealth;
  minion.damage = card.damage;
  minion.buffs = [];
  minion.debuffs = [];
  player.graveyard.push(minion);
  player.minion[field] = undefined;

  if (hasRevengeBuff) {
    revenge({player, field});
  }

  if (hasUnityBuff) {
    unity({player});
  }
};

export {moveToGraveyard};
