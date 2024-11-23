import type {Field, GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

interface Frostbite {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: Field;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const frostbite = (params: Frostbite): Animations => {
  const {player, playerMinion, playerMinionField, opponent, opponentTrap} = params;

  playerMinion.damage = 1;
  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [{
    type: "FLOATING_TEXT",
    field: playerMinionField,
    name: player.name,
    text: "+Frostbite",
  }];
};

export {frostbite};
