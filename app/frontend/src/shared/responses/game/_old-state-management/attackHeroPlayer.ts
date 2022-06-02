import {socketService} from "services";
import {gameStore} from "stores";

export const attackHeroPlayer = (): void => {
  const {socket} = socketService;

  socket.on("attackHeroPlayer", (params): void => {
    const {attacker} = params;

    gameStore.update((game) => {
      const {player, opponent} = game;
      const playerMinion = player.minion[attacker];
      const opponentHero = opponent.hero;

      opponentHero.health -= playerMinion.damage;
      playerMinion.hasAttacked = true;

      return game;
    });
  });
};
