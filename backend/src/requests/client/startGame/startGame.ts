import { PlayerStatus } from "../../../enums/index.js";
import type {Request} from "../../../models";
import type {StartGame} from "./startGame.models";

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

  if (!playerA || !playerB) { return; }

  let gid = 0;

  const playerADeck = [];
  let playerAHand = [];
  const playerBDeck = [];
  let playerBHand = [];

  for (let i = 0; i < playerA.decks[playerA.deckId].cards.length; i += 1) {
    let id = playerA.decks[playerA.deckId].cards[i].id;

    playerADeck.push({gid, id});
    gid += 1;

    if (playerA.decks[playerA.deckId].cards[i].amount > 1) {
      playerADeck.push({gid, id});
      gid += 1;
    }
  }
  for (let i = 0; i < playerB.decks[playerB.deckId].cards.length; i += 1) {
    let id = playerB.decks[playerB.deckId].cards[i].id;

    playerBDeck.push({gid, id});
    gid += 1;

    if (playerB.decks[playerB.deckId].cards[i].amount > 1) {
      playerBDeck.push({gid, id});
      gid += 1;
    }
  }

  playerAHand = [
    playerADeck[25],
    playerADeck[26],
    playerADeck[27],
    playerADeck[28],
    playerADeck[29],
  ];
  playerADeck.pop();
  playerADeck.pop();
  playerADeck.pop();
  playerADeck.pop();
  playerADeck.pop();

  playerBHand = [
    playerBDeck[25],
    playerBDeck[26],
    playerBDeck[27],
    playerBDeck[28],
    playerBDeck[29],
  ];
  playerBDeck.pop();
  playerBDeck.pop();
  playerBDeck.pop();
  playerBDeck.pop();
  playerBDeck.pop();

  const game = {
    gameId: lobby.lobbyId,
    playerA: {
      username: lobby.host.username,
      hero: {
        id: 2, // should be deck.klass
        health: 600,
        maxHealth: 600,
        mana: 100,
        maxMana: 100,
        passive: 25,
        passiveStacks: 0
      },
      fields: {
        magic: {gid: 0, id: 0},
        minionA: {gid: 0, id: 0},
        minionB: {gid: 0, id: 0},
        minionC: {gid: 0, id: 0},
        minionD: {gid: 0, id: 0},
        trap: {gid: 0, id: 0},
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
        passive: 25,
        passiveStacks: 0
      },
      fields: {
        magic: {gid: 0, id: 0},
        minionA: {gid: 0, id: 0},
        minionB: {gid: 0, id: 0},
        minionC: {gid: 0, id: 0},
        minionD: {gid: 0, id: 0},
        trap: {gid: 0, id: 0},
      },
      deck: playerBDeck,
      hand: playerBHand,
      graveyard: []
    },
  };

  const isInserted = await gameService.insert(game);

  if (!isInserted) { return; }

  ioService.emit("startGameSender", {game});

  const {username} = lobby.challengee;
  const challengee = await playerService.find({username});

  if (!challengee || !challengee.socketId) { return; }

  ioService.emitTo(challengee.socketId, "startGameReceiver", {game});
};

export default startGame;
