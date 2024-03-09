import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface OnDeath {
  player: GamePlayer;
}

interface OnNormalSummon {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

const unity = {
  onNormalSummon (params: OnNormalSummon): Animations {
    const {player, playerMinion, playerMinionField} = params;

    playerMinion.buffs.push({
      id: EffectId.UNITY,
      data: {}
    });

    return [{
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "UNITY"
    }];
  },
  onDeath (params: OnDeath): Animations {
    const {player: {name, hand, deck}} = params;

    const handCard = hand.find(
      (card): boolean => card.effect === EffectId.UNITY
    ) as GameMinionCard | undefined;

    const deckCard = deck.find(
      (card): boolean => card.effect === EffectId.UNITY
    ) as GameMinionCard | undefined;

    if (handCard) {
      handCard.buffs.push({
        id: EffectId.TAUNT,
        data: {}
      });
    } else if (deckCard) {
      deckCard.buffs.push({
        id: EffectId.TAUNT,
        data: {}
      });
    }

    return [{
      type: "FLOATING_TEXT",
      name,
      field: "hero",
      text: "UNITY"
    }];
  }
};

export {unity};
