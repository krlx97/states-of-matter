import { EffectId } from "@som/shared/enums";
import { randomInt } from "crypto";
import { moveToGraveyard } from "../moveToGraveyard";
import { deductHealth } from "../deductHealth";
import type { Animations } from "@som/shared/types/game";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface Ricochet {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const ricochet = (params: Ricochet): Animations => {
  const {player, playerMinion, opponent, opponentTrap} = params;
  const animations: Animations = [];

  const possibleMinions: Array<{minion: GameMinionCard, key: keyof typeof player.field}> = [];
  const minionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;

  minionKeys.forEach((key) => {
    const minion = player.field[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push({minion, key});
      }
    }
  });

  // animations.push({
  //   type: "TRAP",
  //   id: opponentTrap.id,
  //   name: opponent.name
  // });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {minion, key} = possibleMinions[randomMinion];

    deductHealth(player, minion, playerMinion.damage);

    animations.push({
      type: "FLOATING_TEXT",
      field: key,
      name: player.name,
      text: "Ricochet"
    }, {
      type: "DAMAGE",
      damageTaken: playerMinion.damage,
      field: key,
      name: player.name
    });

    if (minion.health <= 0) {
      moveToGraveyard(player, minion, key);

      animations.push({
        type: "DEATH",
        field: key,
        name: player.name
      });
    }
  }

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return animations;
};

export {ricochet};
