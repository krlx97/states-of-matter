import {GameType, PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo, server} from "app";
import {generateGame} from "./generateGame";
import {generateGameView} from "./generateGameView";

const startGame = async (
  id: number,
  type: GameType,
  playerA: string,
  playerB: string
): Promise<void> => {
  const {$accounts, $games, $players} = mongo;
  const {io} = server;
  const [$playerA, $playerB, $accountA, $accountB] = await Promise.all([
    $players.findOneAndUpdate({
      name: playerA
    }, {
      $set: {
        status: PlayerStatus.IN_GAME,
        queueId: QueueId.NONE,
        lobbyId: 0,
        gamePopupId: 0,
        gameId: id
      }
    }),
    $players.findOneAndUpdate({
      name: playerB
    }, {
      $set: {
        status: PlayerStatus.IN_GAME,
        queueId: QueueId.NONE,
        lobbyId: 0,
        gamePopupId: 0,
        gameId: id
      }
    }),
    $accounts.findOne({
      name: playerA
    }),
    $accounts.findOne({
      name: playerB
    }),
  ]);

  if (!$playerA || !$playerB || !$accountA || !$accountB) {
    return;
  }

  const game = generateGame(id, type, $playerA, $playerB);
  const isInserted = await $games.insertOne(game);

  if (!isInserted.insertedId) {
    return;
  }

  io.to($playerA.socketId).emit("startGame" as any, {
    playerA: {
      name: $playerA.name,
      avatarId: $accountA.avatarId,
      level: $playerA.level,
      elo: $playerA.elo
    },
    playerB: {
      name: $playerB.name,
      avatarId: $accountB.avatarId,
      level: $playerB.level,
      elo: $playerB.elo
    },
    game: generateGameView(game, $playerA.name)
  });

  io.to($playerB.socketId).emit("startGame" as any, {
    playerA: {
      name: $playerA.name,
      avatarId: $accountA.avatarId,
      level: $playerA.level,
      elo: $playerA.elo
    },
    playerB: {
      name: $playerB.name,
      avatarId: $accountB.avatarId,
      level: $playerB.level,
      elo: $playerB.elo
    },
    game: generateGameView(game, $playerB.name)
  });
};

export {startGame};
