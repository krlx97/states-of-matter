import type {Animations} from "@som/shared/types/game";
import type {Field, GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface Backstab {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: Field;
  opponent: GamePlayer;
}

const backstab = (params: Backstab): Animations => {
  const {player, opponent, playerMinion, playerMinionField} = params;

  opponent.field.hero.mana.current -= 1;
  playerMinion.damage.current += 2;

  return [{
    type: "FLOATING_TEXT",
    field: "hero",
    name: opponent.name,
    text: "BACKSTAB"
  }, {
    type: "MANA_CAPACITY",
    increment: undefined,
    decrement: 1,
    name: opponent.name
  }, {
    type: "DAMAGE",
    increment: 2,
    decrement: undefined,
    field: playerMinionField,
    name: player.name
  }];
};

export {backstab};
