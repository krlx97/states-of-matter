import {CardType, EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface Spellweave {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const spellweave = {
  onNormalSummon (params: Spellweave): Animations {
    const {player, playerMinion, playerMinionField} = params;
    const {name, graveyard} = player;

    const amount = graveyard.reduce(
      (sum, {type}) => type === CardType.MAGIC ? sum += 1 : sum, 0
    );

    playerMinion.buffs.push({
      id: EffectId.SHIELD,
      data: {amount}
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name,
      text: "SPELLWEAVE"
    }, {
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name,
      text: `+${amount} Shield`
    }];
  }
};

export {spellweave};
