import {PlayerStatus} from "@som/shared/enums";
import {leap} from "apis/eos";
import {accountsDb, playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const signup: SocketEvent = (socket): void => {
  socket.on("signup", async (params) => {
    const {name, publicKey, privateKeyHash} = params;
    const $account = await accountsDb.findOne({name});

    if ($account) {
      socket.emit("notification", "Username taken.");
      return;
    }

    const promises = await Promise.all([
      leap.transact({
        contract: "eternisvm131",
        permission: "active",
        action: "signup",
        data: {name, publicKey}
      }),
      leap.transact({
        contract: "eternisom141",
        permission: "active",
        action: "signin",
        data: {name, signature: "SIG_K1_K3qcmTeUz4sGZjaKVEpHsniCoCmubWXUCUEYTpUkvV9XnoXpn2LA7v8PxsigK8U9oERcboFYQrwqcfseWpm5scuy9cKJyC"}
      }),
      accountsDb.insertOne({
        name,
        privateKeyHash,
        social: {
          friends: [],
          requests: [],
          blocked: []
        }
      }),
      playersDb.insertOne({
        socketId: "",
        name,
        status: PlayerStatus.OFFLINE,
        xp: 0,
        lv: 1,
        deckId: 0,
        lobbyId: 0,
        gameId: 0,
        decks: [
          {id: 0, klass: 1, name: "Deck 1", cards: []},
          {id: 1, klass: 2, name: "Deck 2", cards: []},
          {id: 2, klass: 3, name: "Deck 3", cards: []},
          {id: 3, klass: 4, name: "Deck 4", cards: []}
        ],
        games: {
          casual: {won: 0, lost: 0},
          ranked: {won: 0, lost: 0, elo: 1000}
        }
      })
    ]);

    const [transaction, transaction2, insertAccount, insertPlayer] = promises;

    if (!transaction || !transaction2 || !insertAccount.insertedId || !insertPlayer.insertedId) {
      socket.emit("notification", "Error creating account.");
      return;
      // clear successfull inserts to avoid bugs.
    }

    socket.emit("notification", "Account created successfully.");
  });
};

export {signup};
