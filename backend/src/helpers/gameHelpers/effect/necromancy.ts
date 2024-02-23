import {EffectId} from "@som/shared/enums";
import {insertDebuff} from "../insertDebuff";
import {insertBuff} from "../insertBuff";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface Necromancy {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const necromancy = {
  onNormalSummon (params: Necromancy): Animations {
    const {player, playerMinion, playerMinionField} = params;
    const animations: Animations = [];

    playerMinion.health.current -= 2;
    playerMinion.damage.current -= 2;

    insertDebuff(playerMinion, EffectId.NECROMANCY, {
      health: -2,
      damage: -2
    });

    animations.push({
      type: "FLOATING_TEXT",
      field: playerMinionField,
      text: "NECROMANCY",
      name: player.name
    }, {
      type: "DAMAGE",
      name: player.name,
      field: playerMinionField,
      increment: undefined,
      decrement: 2,
    }, {
      type: "HEALTH",
      name: player.name,
      field: playerMinionField,
      increment: undefined,
      decrement: 2,
    });

    return animations;
  },
  onSpecialSummon (params: Necromancy): Animations {
    const {player, playerMinion, playerMinionField} = params;
    const animations: Animations = [];

    playerMinion.health.current += 2;
    playerMinion.damage.current += 2;

    insertBuff(playerMinion, EffectId.NECROMANCY, {
      health: 2,
      damage: 2
    });

    animations.push({
      type: "FLOATING_TEXT",
      field: playerMinionField,
      text: "NECROMANCY",
      name: player.name
    }, {
      type: "DAMAGE",
      name: player.name,
      field: playerMinionField,
      increment: 2,
      decrement: undefined,
    }, {
      type: "HEALTH",
      name: player.name,
      field: playerMinionField,
      increment: 2,
      decrement: undefined,
    });

    return animations;
  }
};

export {necromancy};
