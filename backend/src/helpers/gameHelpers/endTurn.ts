import { Animations } from "@som/shared/types/game";
import { endGame } from "./endGame";
import { mongo } from "app";
import { getGame } from "./getGame";
import { attackMinionSave } from "./attackMinionSave";
import { endTurnTimeouts } from "./endTurnTimeouts";
import { EffectId } from "@som/shared/enums";
import { blaze } from "./effect/blaze";
import { regeneration } from "./effect/regeneration";
import { deductHealth } from "./deductHealth";
import { moveToGraveyard } from "./moveToGraveyard";
import { isGameOver } from "./isGameOver";
import { getGameName } from "./getGameName";

const endTurn = async (name: string): Promise<any> => {
  const $player = await mongo.$players.findOne({name});
  const [getGameData, getGameError] = await getGameName($player.name);
  const animations: Animations = [];

  if (!getGameData) {
    return;
  }

  // const {playerA, playerB} = $game;
  // const player = playerA.name === $game.currentPlayer ? playerA : playerB;
  // const opponent = playerA.name === $game.currentPlayer ? playerB : playerA;
  const {$game, player, opponent} = getGameData;

  if (player.hand.length > 6) {
    const toRemove = player.hand.splice(0, player.hand.length - 6);
    player.graveyard.push(...toRemove);
  }

  const card = opponent.deck.pop();

  if (!card) {
    return await endGame($game.id, player.name, animations);
  }

  opponent.hand.push(card);

  let howMuchMana = 5;

  $game.currentTurn += 1;

  if ($game.currentTurn === 0 || $game.currentTurn === 1) {
    howMuchMana = 5;
  } else if ($game.currentTurn === 2 || $game.currentTurn === 3) {
    howMuchMana = 6;
  } else if ($game.currentTurn === 4 || $game.currentTurn === 5) {
    howMuchMana = 7;
  } else if ($game.currentTurn === 6 || $game.currentTurn === 7) {
    howMuchMana = 8;
  } else if ($game.currentTurn === 8 || $game.currentTurn === 9) {
    howMuchMana = 9;
  } else if ($game.currentTurn >= 10) {
    howMuchMana = 10;
  }

  const manaDelta = howMuchMana - player.field.hero.mana.current;
  player.field.hero.mana.current = howMuchMana;

  animations.push({
    type: "END_TURN",
    name: player.name
  }, {
    type: "MANA_CAPACITY",
    name: player.name,
    increment: manaDelta,
    decrement: undefined
  });

  const neurotoxinDebuff = opponent.field.hero.debuffs.find(
    (debuff): boolean => debuff.id === EffectId.NEUROTOXIN
  );

  if (neurotoxinDebuff) {
    opponent.field.hero.health.current -= 1;

    animations.push({
      type: "FLOATING_TEXT",
      name: opponent.name,
      field: "hero",
      text: "Neurotoxin"
    }, {
      type: "HEALTH",
      name: opponent.name,
      field: "hero",
      increment: undefined,
      decrement: 1
    });

    if (await isGameOver($game, animations)) {
      return;
    }
  }

  const playerMinionFields: ["a", "b", "c", "d"] = ["a", "b", "c", "d"];

  playerMinionFields.forEach((field): void => {
    const minion = player.field[field];
    const oppMinion = opponent.field[field];

    if (minion) {
      const blazeBuff = minion.buffs.find(
          (buff): boolean => buff.id === EffectId.BLAZE
        );

      const regenerationBuff = minion.buffs.find(
        (buff): boolean => buff.id === EffectId.REGENERATION
      );

      if (blazeBuff) {
        animations.push(...blaze.onEndTurn({
          player,
          playerMinionField: field,
          blazeBuff
        }));
      }

      if (regenerationBuff) {
        animations.push(...regeneration({player}));
      }

      minion.canAttack = true;
    }

    if (oppMinion) {
      const neurotoxinDebuff = oppMinion.debuffs.find(
        (debuff): boolean => debuff.id === EffectId.NEUROTOXIN
      );

      if (neurotoxinDebuff) {
        animations.push({
          type: "FLOATING_TEXT",
          name: player.name,
          field,
          text: "Neurotoxin"
        });

        animations.push(...deductHealth(player, oppMinion, 1, field));

        if (oppMinion.health.current <= 0) {
          animations.push(...moveToGraveyard(player, oppMinion, field));
        }
      }
    }
  });

  $game.endTurnTime = Date.now() + 90000;
  $game.currentPlayer = opponent.name;

  await attackMinionSave($game, animations, true);

  clearTimeout(endTurnTimeouts[$game.id]);
  endTurnTimeouts[$game.id] = setTimeout((): void => {
    endTurn($game.currentPlayer);
  }, 90000);
};

export {endTurn};
