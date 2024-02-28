import {GameType, PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo, server} from "app";
import {generateGame} from "./generateGame";
import {generateGameView} from "./generateGameView";
import { endTurn } from "./endTurn";
import { endTurnTimeouts } from "./endTurnTimeouts";

const startGame = async (
  id: number,
  type: GameType,
  playerA: string,
  playerB: string
): Promise<void> => {
  const {$games, $players} = mongo;
  const {io} = server;

  const [$playerA, $playerB] = await Promise.all([
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
  ]);

  if (!$playerA || !$playerB) { return; }

  const game = generateGame(id, type, $playerA, $playerB);
  const isInserted = await $games.insertOne(game);

  if (!isInserted.insertedId) { return; }

  clearTimeout(endTurnTimeouts[game.id]);
  endTurnTimeouts[game.id] = setTimeout(async (): Promise<void> => {
    await endTurn(game.currentPlayer);
  }, 30000);

  io.to($playerA.socketId).emit("startGame" as any, {
    playerA: {
      name: $playerA.name,
      avatarId: $playerA.avatarId,
      bannerId: $playerA.bannerId,
      level: $playerA.level,
      elo: $playerA.elo,
      experience: $playerA.experience,
      games: $playerA.games
    },
    playerB: {
      name: $playerB.name,
      avatarId: $playerB.avatarId,
      bannerId: $playerB.bannerId,
      level: $playerB.level,
      elo: $playerB.elo,
      experience: $playerB.experience,
      games: $playerB.games
    },
    game: generateGameView(game, $playerA.name)
  });

  io.to($playerB.socketId).emit("startGame" as any, {
    playerA: {
      name: $playerA.name,
      avatarId: $playerA.avatarId,
      bannerId: $playerA.bannerId,
      level: $playerA.level,
      elo: $playerA.elo,
      experience: $playerA.experience,
      games: $playerA.games
    },
    playerB: {
      name: $playerB.name,
      avatarId: $playerB.avatarId,
      bannerId: $playerB.bannerId,
      level: $playerB.level,
      elo: $playerB.elo,
      experience: $playerB.experience,
      games: $playerB.games
    },
    game: generateGameView(game, $playerB.name)
  });

  server.io.emit("updateFriend", {name: $playerA.name, status: PlayerStatus.IN_GAME});
  server.io.emit("updateFriend", {name: $playerB.name, status: PlayerStatus.IN_GAME});
};

export {startGame};
