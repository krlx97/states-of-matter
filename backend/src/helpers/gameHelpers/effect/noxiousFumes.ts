import {EffectId} from "@som/shared/enums";
import type {Field, GameMinionCard, GamePlayer, GameTrapCard, MinionField} from "@som/shared/types/mongo";
import { deductHealth } from "../deductHealth";
import { moveToGraveyard } from "../moveToGraveyard";
import type { Animations } from "@som/shared/types/game";

interface NoxiousFumes {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
  opponent: GamePlayer;
  opponentTrap: GameTrapCard;
}

const noxiousFumes = (params: NoxiousFumes): Animations => {
  const {player, opponent, playerMinion, playerMinionField, opponentTrap} = params;
  const animations: Animations = [];

  const minionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;
  let damage = 0;

  minionKeys.forEach((key) => {
    const minion = player.field[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        const hasNeurotoxinDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.NEUROTOXIN);

        if (hasNeurotoxinDebuff) {
          damage += 1;
        }
      }
    }
  });

  animations.push(...deductHealth(player, playerMinion, damage, playerMinionField));

  animations.push({
    type: "FLOATING_TEXT",
    field: playerMinionField,
    name: player.name,
    text: "Noxious Fumes"
  });

  if (playerMinion.health.current <= 0) {
    moveToGraveyard(player, playerMinion, playerMinionField);

    animations.push({
      type: "DEATH",
      field: playerMinionField,
      name: player.name
    });
  }

  opponent.graveyard.push(opponentTrap);
  opponent.trap = undefined;

  return [];
};

export {noxiousFumes};
