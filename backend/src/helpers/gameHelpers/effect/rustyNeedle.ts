import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface RustyNeedle {
  opponentMinion: GameMinionCard;
}

const rustyNeedle = (params: RustyNeedle): Animations => {
  const {opponentMinion} = params;
  const animations: Animations = [];

  animations.push({
    type: "TRAP",
    name: opponent.name,
    card: opponentTrap
  }, {
    type: "FLOATING_TEXT",
    name: player.name,
    field: playerMinionField,
    text: "Neurotoxin"
  });

  opponentMinion.debuffs.push({
    id: EffectId.NEUROTOXIN,
    data: {}
  });

  return animations;
};

export {rustyNeedle};
