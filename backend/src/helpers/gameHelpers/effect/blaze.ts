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

const blaze = (params: Blaze): Animations => {
  const {player, playerMinion, playerMinionField} = params;

  const blazeBuff = playerMinion.buffs.find(
    (buff): boolean => buff.id === EffectId.BLAZE
  );

  if (!blazeBuff) {
    return [];
  }

  blazeBuff.data.hasAttackedTwice = false;

  return [{
    type: "FLOATING_TEXT",
    field: playerMinionField,
    text: "BLAZE",
    name: player.name
  }];
};

export {blaze};
