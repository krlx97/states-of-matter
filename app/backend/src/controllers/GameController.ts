import {randomInt} from "crypto";
import {PlayerStatus} from "@som/shared/enums";
import type {Game, GameCards, GamePlayer} from "@som/shared/interfaces/mongo";
import type {GameFE} from "@som/shared/interfaces/client";
import type {Services} from "models";
import { Player, PlayerDeck } from "../services/MongoService/PlayerService.models";
import { cards } from "@som/shared/data";
import { GameMinion } from "@som/shared/dist/interfaces/mongo/Game";

// mutation probably isn't the best way to do this...
export class GameController {
  public constructor (private readonly _services: Services) {}

  public async saveGame (game: Game): Promise<void> {
    const {mongoService, socketService} = this._services;
    const {$games, $players} = mongoService;
    const {io} = socketService;
    const {gameId, playerA, playerB} = game;

    const [$updateGame, $playerA, $playerB] = await Promise.all([
      $games.replaceOne({gameId}, game),
      $players.findOne({
        username: playerA.username
      }),
      $players.findOne({
        username: playerB.username
      })
    ]);

    if (!$updateGame.modifiedCount || !$playerA || !$playerB) { return; }

    io.to($playerA.socketId).emit("reloadGameState", {
      game: this.generateGameFE(game, playerA.username)
    });

    io.to($playerB.socketId).emit("reloadGameState", {
      game: this.generateGameFE(game, playerB.username)
    });
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
        },
        $inc: {
          xp: 100
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
        },
        $inc: {
          xp: 100
        }
      }, {
        returnDocument: "after"
      })
    ]);

    if (!A.value || !B.value) { return; }

    if (A.value.xp >= Math.pow(A.value.level * 10, A.value.level / 100 + 1)) {
      await $players.updateOne({username: A.value.username}, {
        $inc: {lv: 1}
      });

      io.to(A.value.socketId).emit("levelUp", {
        xp: A.value.xp,
        lv: A.value.lv + 1
      });
    }
    if (B.value.xp >= Math.pow(B.value.level * 10, B.value.level / 100 + 1)) {
      await $players.updateOne({username: B.value.username}, {
        $inc: {lv: 1}
      });

      io.to(B.value.socketId).emit("levelUp", {
        xp: B.value.xp,
        lv: B.value.lv + 1
      });
    }

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

    if (numberOfCards !== 30) { return false; }

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

  private _push2Deck (deck: GameCards, gid: number, card: any): GameCards {
    if (card.health) {
      deck.push({gid, ...card, maxHealth: card.health, hasAttacked: false, hasTriggeredEffect: false} as GameMinion);
    } else {
      deck.push({gid, ...card} as any);
    }

    return deck;
  }

  private _buildDeck (player: Player): GameCards {
    let playerDeck: GameCards = [];
    let gid = 1;

    player.decks[player.deckId].cards.forEach((deckCard) => {
      const {id} = deckCard;
      const card = cards.find((card) => card.id === id);

      if (!card) { return; }

      playerDeck = this._push2Deck(playerDeck, gid, card);
      gid += 1;

      if (deckCard.amount > 1) {
        playerDeck = this._push2Deck(playerDeck, gid, card);
        gid += 1;
      }
    });

    for (let i = playerDeck.length - 1; i > 0; i--) {
      const j = randomInt(0, i + 1);
      const temp = playerDeck[i];
      playerDeck[i] = playerDeck[j];
      playerDeck[j] = temp;
    }

    return playerDeck;
  }

  private _generateGame (gameId: number, playerA: Player, playerB: Player): Game {
    let playerADeck = this._buildDeck(playerA);
    const playerAHand: GameCards = [];
    let playerBDeck = this._buildDeck(playerB);
    const playerBHand: GameCards = [];

    playerAHand.push(...playerADeck.slice(-5));
    playerBHand.push(...playerBDeck.slice(-5));

    playerADeck = playerADeck.slice(0, -5);
    playerBDeck = playerBDeck.slice(0, -5);

    return {
      gameId,
      currentPlayer: playerA.username,
      playerA: {
        username: playerA.username,
        hero: {
          id: 2, // should be deck.klass
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          effects: []
        },
        minion: {a: undefined, b: undefined, c: undefined, d: undefined},
        trap: undefined,
        hand: playerAHand,
        deck: playerADeck,
        graveyard: []
      },
      playerB: {
        username: playerB.username,
        hero: {
          id: 4, // should be deck.klass
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          effects: []
        },
        minion: {a: undefined, b: undefined, c: undefined, d: undefined},
        trap: undefined,
        hand: playerBHand,
        deck: playerBDeck,
        graveyard: []
      },
    };
  }

  public async startGame (playerA: string, playerB: string): Promise<void> {
    const {mongoService, socketService} = this._services;
    const {$games, $players} = mongoService;
    const {io, socket} = socketService;
    const gameId = randomInt(0, 1000000);
    const [upd1, upd2] = await Promise.all([
      $players.findOneAndUpdate({
        username: playerA
      }, {
        $set: {
          status: PlayerStatus.INGAME,
          gameId
        }
      }),
      $players.findOneAndUpdate({
        username: playerB
      }, {
        $set: {
          status: PlayerStatus.INGAME,
          gameId
        }
      })
    ]);

    if (!upd1.value || !upd2.value) { return; }

    const game = this._generateGame(gameId, upd1.value, upd2.value);
    const isInserted = await $games.insertOne(game);

    if (!isInserted.insertedId) { return; }

    const gamePlayerA = this.generateGameFE(game, upd1.value.username);
    const gamePlayerB = this.generateGameFE(game, upd2.value.username);

    socket.emit("startGame", {
      game: gamePlayerB
    });

    io.to(upd1.value.socketId).emit("startGame", {
      game: gamePlayerA
    });
  }

  public generateGameFE (game: Game, username: string): GameFE {
    const {gameId, currentPlayer, playerA, playerB} = game;

    return {
      gameId,
      currentPlayer,
      player: playerA.username === username ? {
        username: playerA.username,
        hero: playerA.hero,
        minion: playerA.minion,
        trap: playerA.trap,
        deck: playerA.deck,
        hand: playerA.hand,
        graveyard: playerA.graveyard
      } : {
        username: playerB.username,
        hero: playerB.hero,
        minion: playerB.minion,
        trap: playerB.trap,
        deck: playerB.deck,
        hand: playerB.hand,
        graveyard: playerB.graveyard
      },
      opponent: playerA.username === username ? {
        username: playerB.username,
        hero: playerB.hero,
        minion: playerB.minion,
        trap: playerB.trap,
        deck: playerB.deck.length,
        hand: playerB.hand.length,
        graveyard: playerB.graveyard
      } : {
        username: playerA.username,
        hero: playerA.hero,
        minion: playerA.minion,
        trap: playerA.trap,
        deck: playerA.deck.length,
        hand: playerA.hand.length,
        graveyard: playerA.graveyard
      }
    };
  }

  public async reloadGameState (game: Game): Promise<void> {
    const {mongoService, socketService} = this._services;
    const {$players} = mongoService;
    const {io} = socketService;
    const {playerA, playerB} = game;

    const [$playerA, $playerB] = await Promise.all([
      $players.findOne({
        username: playerA.username
      }),
      $players.findOne({
        username: playerB.username
      })
    ]);

    if (!$playerA || !$playerB) { return; }

    io.to($playerA.socketId).emit("reloadGameState", {
      game: this.generateGameFE(game, playerA.username)
    });
    io.to($playerB.socketId).emit("reloadGameState", {
      game: this.generateGameFE(game, playerB.username)
    });
  }

  public async drawCard (gameId: number, player: GamePlayer): Promise<void> {
    const {hand, deck} = player;
    const card = deck.pop();

    if (!card) {
      await this.endGame(gameId, "B");
      return;
    }

    hand.push(card);
  }
}
