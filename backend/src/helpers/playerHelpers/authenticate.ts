import {mongo} from "app";
import {gameHelpers} from "helpers/gameHelpers";
import {cards, cardsView} from "@som/shared/data";
import {CardKlass, CardType, PlayerStatus} from "@som/shared/enums";
import type {PlayerDeck} from "@som/shared/types/mongo";

import type {
  GameView,
  LobbyView,
  PlayerDeckCardView,
  PlayerDeckView,
  PlayerSocialFriendsView,
  PlayerView
} from "@som/shared/types/views";

interface AuthData {
  gameView: GameView | undefined;
  lobbyView: LobbyView | undefined;
  playerView: PlayerView;
}

const authenticate = async (
  socketId: string,
  name: string
): Promise<[AuthData | undefined, string]> => {
  const {$games, $lobbies, $players, $leaderboards} = mongo;
  const friendsView: PlayerSocialFriendsView = [];
  let leaderboards = await $leaderboards.findOne({});
  let lobbyView: LobbyView | undefined;
  let gameView: GameView | undefined;
  let mutualFriends = [];

  if (!leaderboards) {
    leaderboards = {level: [], elo: []};
  }

  const $player = await $players.findOneAndUpdate({name}, [{
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
    return [undefined, "Error updating player."];
  }

  const {lobbyId, gameId} = $player;

  if (lobbyId) {
    const id = lobbyId;
    const $lobby = await $lobbies.findOne({id});

    if (!$lobby) {
      return [undefined, "You are currently in a lobby that cannot be found."];
    }

    const {host, challengee, messages} = $lobby;
    lobbyView = {id, host, challengee, messages};
  }

  if (gameId) {
    const id = gameId;
    const $game = await $games.findOne({id});

    if (!$game) {
      return [undefined, "You are currently in a game that cannot be found."];
    }

    gameView = gameHelpers.generateGameView($game, $player.name);
  }

  for (const name of $player.friends) {
    const $friend = await $players.findOne({name});

    if (!$friend) {
      continue;
    }

    if ($friend.friends.includes($player.name)) {
      mutualFriends.push(name);
    }

    const {avatarId, bannerId, experience, level, elo, status, games} = $friend;
    friendsView.push({name, avatarId, bannerId, experience, level, elo, status, games});
  }

  const gen = (deck: Array<PlayerDeckCardView>, attr: "health" | "damage" | "manaCost"): number => {
    let totalCards: number
    let totalAttr: number;

    if (attr === "health" || attr === "damage") {
      totalAttr = deck.reduce((acc, deckCard) => {
        if (deckCard.type !== CardType.MINION) {
          return acc;
        } else {
          return acc += deckCard[attr] * deckCard.amount;
        }
      }, 0);

      totalCards = deck.reduce((acc, deckCard) => {
        if (deckCard.type !== CardType.MINION) {
          return acc;
        } else {
          return acc += deckCard.amount;
        }
      }, 0);
    } else {
      totalAttr = deck.reduce((acc, deckCard) => {
        return acc += deckCard[attr] * deckCard.amount;
      }, 0);
      totalCards = deck.reduce((acc, deckCard) => acc += deckCard.amount, 0);
    }

    return totalAttr / totalCards;
  };

  const totalType = (
    deckCardsView: Array<PlayerDeckCardView>,
    type: CardType
  ) => deckCardsView.reduce(
    (acc, deckCard) => deckCard.type !== type ? acc : acc += deckCard.amount
  , 0);

  const totalKlass = (
    deckCardsView: Array<PlayerDeckCardView>,
    klass: CardKlass
  ) => deckCardsView.reduce(
    (acc, deckCard) => deckCard.klass !== klass ? acc : acc += deckCard.amount
  , 0);

  const genDeckCardsView = (deck: PlayerDeck): Array<PlayerDeckCardView> => {
    const mapp = deck.cards.map((deckCard) => {
      const {id, amount} = deckCard;
      const card = cards.find((card): boolean => card.id === id);
      const cardView = cardsView.find((card): boolean => card.id === id);

      if (!card || !cardView || card.type === CardType.HERO) {
        return {id, name: "", klass: 0, type: CardType.MINION, damage: 0, health: 0, manaCost: 0, amount: 1};
      }

      const {name} = cardView;

      if (card.type === CardType.MINION) {
        const {health, damage, klass, type, manaCost} = card;
        return {id, name, klass, type, health, damage, manaCost, amount};
      } else {
        const {klass, type, manaCost} = card;
        return {id, name, klass, type, manaCost, amount};
      }
    });

    return mapp;
  };

  const playerView: PlayerView = {
    name: $player.name,
    address: $player.address,
    nonce: $player.nonce,
    avatarId: $player.avatarId,
    bannerId: $player.bannerId,
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
    friends: friendsView,
    mutualFriends,
    games: $player.games,
    decks: $player.decks.map((deck) => {
      const deckCardsView = genDeckCardsView(deck);

      return {
        id: deck.id,
        name: deck.name,
        klass: deck.klass,
        cardsInDeck: deck.cards.reduce((acc, {amount}) => acc += amount, 0),
        average: {
          health: gen(deckCardsView, "health"),
          damage: gen(deckCardsView, "damage"),
          manaCost: gen(deckCardsView, "manaCost")
        },
        attribute: {
          minion: totalType(deckCardsView, CardType.MINION),
          magic: totalType(deckCardsView, CardType.MAGIC),
          trap: totalType(deckCardsView, CardType.TRAP),
          neutral: totalKlass(deckCardsView, CardKlass.NEUTRAL),
          solid: totalKlass(deckCardsView, CardKlass.SOLID),
          liquid: totalKlass(deckCardsView, CardKlass.LIQUID),
          gas: totalKlass(deckCardsView, CardKlass.GAS),
          plasma: totalKlass(deckCardsView, CardKlass.PLASMA)
        },
        cards: deckCardsView
      }
    }),
    skins: $player.skins,
    tutorial: $player.tutorial,
    tasks: $player.tasks,
    rewards: $player.rewards
  }

  const snapshots = await mongo.$supplySnapshots.find().toArray();

  return [{lobbyView, gameView, playerView, snapshots, leaderboards}, ""];
};

export {authenticate};
