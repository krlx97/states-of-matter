import {PlayerStatus} from "@som/shared/enums";
import {findPlayer} from "apis/eos";
import {chatsDb, gamesDb, lobbiesDb, playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

// this needs refactoring...
const signin: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("signin", async (params) => {
    const {username, publicKey, signature} = params;
    let lobby, game;

    // const transaction = await blockchainService.transact("signin", {publicKey, signature});

    // if (!transaction) { return; }

    const $player = await playersDb.findOneAndUpdate({username}, [{
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

    const player$ = await findPlayer(username);

    if (!$player.value || !player$) { return; }

    const {wallet, nonce} = player$;
console.log(wallet);
    const {friends} = $player.value.social;
    const friendsView: Array<any> = [];

    for (const friendname of friends) {
      const [friend, chat] = await Promise.all([
        playersDb.findOne({
          username: friendname
        }),
        chatsDb.findOne({
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
      lobby = await lobbiesDb.findOne({lobbyId});

      if (!lobby) { return; }
    } else if (gameId) {
      game = await gamesDb.findOne({gameId});

      if (!game) { return; }

      if ($player.value.username === game.playerA.username) {
        gameView = {
          gameId: game.gameId,
          currentPlayer: game.currentPlayer,
          player: {
            ...game.playerA,
            // deck should be number so players can't cheat
            // deck: game.playerA.deck.length
            // but endTurn event needs refactor first
          },
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
      player: {...$player.value, wallet, nonce},
      friends: friendsView,
      lobby,
      game: gameView
    });
  });
};

export {signin};
