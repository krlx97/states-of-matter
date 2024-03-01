import {mongo} from "app";
import {gameHelpers} from "helpers/gameHelpers";
import {cards, cardsView} from "@som/shared/data";
import {CardKlass, CardType, PlayerStatus} from "@som/shared/enums";

import type {
  GameView,
  LobbyView,
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
  let leaderboards = await $leaderboards.findOne({});

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
  let lobbyView: LobbyView | undefined;
  let gameView: GameView | undefined;

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

  const friendsView: PlayerSocialFriendsView = [];
  let mutualFriends = [];

  for (const name of $player.friends) {
    const $friend = await $players.findOne({name});

    if ($friend) {
      if ($friend.friends.includes($player.name)) {
        mutualFriends.push(name);
      }

      const {avatarId, bannerId, experience, level, elo, status, games} = $friend;
      friendsView.push({name, avatarId, bannerId, experience, level, elo, status, games});
    }
  }

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
    decks: $player.decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      klass: deck.klass,
      cardsInDeck: deck.cards.reduce((acc, {amount}) => acc += amount, 0),
      average: {
        health: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (
            !card ||
            card.type === CardType.HERO ||
            card.type === CardType.MAGIC ||
            card.type === CardType.TRAP
          ) {
            return acc;
          }

          return acc += card.health * deckCard.amount;
        }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0,
        damage: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (
            !card ||
            card.type === CardType.HERO ||
            card.type === CardType.MAGIC ||
            card.type === CardType.TRAP
          ) {
            return acc;
          }

          return acc += card.damage * deckCard.amount;
        }, 0) / deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if ( !card || card.type !== CardType.MINION) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0) || 0,
        manaCost: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type === CardType.HERO) {
            return acc;
          }

          return acc += card.manaCost * deckCard.amount;
        }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0
      },
      attribute: {
        minion: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type !== CardType.MINION) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        magic: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type !== CardType.MAGIC) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        trap: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type !== CardType.TRAP) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        neutral: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.NEUTRAL) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        solid: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.SOLID) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        liquid: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.LIQUID) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        gas: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.GAS) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        plasma: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.PLASMA) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
      },
      cards: deck.cards.map((deckCard) => {
        const {id, amount} = deckCard;
        const card = cards.find((card): boolean => card.id === id);
        const cardView = cardsView.find((card): boolean => card.id === id);

        if (!card || !cardView || card.type === CardType.HERO) {
          return {id, name: "", type: 1, damage: 0, health: 0, manaCost: 0, amount: 1};
        }

        const {klass, type, manaCost} = card;
        const {name} = cardView;

        if (card.type === CardType.MINION) {
          const {health, damage} = card;
          return {id, name, klass, type, health, damage, manaCost, amount};
        } else {
          return {id, name, klass, type, manaCost, amount};
        }
      })
    })),
    skins: $player.skins,
    tutorial: $player.tutorial,
    tasks: $player.tasks,
    rewards: $player.rewards
  }

  const snapshots = await mongo.$supplySnapshots.find().toArray();

  return [{lobbyView, gameView, playerView, snapshots, leaderboards}, ""];
};

export {authenticate};
