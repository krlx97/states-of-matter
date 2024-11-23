import { CardType, EffectId } from "@som/shared/enums";
import { randomInt } from "crypto";
import { moveToGraveyard } from "../moveToGraveyard";
import { deductHealth } from "../deductHealth";
import type { Animations } from "@som/shared/types/game";
import type {FieldKeys, GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";

interface Ricochet {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const ricochet = (params: Ricochet): Animations => {
  const {player, playerMinion, opponent, opponentTrap} = params;
  const animations: Animations = [];

  const possibleMinions: Array<{minion: GameMinionCard, key: MinionField}> = [];
  const fieldKeys = Object.keys(player.field) as FieldKeys;

  fieldKeys.forEach((key): void => {
    if (key === "hero") { return; }

    const minion = player.field[key];

    if (!minion) { return; }

    const hasElusiveBuff = minion.buffs.find(
      ({id}): boolean => id === EffectId.ELUSIVE
    );

    if (hasElusiveBuff) { return; }

    possibleMinions.push({minion, key});
  });

  animations.push({
    type: "TRAP",
    name: opponent.name,
    card: opponentTrap
  });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {minion, key} = possibleMinions[randomMinion];

    animations.push({
      type: "FLOATING_TEXT",
      field: key,
      name: player.name,
      text: "Ricochet"
    }, {
      type: "SHAKE",
      attacker: undefined,
      attacked: {
        name: player.name,
        decrement: playerMinion.damage.current,
        field: key
      }
      // playerA: player.name,
      // playerANumber: playerMinion.damage.current,
      // playerAField: key
    });

    animations.push(...deductHealth(player, minion, playerMinion.damage.current, key));

    if (minion.health.current <= 0) {
      animations.push(...moveToGraveyard(player, minion, key));
    }
  }

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return animations;
};

export {ricochet};
