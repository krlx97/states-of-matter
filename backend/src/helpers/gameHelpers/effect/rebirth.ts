import {EffectId} from "@som/shared/enums";
import {necromancy} from "./necromancy";
import {protector} from "./protector";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";
import { shadowSurge } from "./shadowSurge";

interface Rebirth {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const rebirth = (params: Rebirth): Animations => {
  const {player, playerMinion, playerMinionField} = params;
  const animations: Animations = [];

  animations.push({
    type: "SUMMON",
    name: player.name,
    field: playerMinionField,
    minion: playerMinion,
    necromancyFixPositive: true
  }, {
    type: "FLOATING_TEXT",
    field: playerMinionField,
    text: "REBIRTH",
    name: player.name
  });

  if (playerMinion.effect === EffectId.SHADOW_SURGE) {
    animations.push(...shadowSurge.onSpecialSummon({
      player,
      playerMinion,
      playerMinionField
    }));
  }

  if (playerMinion.effect === EffectId.NECROMANCY) {
    animations.push(...necromancy.onSpecialSummon({
      player,
      playerMinion,
      playerMinionField
    }));
  }

  if (playerMinion.effect === EffectId.PROTECTOR) {
    animations.push(...protector.onSpecialSummon({
      player,
      playerMinion,
      playerMinionField
    }));
  }

  player.field[playerMinionField] = playerMinion;
  player.graveyard.splice(player.graveyard.indexOf(playerMinion), 1);

  return animations;
};

export {rebirth};
