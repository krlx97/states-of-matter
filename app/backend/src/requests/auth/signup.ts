import {PlayerStatus} from "@som/shared/enums";
import type {SignupReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const signup: SocketRequest<SignupReq> = async (services, params) => {
  const {/*blockchainService, */playerService, socketService} = services;
  const {username, publicKey, privateKeyHash} = params;
  const player = await playerService.find({username});

  if (player) { return; }

  const [/*transaction, */isInserted] = await Promise.all([
    // blockchainService.transact("signup", {publicKey}),
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

  if (/*!transaction || */!isInserted) { return; }

  const msg = "Account created successfully, you can now sign in.";
  socketService.emit().notification({msg});
};

export default signup;
