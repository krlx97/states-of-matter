import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface Blaze {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

interface OnEndTurn {
  player: GamePlayer;
  playerMinionField: GameMinionCard;
  blazeBuff: any;
}

const blaze = {
  onNormalSummon (params: Blaze): Animations {
    const {player, playerMinion, playerMinionField} = params;

    playerMinion.buffs.push({
      id: EffectId.BLAZE,
      data: {
        hasAttackedTwice: true
      }
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "BLAZE"
    }];
  },
  onEndTurn (params: OnEndTurn): Animations {
    const {player, playerMinionField, blazeBuff} = params;

    blazeBuff.data.hasAttackedTwice = false;

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      text: "BLAZE",
      name: player.name
    }];
  }
};

export {blaze};
