import {randomInt} from "crypto";
import {PlayerStatus} from "@som/shared/enums";
import type {Game, GameCards} from "@som/shared/interfaces/mongo";
import type {Services} from "models";
import { PlayerDeck } from "../services/MongoService/PlayerService.models";

// mutation probably isn't the best way to do this...
export class GameController {
  public constructor (private readonly _services: Services) {}

  public async saveGame (game: Game): Promise<boolean> {
    const {mongoService} = this._services;
    const {$games} = mongoService;
    const {gameId, playerA, playerB} = game;
    const updateGame = await $games.updateOne({gameId}, {
      $set: {playerA, playerB}
    });

    if (updateGame.modifiedCount) {
      return true;
    } else {
      return false;
    }
  }

  public async isGameOver (game: Game): Promise<boolean> {
    if (game.playerA.hero.health <= 0) {
      await this.endGame(game.gameId, "B");
      return true;
    } else if (game.playerB.hero.health <= 0) {
      await this.endGame(game.gameId, "A");
      return true;
    }

    return false;
  }

  public async endGame (gameId: number, winner: "A" | "B"): Promise<void> {
    const {mongoService, socketService} = this._services;
    const {$games, $players} = mongoService;
    const {io, socket} = socketService;
    const game = await $games.findOne({gameId});

    if (!game) { return; }

    const {playerA, playerB} = game;

    const [A, B] = await Promise.all([
      $players.findOneAndUpdate({
        username: playerA.username
      }, {
        $set: {
          gameId: 0,
          status: PlayerStatus.ONLINE
        }
      }, {
        returnDocument: "after"
      }),
      $players.findOneAndUpdate({
        username: playerB.username
      }, {
        $set: {
          gameId: 0,
          status: PlayerStatus.ONLINE
        }
      }, {
        returnDocument: "after"
      })
    ]);

    if (!A.value || !B.value) { return; }

    const isDeletedGame = await $games.deleteOne({gameId});

    if (!isDeletedGame.deletedCount) { return; }

    if (winner === "A") {
      io.to(A.value.socketId).emit("notification", "You won!");
      io.to(B.value.socketId).emit("notification", "You lost...");
    } else if (winner === "B") {
      io.to(B.value.socketId).emit("notification", "You won!");
      io.to(A.value.socketId).emit("notification", "You lost...");
    }

    io.to([A.value.socketId, B.value.socketId]).emit("endGame");
  }

  public getPlayers (game: Game, username: string) {
    const {playerA, playerB} = game;
    const player = playerA.username === username ? playerA : playerB;
    const opponent = playerA.username === username ? playerB : playerA;

    return {player, opponent};
  }

  public checkPlayersDeck (playerDeck: PlayerDeck): boolean {
    const numberOfCards = playerDeck.cards.reduce((acc, curr) => acc += curr.amount, 0);

    if (numberOfCards < 30) { return false; }

    return true;
  }

  public shuffleDeck (deck: GameCards): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = randomInt(0, i + 1);
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  }
}
