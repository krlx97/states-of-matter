import type {
  GameMinionCard,
  GamePlayer,
  GameTrapCard
} from "@som/shared/types/mongo";

import type {Animations} from "@som/shared/types/game";

interface MirrorsEdge {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const mirrorsEdge = (params: MirrorsEdge): Animations => {
  const {player, playerMinion, opponent, opponentTrap} = params;

  player.field.hero.health.current -= playerMinion.damage.current;
  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [{
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
    // playerB: player.name,
    // playerBNumber: playerMinion.damage.current,
    // playerBField: "hero"
  }, {
    type: "HEALTH",
    field: "hero",
    decrement: playerMinion.damage.current,
    increment: undefined,
    name: player.name
  }];
};

export {mirrorsEdge};
