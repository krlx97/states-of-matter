import {randomInt} from "crypto";
import {cards} from "@som/shared/data";
import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";
import type {GamePlayerCard, Game} from "../../services/MongoService/GameService.models";

function shuffleArray (array: Array<GamePlayerCard>): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const startGame: SocketRequest = (services) => {
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
    let playerADeck: Array<GamePlayerCard> = [];
    const playerAHand: Array<GamePlayerCard> = [];
    let playerBDeck: Array<GamePlayerCard> = [];
    const playerBHand: Array<GamePlayerCard> = [];

    for (let i = 0; i < playerA.value.decks[playerA.value.deckId].cards.length; i += 1) {
      let id = playerA.value.decks[playerA.value.deckId].cards[i].id;
      const card = cards.find((card) => card.id === id);

      if (!card) return;

      if (card.health) {
        playerADeck.push({gid, ...card, maxHealth: card.health});
      } else {
        playerADeck.push({gid, ...card});
      }

      gid += 1;

      if (playerA.value.decks[playerA.value.deckId].cards[i].amount > 1) {
        if (card.health) {
          playerADeck.push({gid, ...card, maxHealth: card.health});
        } else {
          playerADeck.push({gid, ...card});
        }

        gid += 1;
      }
    }

    for (let i = 0; i < playerB.value.decks[playerB.value.deckId].cards.length; i += 1) {
      let id = playerB.value.decks[playerB.value.deckId].cards[i].id;
      const card = cards.find((card) => card.id === id);

      if (!card) return;

      if (card.health) {
        playerBDeck.push({gid, ...card, maxHealth: card.health});
      } else {
        playerBDeck.push({gid, ...card});
      }

      gid += 1;

      if (playerB.value.decks[playerB.value.deckId].cards[i].amount > 1) {
        if (card.health) {
          playerBDeck.push({gid, ...card, maxHealth: card.health});
        } else {
          playerBDeck.push({gid, ...card});
        }

        gid += 1;
      }
    }

    // playerB.decks[playerB.deckId].cards.
    shuffleArray(playerADeck)
    shuffleArray(playerBDeck)

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
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          damage: 30,
          passive: 25
        },
        fields: {
          magic: undefined,
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          trap: undefined,
        },
        deck: playerADeck,
        hand: playerAHand,
        graveyard: []
      },
      playerB: {
        username: $lobby.challengee.username,
        hero: {
          id: 4, // should be deck.klass
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          damage: 20,
          passive: 25
        },
        fields: {
          magic: undefined,
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          trap: undefined,
        },
        deck: playerBDeck,
        hand: playerBHand,
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
        hero: {
          id: 2, // should be deck.klass
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          damage: 30,
          passive: 25
        },
        fields: {
          magic: undefined,
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          trap: undefined
        },
        deck: playerADeck,
        hand: playerAHand,
        graveyard: []
      },
      opponent: {
        username: $lobby.challengee.username,
        hero: {
          id: 4, // should be deck.klass
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          damage: 20,
          passive: 25
        },
        fields: {
          magic: undefined,
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          trap: undefined
        },
        deck: playerBDeck.length,
        hand: playerBHand.length,
        graveyard: []
      }
    };

    const gameReceiver = {
      gameId: $lobby.lobbyId,
      currentPlayer: $lobby.host.username,
      player: {
        username: $lobby.challengee.username,
        hero: {
          id: 4, // should be deck.klass
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          damage: 20,
          passive: 25
        },
        fields: {
          magic: undefined,
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          trap: undefined,
        },
        deck: playerBDeck,
        hand: playerBHand,
        graveyard: []
      },
      opponent: {
        username: $lobby.host.username,
        hero: {
          id: 2, // should be deck.klass
          health: 600,
          maxHealth: 600,
          mana: 100,
          maxMana: 100,
          damage: 30,
          passive: 25
        },
        fields: {
          magic: undefined,
          minionA: undefined,
          minionB: undefined,
          minionC: undefined,
          minionD: undefined,
          trap: undefined,
        },
        deck: playerADeck.length,
        hand: playerAHand.length,
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
