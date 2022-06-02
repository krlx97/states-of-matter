import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const endTurn: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("endTurn", async () => {
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await gamesDb.findOne({gameId});

    if (!$game) { return; }
    if ($game.currentPlayer !== username) { return; }

    const {opponent} = gameEngine.getPlayers($game, username);
    const {hero, minion} = opponent;

    await gameEngine.drawCard($game, opponent);

    hero.mana = 20;

    const minionKeys = Object.keys(minion) as Array<keyof typeof minion>;

    minionKeys.forEach((key) => {
      const Minion = minion[key];
      if (!Minion) { return; }
      Minion.canAttack = true;
      Minion.hasTriggeredEffect = false;
    });

    $game.currentPlayer = opponent.username;
    $game.currentTurn += 1;

    await gameEngine.saveGame($game);
  });
};

export {endTurn};
