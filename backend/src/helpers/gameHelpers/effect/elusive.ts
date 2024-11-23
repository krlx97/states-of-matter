import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface Elusive {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const elusive = {
  onNormalSummon (params: Elusive): Animations {
    const {player, playerMinion, playerMinionField} = params;

    playerMinion.buffs.push({
      id: EffectId.ELUSIVE,
      data: {}
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "ELUSIVE"
    }];
  }
};

export {elusive};
