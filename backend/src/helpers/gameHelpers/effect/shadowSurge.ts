import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface ShadowSurge {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const shadowSurge = {
  onNormalSummon: function (params: ShadowSurge): Animations {
    const {player, playerMinion, playerMinionField} = params;

    playerMinion.canAttack = true;

    return [{
      type: "FLOATING_TEXT",
      name: player.name,
      field: playerMinionField,
      text: "SHADOW SURGE"
    }];
  },
  onSpecialSummon: function (params: ShadowSurge): Animations {
    const {player, playerMinion, playerMinionField} = params;

    playerMinion.canAttack = true;

    return [{
      type: "FLOATING_TEXT",
      name: player.name,
      field: playerMinionField,
      text: "SHADOW SURGE"
    }];
  }
};

export {shadowSurge};
