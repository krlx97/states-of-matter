import {hash} from "bcrypt";
import {cards} from "@som/shared/data";
import {PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const signupPassword: SocketRequest = (socket, error): void => {
  const {$accounts, $players} = mongo;

  socket.on("signupPassword", async (params) => {
    const {name, password} = params;

    if (name.length < 3) {
      return error("Minimum 3 characters.");
    }

    if (name.length > 16) {
      return error("Maximum 16 characters.");
    }

    const $account = await $accounts.findOne({name});

    if ($account) {
      return error("Name taken.");
    }

    const passwordHash = await hash(password, 12);

    const [insertAccount, insertPlayer] = await Promise.all([
      $accounts.insertOne({
        name,
        passwordHash,
        address: "",
        nonce: 0,
        avatarId: 0,
        bannerId: 0,
        social: {
          friends: [],
          requests: [],
          blocked: []
        }
      }),
      $players.insertOne({
        socketId: "",
        name,
        experience: 0,
        level: 1,
        elo: 500,
        joinedAt: Date.now(),
        status: PlayerStatus.OFFLINE,
        queueId: QueueId.NONE,
        deckId: 0,
        lobbyId: 0,
        gameId: 0,
        gamePopupId: 0,
        games: {
          casual: {won: 0, lost: 0},
          ranked: {won: 0, lost: 0}
        },
        decks: [
          {id: 0, klass: 1, name: "Deck 1", cards: []},
          {id: 1, klass: 2, name: "Deck 2", cards: []},
          {id: 2, klass: 3, name: "Deck 3", cards: []},
          {id: 3, klass: 4, name: "Deck 4", cards: []}
        ],
        skins: cards.map((card) => ({cardId: card.id, skinId: 0})),
        tutorial: {
          deckBuilder: false,
          game: false,
          play: false,
          inventory: false
        }
      })
    ]);

    if (!insertAccount.insertedId) {
      if (insertPlayer.insertedId) {
        await $players.deleteOne({
          _id: insertPlayer.insertedId
        });
      }

      return error("Error creating account, please try again.");
    }

    if (!insertPlayer.insertedId) {
      if (insertAccount.insertedId) {
        await $accounts.deleteOne({
          _id: insertAccount.insertedId
        });
      }

      return error("Error creating player, please try again.");
    }

    socket.emit("notification", "Account created successfully.");
  });
};

export {signupPassword};
