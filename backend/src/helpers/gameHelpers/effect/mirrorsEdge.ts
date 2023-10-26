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

  player.field.hero.health -= playerMinion.damage;
  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [{
    type: "TRAP",
    id: opponentTrap.id
  }, {
    type: "DAMAGE",
    field: ("hero" as any),
    damageTaken: playerMinion.damage,
    name: player.name
  }];
};

export {mirrorsEdge};
