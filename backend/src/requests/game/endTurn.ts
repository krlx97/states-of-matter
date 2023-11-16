import {CardType, EffectId} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const endTurn: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("endTurn", async () => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player, opponent} = getGameData;

    const card = opponent.deck.pop();

    if (!card) {
      return await gameHelpers.endGame($game.id, player.name);
    }

    opponent.hand.push(card);

    player.field.hero.mana = 10;

    const playerMinionFields = Object.keys(player.field) as Array<keyof typeof player.field>;

    playerMinionFields.forEach((field) => {
      const minion = player.field[field];

      if (!minion || minion.type === CardType.HERO) { return; }

      minion.canAttack = true;
      gameHelpers.effect.blaze({minion});

      if (minion.buffs.find((buff) => buff.id === EffectId.REGENERATION)) {
        gameHelpers.effect.regeneration({player});
      }
    });

    $game.currentPlayer = opponent.name;
    $game.currentTurn += 1;

    await gameHelpers.saveGame($game);
  });
};

export {endTurn};
