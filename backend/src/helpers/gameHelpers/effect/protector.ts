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

let protector = {
  onNormalSummon (params: OnNormalSummon): Animations {
    let {player, playerMinion, playerMinionField} = params;

    playerMinion.buffs.push({
      id: EffectId.SHIELD,
      data: {amount: 1}
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "+1 Shield"
    }];
  },
  onSpecialSummon (params: OnNormalSummon): Animations {
    let {player, playerMinion, playerMinionField} = params;

    playerMinion.buffs.push({
      id: EffectId.TAUNT,
      data: {}
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "Taunt"
    }];
  }
};

export {protector};
