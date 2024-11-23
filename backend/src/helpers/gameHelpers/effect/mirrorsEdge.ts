import type {
  GameMinionCard,
  GamePlayer,
  GameTrapCard
} from "@som/shared/types/mongo";

import type {Animations} from "@som/shared/types/game";
import { deductHeroHealth } from "../deductHeroHealth";

interface MirrorsEdge {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const mirrorsEdge = (params: MirrorsEdge): Animations => {
  const {player, playerMinion, opponent, opponentTrap} = params;
  const animations: Animations = [];

  // player.field.hero.health.current -= playerMinion.damage.current;

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  animations.push({
    type: "TRAP",
    name: opponent.name,
    card: opponentTrap
  }, {
    type: "FLOATING_TEXT",
    name: player.name,
    field: "hero",
    text: "MIRROR'S EDGE"
  }, {
    type: "SHAKE",
    attacker: undefined,
    attacked: {
      name: player.name,
      decrement: playerMinion.damage.current,
      field: "hero"
    }
  },
// {
//     type: "HEALTH",
//     field: "hero",
//     decrement: playerMinion.damage.current,
//     increment: undefined,
//     name: player.name
//   }
  );

  animations.push(...deductHeroHealth(opponent, playerMinion.damage.current));

  return animations;
};

export {mirrorsEdge};
