import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface Vanish {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const vanish = {
  onNormalSummon (params: Vanish): Animations {
    const {player, playerMinion, playerMinionField} = params;
    const animations: Animations = [];

    playerMinion.buffs.push({
      id: EffectId.STEALTH,
      data: {}
    });

    animations.push({
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "STEALTH"
    });

    return animations;
  }
};

export {vanish};
