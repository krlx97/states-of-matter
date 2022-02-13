import {PlayerStatus} from "@som/shared/enums";
import type {SigninReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const signin: SocketRequest<SigninReq> = async (services, params) => {
  const {
    blockchainService,
    chatService,
    gameService,
    lobbyService,
    playerService,
    socketService
  } = services;

  const {username, publicKey, signature} = params;
  let lobby;
  let game;

  // const transaction = await blockchainService.transact("signin", {publicKey, signature});

  // if (!transaction) { return; }

  const {socketId} = socketService;
  const player = await playerService.findAndUpdate({username}, [{
    $set: {
      socketId,
      status: {
        $switch: {
          branches: [{
            case: {
              $gt: ["$lobbyId", 0]
            },
            then: PlayerStatus.INLOBBY
          }, {
            case: {
              $gt: ["$gameId", 0]
            },
            then: PlayerStatus.INGAME
          }],
          default: PlayerStatus.ONLINE
        }
      }
    }
  }], {
    returnDocument: "after"
  });

  const playerOnchain = await blockchainService.findPlayer(username);

  if (!player || !playerOnchain) { return; }

  const {wallet, last_nonce} = playerOnchain;
  const {friends} = player.social;
  const friendsView: Array<any> = [];

  for (const friendname of friends) {
    const [friend, chat] = await Promise.all([
      playerService.find({
        username: friendname
      }),
      chatService.find({
        players: {
          $all: [username, friendname]
        }
      })
    ]);

    if (!friend || !chat) { return; }

    const {status, avatarId} = friend;
    const {messages} = chat;

    friendsView.push({username: friendname, status, avatarId, messages});
  }

  const {lobbyId, gameId} = player;

  let gameView;

  if (lobbyId) {
    lobby = await lobbyService.find({lobbyId});

    if (!lobby) { return; }
  } else if (gameId) {
    game = await gameService.find({gameId});

    if (!game) { return; }

    if (player.username === game.playerA.username) {
      gameView = {
        gameId: game.gameId,
        currentPlayer: game.currentPlayer,
        player: game.playerA,
        opponent: {
          ...game.playerB,
          deck: game.playerB.deck.length,
          hand: game.playerB.hand.length
        }
      };
    } else {
      gameView = {
        gameId: game.gameId,
        currentPlayer: game.currentPlayer,
        player: game.playerB,
        opponent: {
          ...game.playerA,
          deck: game.playerA.deck.length,
          hand: game.playerA.hand.length
        }
      };
    }
  }

  socketService.emit().signin({
    player: {...player, wallet, last_nonce},
    friends: friendsView,
    lobby,
    game: gameView
  });
};

export default signin;
