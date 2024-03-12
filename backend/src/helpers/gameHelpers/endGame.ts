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

    let playerAEesReward = 0n;
    let playerADaily = false;
    let playerBEesReward = 0n;
    let playerBDaily = false;

    if (!$playerA.tasks.daily) {
      $playerA.tasks.daily = true;
      playerADaily = true;
    }

    if (!$playerB.tasks.daily && $playerB.tasks.dailyAlternative < 2) {
      $playerB.tasks.dailyAlternative += 1;
    } else if (!$playerB.tasks.daily && $playerB.tasks.dailyAlternative >= 2) {
      $playerB.tasks.daily = true;
      playerBDaily = true
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
    const POW = 10n ** 18n;

    $playerA.experience += aXp;
    $playerB.experience += bXp;

    if ($playerA.experience >= XP_REQUIRED) {
      const remaining = $playerA.experience - XP_REQUIRED;

      $playerA.level += 1;
      $playerA.experience = remaining;
      playerAEesReward = 1n * POW;

      if ($playerA.level % 2 === 0) {   playerAEesReward += 2n * POW; }
      if ($playerA.level % 4 === 0) {   playerAEesReward += 4n * POW; }
      if ($playerA.level % 8 === 0) {   playerAEesReward += 8n * POW; }
      if ($playerA.level % 16 === 0) {  playerAEesReward += 16n * POW; }
      if ($playerA.level % 32 === 0) {  playerAEesReward += 32n * POW; }
      if ($playerA.level % 64 === 0) {  playerAEesReward += 64n * POW; }

      let currentEes = BigInt($playerA.rewards.ees);
      let newEes = currentEes + playerAEesReward;

      $playerA.rewards.ees = newEes.toString();
    }

    if ($playerB.experience >= XP_REQUIRED) {
      const rem = $playerB.experience - XP_REQUIRED;

      $playerB.level += 1;
      $playerB.experience = rem;
      playerBEesReward = 1n * POW;

      if ($playerB.level % 2 === 0) {   playerBEesReward += 2n * POW; }
      if ($playerB.level % 4 === 0) {   playerBEesReward += 4n * POW; }
      if ($playerB.level % 8 === 0) {   playerBEesReward += 8n * POW; }
      if ($playerB.level % 16 === 0) {  playerBEesReward += 16n * POW; }
      if ($playerB.level % 32 === 0) {  playerBEesReward += 32n * POW; }
      if ($playerB.level % 64 === 0) {  playerBEesReward += 64n * POW; }

      let currentEes = BigInt($playerB.rewards.ees);
      let newEes = currentEes + playerBEesReward;

      $playerB.rewards.ees = newEes.toString();
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

    const $playerAReplace = await $players.replaceOne({
      name: playerA.name
    }, $playerA);

    const $playerBReplace = await $players.replaceOne({
      name: playerB.name
    }, $playerB);

    io.to($playerA.socketId).emit("gameEnded" as any, {
      isWinner: true,
      gameType: $game.type,
      experience: aXp,
      elo: $game.type === GameType.RANKED ? eloPlayerA : 0,
      eesReward: playerAEesReward.toString(),
      playerDaily: playerADaily,
      animations
    });

    io.to($playerB.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: bXp,
      elo: $game.type === GameType.RANKED ? eloPlayerB : 0,
      eesReward: playerBEesReward.toString(),
      playerDaily: playerBDaily,
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

    let playerADaily = false;
    let playerBDaily = false;
    let playerAEesReward = 0n;
    let playerBEesReward = 0n;

    if (!$playerB.tasks.daily) {
      $playerB.tasks.daily = true;
      playerBDaily = true;
    }

    if (!$playerA.tasks.daily && $playerA.tasks.dailyAlternative < 2) {
      $playerA.tasks.dailyAlternative += 1;
    } else if (!$playerA.tasks.daily && $playerA.tasks.dailyAlternative >= 2) {
      $playerA.tasks.daily = true;
      playerADaily = true;
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
    const POW = 10n ** 18n;

    $playerB.experience += bXp;
    $playerA.experience += aXp;

    if ($playerB.experience >= XP_REQUIRED) {
      const remaining = $playerB.experience - XP_REQUIRED;

      $playerB.level += 1;
      $playerB.experience = remaining;
      playerBEesReward = 1n * POW;

      if ($playerB.level % 2 === 0) {   playerBEesReward += 2n * POW; }
      if ($playerB.level % 4 === 0) {   playerBEesReward += 4n * POW; }
      if ($playerB.level % 8 === 0) {   playerBEesReward += 8n * POW; }
      if ($playerB.level % 16 === 0) {  playerBEesReward += 16n * POW; }
      if ($playerB.level % 32 === 0) {  playerBEesReward += 32n * POW; }
      if ($playerB.level % 64 === 0) {  playerBEesReward += 64n * POW; }

      let currentEes = BigInt($playerB.rewards.ees);
      let newEes = currentEes + playerBEesReward;

      $playerB.rewards.ees = newEes.toString();
    }

    if ($playerA.experience >= XP_REQUIRED) {
      const remaining = $playerA.experience - XP_REQUIRED;

      $playerA.level += 1;
      $playerA.experience = remaining;
      playerAEesReward = 1n * POW;

      if ($playerA.level % 2 === 0) {   playerAEesReward += 2n * POW; }
      if ($playerA.level % 4 === 0) {   playerAEesReward += 4n * POW; }
      if ($playerA.level % 8 === 0) {   playerAEesReward += 8n * POW; }
      if ($playerA.level % 16 === 0) {  playerAEesReward += 16n * POW; }
      if ($playerA.level % 32 === 0) {  playerAEesReward += 32n * POW; }
      if ($playerA.level % 64 === 0) {  playerAEesReward += 64n * POW; }

      let currentEes = BigInt($playerA.rewards.ees);
      let newEes = currentEes + playerAEesReward;

      $playerA.rewards.ees = newEes.toString();
    }

    const {eloPlayerA, eloPlayerB} = calculateEloPointsForPlayers($playerA.elo, $playerB.elo, 'playerB');

    if ($game.type === GameType.CUSTOM) {
      $playerB.games.custom.won += 1;
      $playerA.games.custom.lost += 1;
    } else if ($game.type === GameType.CASUAL) {
      $playerB.games.casual.won += 1;
      $playerA.games.casual.lost += 1;
    } else if ($game.type === GameType.RANKED) {
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
      playerDaily: playerBDaily,
      eesReward: playerBEesReward.toString(),
      animations
    });

    io.to($playerA.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: aXp,
      elo: $game.type === GameType.RANKED ? eloPlayerA : 0,
      playerDaily: playerADaily,
      eesReward: playerAEesReward.toString(),
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
