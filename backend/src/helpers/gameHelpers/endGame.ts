import {GameType, PlayerStatus} from "@som/shared/enums";
import { Animations } from "@som/shared/types/game";
import {mongo, server} from "app";
import { endTurnTimeouts } from "./endTurnTimeouts";
import { calculateEloPointsForPlayers } from "./eloCalculations";


const endGame = async (gameId: number, winnerName: string, animations: Animations): Promise<void> => {
  const {$games, $players} = mongo;
  const {io} = server;
  const $game = await $games.findOne({id: gameId});

  if (!$game) { return; }

  const {playerA, playerB} = $game;

  if (winnerName === playerA.name) {


    const [$playerA, $playerB] = await Promise.all([
      $players.findOne({
        name: playerA.name
      }),
      $players.findOne({
        name: playerB.name
      })
    ]);

    if (!$playerA || !$playerB) { return; }

    $playerA.status = PlayerStatus.ONLINE;
    $playerA.gameId = 0;

    $playerB.status = PlayerStatus.ONLINE;
    $playerB.gameId = 0;

    let playerALevelUp = false;
    let playerAWin = false;

    let playerBLevelUp = false;
    let playerBWin = false;

    if (!$playerA.tasks.win) {
      $playerA.tasks.win = true;
      playerAWin = true;
    }

    let aXp = 0;
    let bXp = 0;

    if ($game.type === GameType.CUSTOM) {
      aXp = 30 + $game.currentTurn;
      bXp = 26 + $game.currentTurn;
    }
    if ($game.type === GameType.CASUAL) {
      aXp = 90 + $game.currentTurn;
      bXp = 78 + $game.currentTurn;
    }
    if ($game.type === GameType.RANKED) {
      aXp = 60 + $game.currentTurn;
      bXp = 54 + $game.currentTurn;
    }

    const XP_REQUIRED = 1000;

    $playerA.experience += aXp;
    $playerB.experience += bXp;

    if ($playerA.experience >= XP_REQUIRED) {
      const remaining = $playerA.experience - XP_REQUIRED;

      $playerA.level += 1;
      $playerA.experience = remaining;
      $playerA.tasks.levelUp = true;

      playerALevelUp = true;
    }

    if ($playerB.experience >= XP_REQUIRED) {
      const remaining = $playerB.experience - XP_REQUIRED;

      $playerB.level += 1;
      $playerB.experience = remaining;
      $playerB.tasks.levelUp = true;

      playerBLevelUp = true;
    }

    const {eloPlayerA, eloPlayerB} = calculateEloPointsForPlayers($playerA.elo, $playerB.elo, 'playerA');

    if ($game.type === GameType.CUSTOM) {
      $playerA.games.custom.won += 1;
      $playerB.games.custom.lost += 1;
    }

    if ($game.type === GameType.CASUAL) {
      $playerA.games.casual.won += 1;
      $playerB.games.casual.lost += 1;
    }

    if ($game.type === GameType.RANKED) {
      $playerA.games.ranked.won += 1;
      $playerB.games.ranked.lost += 1;
      $playerA.elo += eloPlayerA;
      $playerB.elo -= eloPlayerB;
    }

    await Promise.all([
      $players.replaceOne({name: playerA.name}, $playerA),
      $players.replaceOne({name: playerB.name}, $playerB)
    ]);

    io.to($playerA.socketId).emit("gameEnded" as any, {
      isWinner: true,
      gameType: $game.type,
      experience: aXp,
      elo: $game.type === GameType.RANKED ? eloPlayerA : 0,
      levelUp: playerALevelUp,
      win: playerAWin,
      animations
    });

    io.to($playerB.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: bXp,
      elo: $game.type === GameType.RANKED ? eloPlayerB : 0,
      levelUp: playerBLevelUp,
      win: playerBWin,
      animations
    });

    server.io.emit("updateFriend", {
      name: $playerA.name,
      status: $playerA.status,
      experience: $playerA.experience,
      level: $playerA.level,
      elo: $playerA.elo,
      games: $playerA.games
    });
    server.io.emit("updateFriend", {
      name: $playerB.name,
      status: $playerB.status,
      experience: $playerB.experience,
      level: $playerB.level,
      elo: $playerB.elo,
      games: $playerB.games
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

    let playerALevelUp = false;
    let playerAWin = false;

    let playerBLevelUp = false;
    let playerBWin = false;

    if (!$playerB.tasks.win) {
      $playerB.tasks.win = true;
      playerBWin = true;
    }

    let aXp = 0;
    let bXp = 0;

    if ($game.type === GameType.CUSTOM) {
      bXp = 30 + $game.currentTurn;
      aXp = 26 + $game.currentTurn;
    }
    if ($game.type === GameType.CASUAL) {
      bXp = 90 + $game.currentTurn;
      aXp = 78 + $game.currentTurn;
    }
    if ($game.type === GameType.RANKED) {
      bXp = 60 + $game.currentTurn;
      aXp = 54 + $game.currentTurn;
    }

    const XP_REQUIRED = 1000;

    $playerB.experience += bXp;
    $playerA.experience += aXp;

    if ($playerB.experience >= XP_REQUIRED) {
      const remaining = $playerB.experience - XP_REQUIRED;

      $playerB.level += 1;
      $playerB.experience = remaining;
      $playerB.tasks.levelUp = true;

      playerBLevelUp = true;
    }

    if ($playerA.experience >= XP_REQUIRED) {
      const remaining = $playerA.experience - XP_REQUIRED;

      $playerA.level += 1;
      $playerA.experience = remaining;
      $playerA.tasks.levelUp = true;

      playerALevelUp = true;
    }

    const {eloPlayerA, eloPlayerB} = calculateEloPointsForPlayers($playerA.elo, $playerB.elo, 'playerB');

    if ($game.type === GameType.CUSTOM) {
      $playerB.games.custom.won += 1;
      $playerA.games.custom.lost += 1;
    }

    if ($game.type === GameType.CASUAL) {
      $playerB.games.casual.won += 1;
      $playerA.games.casual.lost += 1;
    }

    if ($game.type === GameType.RANKED) {
      $playerB.games.ranked.won += 1;
      $playerA.games.ranked.lost += 1;
      $playerA.elo -= eloPlayerA;
      $playerB.elo += eloPlayerB;
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
      experience: bXp,
      elo: $game.type === GameType.RANKED ? eloPlayerB : 0,
      levelUp: playerBLevelUp,
      win: playerBWin,
      animations
    });

    io.to($playerA.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: aXp,
      elo: $game.type === GameType.RANKED ? eloPlayerA : 0,
      levelUp: playerALevelUp,
      win: playerAWin,
      animations
    });

    server.io.emit("updateFriend", {
      name: $playerB.name,
      status: $playerB.status,
      experience: $playerB.experience,
      level: $playerB.level,
      elo: $playerB.elo,
      games: $playerB.games
    });

    server.io.emit("updateFriend", {
      name: $playerA.name,
      status: $playerA.status,
      experience: $playerA.experience,
      level: $playerA.level,
      elo: $playerA.elo,
      games: $playerA.games
    });
  }

  clearTimeout(endTurnTimeouts[gameId]);
  endTurnTimeouts[gameId] = undefined;
  await $games.deleteOne({id: gameId});
};

export {endGame};
