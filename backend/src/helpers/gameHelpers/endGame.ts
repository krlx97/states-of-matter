import {GameType, PlayerStatus} from "@som/shared/enums";
import { Animations } from "@som/shared/types/game";
import {mongo, server} from "app";

const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

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

    let playerAEesReward = "0";
    let playerADaily = false;
    let playerBEesReward = "0";
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

    if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
      $playerA.experience += 110 + $game.currentTurn;

      const XP_REQUIRED = 1000;

      if ($playerA.experience >= XP_REQUIRED) {
        const remaining = $playerA.experience - XP_REQUIRED;
        $playerA.level += 1;
        $playerA.experience = remaining;

        playerAEesReward = `${BigInt(playerAEesReward) + 1n  * 10n ** 18n}`;

        if ($playerA.level % 2 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 2n  * 10n ** 18n}`;
        }
        if ($playerA.level % 4 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 4n  * 10n ** 18n}`;
        }
        if ($playerA.level % 8 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 8n  * 10n ** 18n}`;
        }
        if ($playerA.level % 16 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 16n  * 10n ** 18n}`;
        }
        if ($playerA.level % 32 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 32n  * 10n ** 18n}`;
        }
        if ($playerA.level % 64 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 64n  * 10n ** 18n}`;
        }

        $playerA.rewards.ees = `${BigInt($playerA.rewards.ees) + playerAEesReward}`;
      }

      $playerB.experience += 90 + $game.currentTurn;

      if ($playerB.experience >= XP_REQUIRED) {
        const rem = $playerB.experience - XP_REQUIRED;
        $playerB.level += 1;
        $playerB.experience = rem;

        playerBEesReward = `${BigInt(playerBEesReward) + 1n * 10n ** 18n}`;

        if ($playerB.level % 2 === 0) {
          playerBEesReward = `${BigInt(playerBEesReward) + 2n * 10n ** 18n}`;
        }
        if ($playerB.level % 4 === 0) {
          playerBEesReward = `${BigInt(playerBEesReward) + 4n * 10n ** 18n}`;
        }
        if ($playerB.level % 8 === 0) {
          playerBEesReward = `${BigInt(playerBEesReward) + 8n * 10n ** 18n}`;
        }
        if ($playerB.level % 16 === 0) {
          playerBEesReward = `${BigInt(playerBEesReward) + 16n * 10n ** 18n}`;
        }
        if ($playerB.level % 32 === 0) {
          playerBEesReward = `${BigInt(playerBEesReward) + 32n * 10n ** 18n}`;
        }
        if ($playerB.level % 64 === 0) {
          playerBEesReward = `${BigInt(playerBEesReward) + 64n * 10n ** 18n}`;
        }

        $playerB.rewards.ees = `${BigInt($playerB.rewards.ees) + playerBEesReward}`;
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
      elo: $game.type === GameType.RANKED ? 20 : 0,
      eesReward: playerAEesReward,
      playerDaily: playerADaily,
      animations
    });

    io.to($playerB.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: 90 + $game.currentTurn,
      elo: $game.type === GameType.RANKED ? -20 : 0,
      eesReward: playerBEesReward,
      playerDaily: playerBDaily,
      animations
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
    let playerAEesReward = "0";
    let playerBEesReward = "0";

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

    if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
      $playerB.experience += 110 + $game.currentTurn;

      const XP_REQUIRED = 1000;

      if ($playerB.experience >= XP_REQUIRED) {
        const remaining = $playerB.experience - XP_REQUIRED;
        $playerB.level += 1;
        $playerB.experience = remaining;

        if ($playerB.experience >= XP_REQUIRED) {
          const rem = $playerB.experience - XP_REQUIRED;
          $playerB.level += 1;
          $playerB.experience = rem;

          playerBEesReward = `${BigInt(playerBEesReward) + 1n * 10n ** 18n}`;

          if ($playerB.level % 2 === 0) {
            playerBEesReward = `${BigInt(playerBEesReward) + 2n * 10n ** 18n}`;
          }
          if ($playerB.level % 4 === 0) {
            playerBEesReward = `${BigInt(playerBEesReward) + 4n * 10n ** 18n}`;
          }
          if ($playerB.level % 8 === 0) {
            playerBEesReward = `${BigInt(playerBEesReward) + 8n * 10n ** 18n}`;
          }
          if ($playerB.level % 16 === 0) {
            playerBEesReward = `${BigInt(playerBEesReward) + 16n * 10n ** 18n}`;
          }
          if ($playerB.level % 32 === 0) {
            playerBEesReward = `${BigInt(playerBEesReward) + 32n * 10n ** 18n}`;
          }
          if ($playerB.level % 64 === 0) {
            playerBEesReward = `${BigInt(playerBEesReward) + 64n * 10n ** 18n}`;
          }

          $playerB.rewards.ees = `${BigInt($playerB.rewards.ees) + playerBEesReward}`;
        }
      }

      $playerA.experience += 90 + $game.currentTurn;

      if ($playerA.experience >= XP_REQUIRED) {
        const rem = $playerA.experience - XP_REQUIRED;
        $playerA.level += 1;
        $playerA.experience = rem;

        if ($playerA.level % 2 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 2n * 10n ** 18n}`;
        }
        if ($playerA.level % 4 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 4n * 10n ** 18n}`;
        }
        if ($playerA.level % 8 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 8n * 10n ** 18n}`;
        }
        if ($playerA.level % 16 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 16n * 10n ** 18n}`;
        }
        if ($playerA.level % 32 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 32n * 10n ** 18n}`;
        }
        if ($playerA.level % 64 === 0) {
          playerAEesReward = `${BigInt(playerAEesReward) + 64n * 10n ** 18n}`;
        }

        $playerA.rewards.ees = `${BigInt($playerA.rewards.ees) + playerAEesReward}`;
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
      elo: $game.type === GameType.RANKED ? 20 : 0,
      playerDaily: playerBDaily,
      eesReward: playerBEesReward,
      animations
    });

    io.to($playerA.socketId).emit("gameEnded" as any, {
      isWinner: false,
      gameType: $game.type,
      experience: 90 + $game.currentTurn,
      elo: $game.type === GameType.RANKED ? -20 : 0,
      playerDaily: playerADaily,
      eesReward: playerAEesReward, animations
    });
  }

  const isDeletedGame = await $games.deleteOne({id: gameId});

  if (!isDeletedGame.deletedCount) { return; }
};

export {endGame};
