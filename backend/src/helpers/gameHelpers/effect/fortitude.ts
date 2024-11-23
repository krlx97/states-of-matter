import {EffectId} from "@som/shared/enums";
import {deductHealth} from "../deductHealth";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface Fortitude {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const fortitude = (params: Fortitude): Animations => {
  const {player, playerMinion, playerMinionField} = params;
  const animations: Animations = [];

  animations.push(...deductHealth(player, playerMinion, 1, playerMinionField));

  if (playerMinion.health.current > 0) {
    playerMinion.buffs.push({
      id: EffectId.TAUNT,
      data: {}
    });

    animations.push({
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: `+ Taunt`
    });
  } else {
    animations.push(
      ...moveToGraveyard(player, playerMinion, playerMinionField)
    );
  }

  return animations;
};

export {fortitude};
