import {GameType, PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";

const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

const endGame = async (gameId: number, winnerName: string): Promise<void> => {
  const {$games, $players} = mongo;
  const {io} = server;
  const $game = await $games.findOne({id: gameId});

  if (!$game) { return; }

  const {playerA, playerB} = $game;

  if (winnerName === playerA.name) {
    const $playerA = await $players.findOne({
      name: playerA.name
    });
    const $playerB = await $players.findOne({
      name: playerB.name
    });

    if (!$playerA || !$playerB) { return; }

    $playerA.status = PlayerStatus.ONLINE;
    $playerA.gameId = 0;
    $playerB.status = PlayerStatus.ONLINE;
    $playerB.gameId = 0;

    if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
      $playerA.experience += 110 + $game.currentTurn;

      const aReq = 1000 + ($playerA.level % 10) * 100;
      if ($playerA.experience >= aReq) {
        const rem = $playerA.experience - aReq;
        $playerA.level += 1;
        $playerA.experience = rem;
        // call levelup on chain, and save returned values, emit with gameEnded
      }

      $playerB.experience += 90 + $game.currentTurn;

      const bReq = 1000 + ($playerB.level % 10) * 100;
      if ($playerB.experience >= bReq) {
        const rem = $playerB.experience - bReq;
        $playerB.level += 1;
        $playerB.experience = rem;
        // call levelup on chain, and save returned values, emit with gameEnded
      }
    }

    if ($game.type === GameType.CASUAL) {
      $playerA.games.casual.won += 1;
      $playerB.games.casual.lost += 1;
    }

    if ($game.type === GameType.RANKED) {
      $playerA.games.ranked.won += 1;
      $playerB.games.ranked.lost += 1;
      $playerA.elo += 20;
      $playerB.elo -= 20;
    }

    const $playerAReplace = await $players.replaceOne({
      name: playerA.name
    }, $playerA);

    const $playerBReplace = await $players.replaceOne({
      name: playerB.name
    }, $playerB);

    io.to($playerA.socketId).emit("gameEnded" as any, {
      isWinner: true,
      gameType: $game.type,
      experience: 110 + $game.currentTurn,
      elo: $game.type === GameType.RANKED ? 20 : 0
    });

    io.to($playerB.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: 90 + $game.currentTurn,
      elo: $game.type === GameType.RANKED ? -20 : 0
    });



  } else if (winnerName === playerB.name) {



    const $playerB = await $players.findOne({
      name: playerB.name
    });
    const $playerA = await $players.findOne({
      name: playerA.name
    });

    if (!$playerB || !$playerA) { return; }

    $playerB.status = PlayerStatus.ONLINE;
    $playerB.gameId = 0;
    $playerA.status = PlayerStatus.ONLINE;
    $playerA.gameId = 0;

    if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
      $playerB.experience += 110 + $game.currentTurn;

      const bReq = 1000 + ($playerB.level % 10) * 100;
      if ($playerB.experience >= bReq) {
        const rem = $playerB.experience - bReq;
        $playerB.level += 1;
        $playerB.experience = rem;
        // call levelup on chain, and save returned values, emit with gameEnded
      }

      $playerA.experience += 90 + $game.currentTurn;

      const aReq = 1000 + ($playerA.level % 10) * 100;
      if ($playerA.experience >= aReq) {
        const rem = $playerA.experience - aReq;
        $playerA.level += 1;
        $playerA.experience = rem;
        // call levelup on chain, and save returned values, emit with gameEnded
      }
    }

    if ($game.type === GameType.CASUAL) {
      $playerB.games.casual.won += 1;
      $playerA.games.casual.lost += 1;
    }

    if ($game.type === GameType.RANKED) {
      $playerB.games.ranked.won += 1;
      $playerA.games.ranked.lost += 1;
      $playerB.elo += 20;
      $playerA.elo -= 20;
    }

    const $playerBeplace = await $players.replaceOne({
      name: playerB.name
    }, $playerB);

    const $playerAReplace = await $players.replaceOne({
      name: playerA.name
    }, $playerA);

    io.to($playerB.socketId).emit("gameEnded" as any, {
      isWinner: true,
      gameType: $game.type,
      experience: 110 + $game.currentTurn,
      elo: $game.type === GameType.RANKED ? 20 : 0
    });

    io.to($playerA.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: 90 + $game.currentTurn,
      elo: $game.type === GameType.RANKED ? -20 : 0
    });
  }

  const isDeletedGame = await $games.deleteOne({id: gameId});

  if (!isDeletedGame.deletedCount) { return; }
};

export {endGame};
