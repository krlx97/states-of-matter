import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  GameTrapCard,
  MinionField
} from "@som/shared/types/mongo";

interface PoisonedGround {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const poisonedGround = (params: PoisonedGround): Animations => {
  const {player, playerMinion, playerMinionField, opponent, opponentTrap} = params;
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

  playerMinion.debuffs.push({
    id: EffectId.NEUROTOXIN,
    data: {}
  });

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return animations;
};

export {poisonedGround};
