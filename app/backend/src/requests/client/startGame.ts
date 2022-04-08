import {cards} from "@som/shared/data";
import { GameMagic, GameMinion, GameTrap } from "@som/shared/dist/interfaces/mongo/Game";
import {CardKlass, CardType, PlayerStatus} from "@som/shared/enums";
import type {Game, GameCards} from "@som/shared/interfaces/mongo";
import type {App} from "models";

export const startGame = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $lobbies, $players} = mongoService;
  const {io, socket} = socketService;

  socket.on("startGame", async (params) => {
    const {lobbyId} = params;
    const $lobby = await $lobbies.findOne({lobbyId});
    const $deleteLobby = await $lobbies.deleteOne({lobbyId});

    if (!$lobby || !$deleteLobby.deletedCount) { return; }

    const [playerA, playerB] = await Promise.all([
      $players.findOneAndUpdate({
        username: $lobby.host.username
      }, {
        $set: {
          lobbyId: 0,
          gameId: lobbyId,
          status: PlayerStatus.INGAME
        }
      }, {
        returnDocument: "after"
      }),
      $players.findOneAndUpdate({
        username: $lobby.challengee.username
      }, {
        $set: {
          lobbyId: 0,
          gameId: lobbyId,
          status: PlayerStatus.INGAME
        }
      }, {
        returnDocument: "after"
      })
    ]);

    if (!playerA.value || !playerB.value) return;

    let gid = 1;
    let playerADeck: GameCards = [];
    const playerAHand: GameCards = [];
    let playerBDeck: GameCards = [];
    const playerBHand: GameCards = [];

    for (let i = 0; i < playerA.value.decks[playerA.value.deckId].cards.length; i += 1) {
      let id = playerA.value.decks[playerA.value.deckId].cards[i].id;
      const card = cards.find((card) => card.id === id);

      if (!card) return;

      if (card.health) {
        playerADeck.push({gid, ...card, maxHealth: card.health, hasAttacked: false, hasTriggeredEffect: false} as GameMinion);
      } else {
        playerADeck.push({gid, ...card} as any);
      }

      gid += 1;

      if (playerA.value.decks[playerA.value.deckId].cards[i].amount > 1) {
        if (card.health) {
          playerADeck.push({gid, ...card, maxHealth: card.health, hasAttacked: false, hasTriggeredEffect: false} as GameMinion);
        } else {
          playerADeck.push({gid, ...card} as any);
        }

        gid += 1;
      }
    }

    for (let i = 0; i < playerB.value.decks[playerB.value.deckId].cards.length; i += 1) {
      let id = playerB.value.decks[playerB.value.deckId].cards[i].id;
      const card = cards.find((card) => card.id === id);

      if (!card) return;

      if (card.health) {
        playerADeck.push({gid, ...card, maxHealth: card.health, hasAttacked: false, hasTriggeredEffect: false} as GameMinion);
      } else {
        playerBDeck.push({gid, ...card} as any);
      }

      gid += 1;

      if (playerB.value.decks[playerB.value.deckId].cards[i].amount > 1) {
        if (card.health) {
          playerADeck.push({gid, ...card, maxHealth: card.health, hasAttacked: false, hasTriggeredEffect: false} as GameMinion);
        } else {
          playerBDeck.push({gid, ...card} as any);
        }

        gid += 1;
      }
    }

    gameController.shuffleDeck(playerADeck);
    gameController.shuffleDeck(playerBDeck);

    playerAHand.push(...playerADeck.slice(-5));
    playerBHand.push(...playerBDeck.slice(-5));

    playerADeck = playerADeck.slice(0, -5);
    playerBDeck = playerBDeck.slice(0, -5);

    const game: Game = {
      gameId: $lobby.lobbyId,
      currentPlayer: $lobby.host.username,
      playerA: {
        username: $lobby.host.username,
        hero: {
          id: 2, // should be deck.klass
          type: CardType.HERO,
          klass: CardKlass.LIQUID,
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          effects: []
        },
        minion: {
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
        },
        trap: undefined,
        hand: playerAHand,
        deck: playerADeck,
        graveyard: []
      },
      playerB: {
        username: $lobby.challengee.username,
        hero: {
          id: 4, // should be deck.klass
          type: CardType.HERO,
          klass: CardKlass.PLASMA,
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

    const isInserted = await $games.insertOne(game);

    if (!isInserted.insertedId) { return; }

    const gameSender = {
      gameId: $lobby.lobbyId,
      currentPlayer: $lobby.host.username,
      player: {
        username: $lobby.host.username,
        fields: {
          hero: {
            id: 2, // should be deck.klass
            type: CardType.HERO,
            health: 600,
            maxHealth: 600,
            mana: 100,
            maxMana: 100
          },
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          minionE: undefined,
          minionF: undefined,
          magic: undefined,
          trap: undefined
        },
        hand: playerAHand,
        deck: playerADeck,
        graveyard: []
      },
      opponent: {
        username: $lobby.challengee.username,
        fields: {
          hero: {
            id: 4, // should be deck.klass
            type: CardType.HERO,
            health: 600,
            maxHealth: 600,
            mana: 100,
            maxMana: 100
          },
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          minionE: undefined,
          minionF: undefined,
          magic: undefined,
          trap: undefined
        },
        hand: playerBHand.length,
        deck: playerBDeck.length,
        graveyard: []
      }
    };

    const gameReceiver = {
      gameId: $lobby.lobbyId,
      currentPlayer: $lobby.host.username,
      player: {
        username: $lobby.challengee.username,
        fields: {
          hero: {
            id: 4, // should be deck.klass
            type: CardType.HERO,
            health: 600,
            maxHealth: 600,
            mana: 100,
            maxMana: 100,
            damage: 20,
            passive: 25
          },
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          minionE: undefined,
          minionF: undefined,
          magic: undefined,
          trap: undefined,
        },
        hand: playerBHand,
        deck: playerBDeck,
        graveyard: []
      },
      opponent: {
        username: $lobby.host.username,
        fields: {
          hero: {
            id: 2, // should be deck.klass
            type: CardType.HERO,
            health: 600,
            maxHealth: 600,
            mana: 100,
            maxMana: 100,
            damage: 30,
            passive: 25
          },
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          minionE: undefined,
          minionF: undefined,
          magic: undefined,
          trap: undefined,
        },
        hand: playerAHand.length,
        deck: playerADeck.length,
        graveyard: []
      }
    };

    socket.emit("startGame", {game: gameSender});

    const {username} = $lobby.challengee;
    const challengee = await $players.findOne({username});

    if (!challengee || !challengee.socketId) { return; }

    io.to(challengee.socketId).emit("startGame", {game: gameReceiver});
  });
};
