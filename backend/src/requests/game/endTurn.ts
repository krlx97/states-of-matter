import {CardType, EffectId} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Animations} from "@som/shared/types/game";
import { mongo } from "app";
import { endTurnTimeouts } from "helpers/gameHelpers/endTurnTimeouts";

const endTurn: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("endTurn", async () => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
    const animations: Animations = [];

    if (!getGameData) {
      return error(getGameError);
    }

    // const {$game, player, opponent} = getGameData;

    // await gameHelpers.endTurn({$game, player, opponent});

    // setTimeout(async () => {
    //   await gameHelpers.endTurn({
    //     $game,
    //     player: opponent,
    //     opponent: player
    //   });

    //   await gameHelpers.attackMinionSave($game, animations, true);

    // }, 20000);

    // await gameHelpers.attackMinionSave($game, animations, true);





    const {$game, player, opponent} = getGameData;

    if (player.hand.length > 6) {
      const toRemove = player.hand.splice(0, player.hand.length - 6);
      player.graveyard.push(...toRemove);
    }

    const card = opponent.deck.pop();

    if (!card) {
      return await gameHelpers.endGame($game.id, player.name, animations);
    }

    opponent.hand.push(card);

    let howMuchMana = 5;

    if ($game.currentTurn === 0 || $game.currentTurn === 1) {
      howMuchMana = 5;
    } else if ($game.currentTurn === 2 || $game.currentTurn === 3) {
      howMuchMana = 6;
    } else if ($game.currentTurn === 4 || $game.currentTurn === 5) {
      howMuchMana = 7;
    } else if ($game.currentTurn === 6 || $game.currentTurn === 7) {
      howMuchMana = 9;
    } else if ($game.currentTurn === 8 || $game.currentTurn === 9) {
      howMuchMana = 9;
    } else if ($game.currentTurn >= 10) {
      howMuchMana = 10;
    }

    const manaDelta = howMuchMana - player.field.hero.mana.current;
    player.field.hero.mana.current = howMuchMana;

    animations.push({
      type: "MANA_CAPACITY",
      name: player.name,
      increment: manaDelta,
      decrement: undefined
    });

    const playerMinionFields: ["a", "b", "c", "d"] = ["a", "b", "c", "d"];

    playerMinionFields.forEach((field): void => {
      const minion = player.field[field];

      if (!minion) {
        return;
      }

      minion.canAttack = true;

      const blazeBuff = minion.buffs.find(
        (buff): boolean => buff.id === EffectId.BLAZE
      );

      const regenerationBuff = minion.buffs.find(
        (buff): boolean => buff.id === EffectId.REGENERATION
      )

      if (blazeBuff) {
        animations.push(...gameHelpers.effect.blaze.onEndTurn({
          player,
          playerMinionField: field,
          blazeBuff
        }));
      }

      if (regenerationBuff) {
        animations.push(...gameHelpers.effect.regeneration({player}));
      }
    });

    $game.endTurnTime = Date.now() + 30000;
    $game.currentPlayer = opponent.name;
    $game.currentTurn += 1;

    await gameHelpers.attackMinionSave($game, animations, true);

    clearTimeout(endTurnTimeouts[$game.id]);
    endTurnTimeouts[$game.id] = setTimeout(async (): Promise<void> => {
      await gameHelpers.endTurn($game.currentPlayer);
    }, 30000);
  });
};

export {endTurn};
