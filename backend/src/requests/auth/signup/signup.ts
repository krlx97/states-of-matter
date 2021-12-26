import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models/index.js";
import type {Signup} from "./signup.models";

const signup: Request<Signup> = async (services, params) => {
  const {blockchainService, ioService, playerService} = services;
  const {username, publicKey, privateKeyHash} = params;

  const player = await playerService.find({username});
  if (player) return;

  const [transaction, isInserted] = await Promise.all([
    blockchainService.transact("signup", {publicKey}),
    playerService.insert({
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
      decks: [
        {id: 0, klass: 1, name: "Deck 1", cards: []},
        {id: 1, klass: 2, name: "Deck 2", cards: []},
        {id: 2, klass: 3, name: "Deck 3", cards: []},
        {id: 3, klass: 4, name: "Deck 4", cards: []}
      ],
      social: {friends: [], requests: [], blocked: []}
    })
  ]);

  if (!transaction || !isInserted) { return; }

  ioService.notification("Account created successfully, you can now sign in.");
};

export default signup;
