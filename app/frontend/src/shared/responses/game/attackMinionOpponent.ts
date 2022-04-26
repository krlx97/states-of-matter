import {Effect} from "@som/shared/enums";
import {socketService} from "services";
import {gameStore} from "stores";

export const attackMinionOpponent = (): void => {
  const {socket} = socketService;

  socket.on("attackMinionOpponent", (params): void => {
    const {attacker, attacked} = params;

    gameStore.update((game) => {
      const {player, opponent} = game;
      const playerMinion = player.minion[attacked];
      const opponentMinion = opponent.minion[attacker];

      playerMinion.health -= opponentMinion.damage;
      opponentMinion.health -= playerMinion.damage;
      playerMinion.hasAttacked = true;

      if (!playerMinion.hasTriggeredEffect) {
        if (playerMinion.effects.includes(Effect.CHARGE)) {
          playerMinion.hasAttacked = false;
          playerMinion.hasTriggeredEffect = true;
        }
      }

      if (playerMinion.health <= 0) {
        playerMinion.health = playerMinion.maxHealth;

        player.graveyard.push(playerMinion);
        player.minion[attacker] = undefined;
      }

      if (opponentMinion.health <= 0) {
        opponentMinion.health = opponentMinion.maxHealth;

        opponent.graveyard.push(opponentMinion);
        opponent.minion[attacked] = undefined;
      }

      return game;
    });
  });
};
