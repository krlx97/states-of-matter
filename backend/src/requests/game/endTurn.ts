import {EffectId} from "@som/shared/enums";
import gameEngine from "helpers/game";
import type {SocketRequest} from "@som/shared/types/backend";

const endTurn: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("endTurn", async () => {
    const [getGameData, getGameError] = await gameEngine.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player, opponent} = getGameData;

    await gameEngine.drawCard($game, player, opponent);

    player.hero.mana = 10;

    const playerMinionFields = Object.keys(player.minion) as Array<keyof typeof player.minion>;

    playerMinionFields.forEach((field) => {
      const minion = player.minion[field];

      if (!minion) { return; }

      minion.canAttack = true;
      gameEngine.triggerEffect.blaze({minion});

      if (minion.buffs.find((buff) => buff.id === EffectId.REGENERATION)) {
        gameEngine.triggerEffect.regeneration({player});
      }
    });

    $game.currentPlayer = opponent.name;
    $game.currentTurn += 1;

    await gameEngine.saveGame($game);
  });
};

export {endTurn};
