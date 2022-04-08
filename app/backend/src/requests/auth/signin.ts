import {PlayerStatus} from "@som/shared/enums";
import type {App} from "models";

// this needs refactoring...
export const signin = (app: App): void => {
  const {services} = app;
  const {eosService, mongoService, socketService} = services;
  const {$chats, $games, $lobbies, $players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("signin", async (params) => {
    const {username, publicKey, signature} = params;
    let lobby, game;

    // const transaction = await blockchainService.transact("signin", {publicKey, signature});

    // if (!transaction) { return; }

    const $player = await $players.findOneAndUpdate({username}, [{
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

    const player$ = await eosService.findPlayer(username);

    if (!$player.value || !player$) { return; }

    const {wallet, last_nonce} = player$;
    const {friends} = $player.value.social;
    const friendsView: Array<any> = [];

    for (const friendname of friends) {
      const [friend, chat] = await Promise.all([
        $players.findOne({
          username: friendname
        }),
        $chats.findOne({
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

    const {lobbyId, gameId} = $player.value;
    let gameView;

    if (lobbyId) {
      lobby = await $lobbies.findOne({lobbyId});

      if (!lobby) { return; }
    } else if (gameId) {
      game = await $games.findOne({gameId});

      if (!game) { return; }

      if ($player.value.username === game.playerA.username) {
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

    socket.emit("signin", {
      player: {...$player.value, wallet, last_nonce},
      friends: friendsView,
      lobby,
      game: gameView
    });
  });
};
