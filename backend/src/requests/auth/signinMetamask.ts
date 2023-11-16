import {verifyMessage} from "ethers";
import {cards, cardsView} from "@som/shared/data";
import {CardType, PlayerStatus} from "@som/shared/enums";
import {mongo} from "app";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

import type {
  AccountView,
  GameView,
  LobbyView,
  PlayerView
} from "@som/shared/types/views";
import jwt from "jsonwebtoken";

const signinMetamask: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$accounts, $chats, $games, $lobbies, $players} = mongo;

  socket.on("signinMetamask", async (params) => {
    const {address, signature, rememberMe} = params;
    const acc = await $accounts.findOne({address});

    if (!acc) {
      return error("Account not found.");
    }

    const recoveredAddress = verifyMessage(`signin${acc.nonce}`, signature);

    if (recoveredAddress !== acc.address) {
      return error("Invalid signature.");
    }

    const $accountUpdate = await $accounts.updateOne({address}, {
      $set: {
        nonce: acc.nonce + 1
      }
    });

    if (!$accountUpdate.modifiedCount) {
      return error("Error updating account.");
    }

    let token: string | undefined;

    if (rememberMe) {
      token = jwt.sign({name: acc.name}, "som", {
        expiresIn: "30d"
      });
    }

    const $player = await $players.findOneAndUpdate({name: acc.name}, [{
      $set: {
        socketId,
        status: {
          $switch: {
            branches: [{
              case: {
                $gt: ["$lobbyId", 0]
              },
              then: PlayerStatus.IN_LOBBY
            }, {
              case: {
                $gt: ["$gameId", 0]
              },
              then: PlayerStatus.IN_GAME
            }],
            default: PlayerStatus.ONLINE
          }
        }
      }
    }], {
      returnDocument: "after"
    });

    if (!$player) {
      return error("Error updating player.");
    }

    const friendsView: Array<any> = [];

    for (const friendname of acc.social.friends) {
      const [friend, friendAcc, chat] = await Promise.all([
        $players.findOne({
          name: friendname
        }),
        $accounts.findOne({
          name: friendname
        }),
        $chats.findOne({
          players: {
            $all: [$player.name, friendname]
          }
        })
      ]);

      if (!friend || !friendAcc || !chat) { return; }

      const {status} = friend;
      const {messages} = chat;

      friendsView.push({name: friendname, status, avatarId: friendAcc?.avatarId, messages});
    }

    const {lobbyId, gameId} = $player;
    let lobbyView: LobbyView | undefined;
    let gameView: GameView | undefined;

    if (lobbyId) {
      const $lobby = await $lobbies.findOne({id: lobbyId});

      if (!$lobby) {
        return error("You are currently in a lobby that cannot be found. (Contact dev)");
      }

      const {id, host, challengee} = $lobby;
      lobbyView = {id, host, challengee};
    } else if (gameId) {
      const $game = await $games.findOne({id: gameId});

      if (!$game) {
        return error("You are currently in a game that cannot be found. (Contact dev)");
      }

      gameView = gameHelpers.generateGameView($game, $player.name);
    }

    const accountView: AccountView = {
      name: acc.name,
      address: acc.address,
      nonce: acc.nonce + 1,
      avatarId: acc.avatarId,
      bannerId: acc.bannerId,
      social: {
        friends: friendsView,
        requests: acc.social.requests,
        blocked: acc.social.blocked,
        chat: {
          name: "",
          status: 0,
          avatarId: 0,
          messages: [],
          isOpen: false
        }
      }
    };

    const playerView: PlayerView = {
      name: $player.name,
      experience: $player.experience,
      level: $player.level,
      elo: $player.elo,
      joinedAt: $player.joinedAt,
      status: $player.status,
      queueId: $player.queueId,
      deckId: $player.deckId,
      lobbyId: $player.lobbyId,
      gameId: $player.gameId,
      gamePopupId: $player.gamePopupId,
      games: $player.games,
      decks: $player.decks.map((deck) => ({
        id: deck.id,
        klass: deck.klass,
        name: deck.name,
        cardsInDeck: deck.cards.reduce((acc, {amount}) => acc += amount, 0),
        cards: deck.cards.map((deckCard) => {
          const card = cards.find((card) => deckCard.id === card.id);

          if (!card || card.type === CardType.HERO) {
            console.log("Card not found, deck invalid, hero can't be in deck...?");
            // this should never happen though...
            return {id: 0, name: "", amount: 0, manaCost: 0};
          }

          const cardView = cardsView.get(card.id);

          if (!cardView) {
            return {id: 0, name: "", amount: 0, manaCost: 0};
          }

          const {id, amount} = deckCard;
          const {manaCost} = card;
          const {name} = cardView;

          return {id, name, amount, manaCost};
        })
      })),
      skins: $player.skins,
      tutorial: $player.tutorial
    };

    socket.emit("signin", {
      accountView,
      gameView,
      lobbyView,
      playerView,
      token
    });
  });
};

export {signinMetamask};
