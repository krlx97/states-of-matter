import { PlayerStatus } from "../../../enums/index.js";
import cards from "../../../data/cards.js";
import type {Request} from "../../../models";
import type {StartGame} from "./startGame.models";
import type {GamePlayerCard, Game} from "../../../services/GameService/GameService.models";

const startGame: Request<StartGame> = async (services, params) => {
  const {gameService, ioService, lobbyService, playerService} = services;
  const {lobbyId} = params;

  const lobby = await lobbyService.find({lobbyId});
  const isDeleted = await lobbyService.delete({lobbyId});

  if (!lobby || !isDeleted) { return; }

  const [playerA, playerB] = await Promise.all([
    playerService.findAndUpdate({username: lobby.host.username}, {
      $set: {
        lobbyId: 0,
        gameId: lobbyId,
        status: PlayerStatus.INGAME
      }
    }, {returnDocument: "after"}),
    playerService.findAndUpdate({username: lobby.challengee.username}, {
      $set: {
        lobbyId: 0,
        gameId: lobbyId,
        status: PlayerStatus.INGAME
      }
    }, {returnDocument: "after"})
  ]);

  if (!playerA || !playerB) return;

  let gid = 1;
  let playerADeck: Array<GamePlayerCard> = [];
  const playerAHand: Array<GamePlayerCard> = [];
  let playerBDeck: Array<GamePlayerCard> = [];
  const playerBHand: Array<GamePlayerCard> = [];

  for (let i = 0; i < playerA.decks[playerA.deckId].cards.length; i += 1) {
    let id = playerA.decks[playerA.deckId].cards[i].id;

    const card = cards.find((card) => card.id === id);

    if (!card) return;

    if (card.health) {
      playerADeck.push({gid, ...card, maxHealth: card.health});
    } else {
      playerADeck.push({gid, ...card});
    }

    gid += 1;

    if (playerA.decks[playerA.deckId].cards[i].amount > 1) {
      if (card.health) {
        playerADeck.push({gid, ...card, maxHealth: card.health});
      } else {
        playerADeck.push({gid, ...card});
      }

      gid += 1;
    }
  }

  for (let i = 0; i < playerB.decks[playerB.deckId].cards.length; i += 1) {
    let id = playerB.decks[playerB.deckId].cards[i].id;
    const card = cards.find((card) => card.id === id);

    if (!card) return;

    if (card.health) {
      playerBDeck.push({gid, ...card, maxHealth: card.health});
    } else {
      playerBDeck.push({gid, ...card});
    }

    gid += 1;

    if (playerB.decks[playerB.deckId].cards[i].amount > 1) {
      if (card.health) {
        playerBDeck.push({gid, ...card, maxHealth: card.health});
      } else {
        playerBDeck.push({gid, ...card});
      }

      gid += 1;
    }
  }

  playerAHand.push(...playerADeck.slice(-5));
  playerBHand.push(...playerBDeck.slice(-5));

  playerADeck = playerADeck.slice(0, -5);
  playerBDeck = playerBDeck.slice(0, -5);

  const game: Game = {
    gameId: lobby.lobbyId,
    playerA: {
      username: lobby.host.username,
      hero: {
        id: 2, // should be deck.klass
        health: 600,
        maxHealth: 600,
        mana: 100,
        maxMana: 100,
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
      username: lobby.challengee.username,
      hero: {
        id: 4, // should be deck.klass
        health: 600,
        maxHealth: 600,
        mana: 100,
        maxMana: 100,
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

  const isInserted = await gameService.insert(game);

  if (!isInserted) { return; }

  const gameSender = {
    gameId: lobby.lobbyId,
    player: {
      username: lobby.host.username,
      hero: {
        id: 2, // should be deck.klass
        health: 600,
        maxHealth: 600,
        mana: 100,
        maxMana: 100,
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
      username: lobby.challengee.username,
      hero: {
        id: 4, // should be deck.klass
        health: 600,
        maxHealth: 600,
        mana: 100,
        maxMana: 100,
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
    gameId: lobby.lobbyId,
    player: {
      username: lobby.challengee.username,
      hero: {
        id: 4, // should be deck.klass
        health: 600,
        maxHealth: 600,
        mana: 100,
        maxMana: 100,
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
      username: lobby.host.username,
      hero: {
        id: 2, // should be deck.klass
        health: 600,
        maxHealth: 600,
        mana: 100,
        maxMana: 100,
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

  ioService.emit("startGameSender", {
    game: gameSender
  });

  const {username} = lobby.challengee;
  const challengee = await playerService.find({username});

  if (!challengee || !challengee.socketId) { return; }

  ioService.emitTo(challengee.socketId, "startGameReceiver", {
    game: gameReceiver
  });
};

export default startGame;
