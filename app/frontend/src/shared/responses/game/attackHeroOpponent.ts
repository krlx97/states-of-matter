import {socketService} from "services";
import {gameStore} from "stores";

export const attackHeroOpponent = (): void => {
  const {socket} = socketService;

  socket.on("attackHeroOpponent", (params): void => {
    const {attacker} = params;

    gameStore.update((game) => {
      const {player, opponent} = game;
      const opponentMinion = opponent.minion[attacker];

      player.hero.health -= opponentMinion.damage;
      opponentMinion.hasAttacked = true;

      return game;
    });
  });
};
