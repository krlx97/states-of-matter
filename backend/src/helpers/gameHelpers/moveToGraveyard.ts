import {cards} from "@som/shared/data";
import {EffectId} from "@som/shared/enums";
import {revenge} from "./effect/revenge";
import {unity} from "./effect/unity";
import type {Field, GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";

const moveToGraveyard = (player: GamePlayer, minion: GameMinionCard, field: MinionField): void => {
  const hasRevengeBuff = minion.buffs.find((buff) => buff.id === EffectId.REVENGE) !== undefined;
  const hasUnityBuff = minion.buffs.find((buff) => buff.id === EffectId.UNITY) !== undefined;

  const card: any = cards.find((card) => card.id === minion.id);

  if (!card) return;

  minion.health = minion.maxHealth;
  minion.damage = card.damage;
  minion.buffs = [];
  minion.debuffs = [];
  player.graveyard.push(minion);
  player.field[field] = undefined;

  if (hasRevengeBuff) {
    revenge({player, field});
  }

  if (hasUnityBuff) {
    unity({player});
  }
};

export {moveToGraveyard};
