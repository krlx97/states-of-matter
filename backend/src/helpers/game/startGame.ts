import {GameType, PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo, server} from "apis";
import {generateGame} from "./generateGame";
import {generateGameView} from "./generateGameFe";

const startGame = async (
  id: number,
  type: GameType,
  playerA: string,
  playerB: string
): Promise<void> => {
  const {accounts, games, players} = mongo;
  const {io} = server;
  const [$playerA, $playerB, $accountA, $accountB] = await Promise.all([
    players.findOneAndUpdate({
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
    players.findOneAndUpdate({
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
    accounts.findOne({
      name: playerA
    }),
    accounts.findOne({
      name: playerB
    }),
  ]);

  if (!$playerA.value || !$playerB.value || !$accountA || !$accountB) {
    return;
  }

  const game = generateGame(id, type, $playerA.value, $playerB.value);
  const isInserted = await games.insertOne(game);

  if (!isInserted.insertedId) {
    return;
  }

  io.to($playerA.value.socketId).emit("startGame" as any, {
    playerA: {
      name: $playerA.value.name,
      avatarId: $accountA.avatarId,
      level: $playerA.value.level,
      elo: $playerA.value.elo
    },
    playerB: {
      name: $playerB.value.name,
      avatarId: $accountB.avatarId,
      level: $playerB.value.level,
      elo: $playerB.value.elo
    },
    game: generateGameView(game, $playerA.value.name)
  });

  io.to($playerB.value.socketId).emit("startGame" as any, {
    playerA: {
      name: $playerA.value.name,
      avatarId: $accountA.avatarId,
      level: $playerA.value.level,
      elo: $playerA.value.elo
    },
    playerB: {
      name: $playerB.value.name,
      avatarId: $accountB.avatarId,
      level: $playerB.value.level,
      elo: $playerB.value.elo
    },
    game: generateGameView(game, $playerB.value.name)
  });
};

export {startGame};

