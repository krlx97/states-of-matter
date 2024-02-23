import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface OnNormalSummon {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

let unbreakable = {
  onNormalSummon (params: OnNormalSummon): Animations {
    let {player, playerMinion, playerMinionField} = params;

    playerMinion.buffs.push({
      id: EffectId.UNBREAKABLE,
      data: {}
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "UNBREAKABLE"
    }];
  }
};

export {unbreakable};
