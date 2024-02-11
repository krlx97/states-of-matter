import {CardType, EffectId} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Animations} from "@som/shared/types/game";

const endTurn: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("endTurn", async () => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
    const animations: Animations = [];

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player, opponent} = getGameData;

    const card = opponent.deck.pop();

    if (!card) {
      return await gameHelpers.endGame($game.id, player.name);
    }

    opponent.hand.push(card);

    const manaDelta = 10 - opponent.field.hero.mana.current
    player.field.hero.mana.current = 10;

    animations.push({
      type: "MANA_CAPACITY",
      field: "hero",
      name: opponent.name,
      increment: manaDelta
    });

    const playerMinionFields = Object.keys(player.field) as Array<keyof typeof player.field>;

    playerMinionFields.forEach((field) => {
      const minion = player.field[field];

      if (!minion || minion.type === CardType.HERO || field === "hero") { return; }

      minion.canAttack = true;
      animations.push(...gameHelpers.effect.blaze({player, playerMinion: minion, playerMinionField: field}));

      if (minion.buffs.find((buff) => buff.id === EffectId.REGENERATION)) {
        gameHelpers.effect.regeneration({player});
      }
    });

    $game.currentPlayer = opponent.name;
    $game.currentTurn += 1;

    await gameHelpers.attackMinionSave($game, animations);
  });
};

export {endTurn};
