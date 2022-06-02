import {PlayerStatus} from "@som/shared/enums";
import {transact} from "apis/eos";
import {playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const signup: SocketEvent = (socket): void => {
  socket.on("signup", async (params) => {
    const {username, publicKey, privateKeyHash} = params;
    const player = await playersDb.findOne({username});

    if (player) {
      socket.emit("notification", "Username taken.");
      return;
    }

    const [transaction, insertPlayer] = await Promise.all([
      transact("signup", {
        username,
        public_key: publicKey
      }),
      playersDb.insertOne({
        socketId: "",
        username,
        publicKey,
        privateKeyHash,
        status: PlayerStatus.OFFLINE,
        xp: 0,
        lv: 1,
        deckId: 0,
        avatarId: 0,
        lobbyId: 0,
        gameId: 0,
        games: {
          casual: {won: 0, lost: 0},
          ranked: {won: 0, lost: 0, elo: 1000}
        },
        decks: [
          {id: 0, klass: 1, name: "Deck 1", cards: []},
          {id: 1, klass: 2, name: "Deck 2", cards: []},
          {id: 2, klass: 3, name: "Deck 3", cards: []},
          {id: 3, klass: 4, name: "Deck 4", cards: []}
        ],
        social: {
          friends: [],
          requests: [],
          blocked: []
        }
      })
    ]);

    if (!transaction || !insertPlayer.insertedId) {
      socket.emit("notification", "Error creating account.");
      return;
      // if signup fails on-chain, should we check whether it passed off-chain
      // and remove the document from mongodb?
    }

    socket.emit("notification", "Account created successfully.");
  });
};

export {signup};
