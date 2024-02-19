import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Revenge {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const revenge = {
  onNormalSummon (params: Revenge): Animations {
    const {player, playerMinion, playerMinionField} = params;

    playerMinion.buffs.push({
      id: EffectId.REVENGE,
      data: {}
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "REVENGE"
    }];
  },
  onDeath (params: Revenge): Animations {
    const {player, playerMinionField} = params;

    const handCard = player.hand.find((card) => card.effect === EffectId.REVENGE) as GameMinionCard | undefined;
    const deckCard = player.deck.find((card) => card.effect === EffectId.REVENGE) as GameMinionCard | undefined;

    if (!handCard && !deckCard) {
      return [];
    }

    if (handCard) {
      const index = player.hand.indexOf(handCard);
      player.field[playerMinionField] = handCard;
      player.hand.splice(index, 1);
    } else if (deckCard) {
      const index = player.deck.indexOf(deckCard);
      player.field[playerMinionField] = deckCard;
      player.deck.splice(index, 1);
    }

    const playerMinion = player.field[playerMinionField];

    if (!playerMinion) {
      return [];
    }

    return [{
      type: "SUMMON",
      name: player.name,
      field: playerMinionField,
      minion: playerMinion
    }];
  }
};

export {revenge};
