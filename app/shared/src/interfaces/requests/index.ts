// Global
interface SendChatMsg {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}
// -------------------- AUTH --------------------
interface GetPrivateKeyHash {
  username: string;
}
interface Signin {
  username: string;
  publicKey: string;
  signature: string;
}
interface Signup {
  username: string;
  publicKey: string;
  privateKeyHash: string;
}
// -------------------- CLIENT --------------------
interface JoinLobby {
  lobbyId: number;
}
interface SaveDeck {
  cards: Array<any>;
}
interface SelectDeck {
  deckId: number;
}
interface SendToken {

}
interface SetDeckKlass {
  deckId: number;
  klass: number;
}
interface SetDeckName {
  id: number;
  name: string;
}
interface StartGame {
  lobbyId: number;
}
// -------------------- GAME --------------------
interface attackMinionWithMinion {
  attacker: "a" | "b" | "c" | "d";
  attacked: "a" | "b" | "c" | "d";
}
interface AttackCard {
  attacker: "a" | "b" | "c" | "d";
  attacked: "a" | "b" | "c" | "d" | "hero";
}
interface AttackMinion {
  attacker: "a" | "b" | "c" | "d";
  attacked: "a" | "b" | "c" | "d";
}
interface AttackHero {
  attacker: "a" | "b" | "c" | "d";
}
interface PlayCard {
  field: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap";
  gid: number;
  id?: number;
}
interface HoverCard {
  field: string;
}
// -------------------- SIDENAV --------------------
interface AcceptFriend {
  username: string;
}
interface AddFriend {
  username: string;
}
interface Block {
  username: string;
}
interface DeclineFriend {
  username: string;
}
interface SetAvatar {
  avatarId: number;
}
interface Unblock {
  username: string;
}
interface Unfriend {
  username: string;
}

type Callback<Params> = (params: Params) => Promise<void>;

export interface SocketRequests {
  // Global
  sendChatMsg: Callback<SendChatMsg>;
  updateStatus: () => Promise<void>;
  // Auth
  getPrivateKeyHash: Callback<GetPrivateKeyHash>;
  signin: Callback<Signin>;
  signup: Callback<Signup>;
  // Client
  destroyLobby: () => Promise<void>;
  joinLobby: Callback<JoinLobby>;
  leaveLobby: () => Promise<void>;
  makeLobby: () => Promise<void>;
  saveDeck: Callback<SaveDeck>;
  selectDeck: Callback<SelectDeck>;
  sendToken: Callback<SendToken>;
  setDeckKlass: Callback<SetDeckKlass>;
  setDeckName: Callback<SetDeckName>;
  startGame: Callback<StartGame>;
  // Game
  attackMinionWithMinion: Callback<attackMinionWithMinion>;
  attackCard: Callback<AttackCard>;
  attackMinion: Callback<AttackMinion>;
  attackHero: Callback<AttackHero>;
  endTurn: () => Promise<void>;
  hoverCard: Callback<HoverCard>;
  playCard: Callback<PlayCard>;
  unhoverCard: () => Promise<void>;
  // Sidenav
  acceptFriend: Callback<AcceptFriend>;
  addFriend: Callback<AddFriend>;
  block: Callback<Block>;
  declineFriend: Callback<DeclineFriend>;
  setAvatar: Callback<SetAvatar>;
  unblock: Callback<Unblock>;
  unfriend: Callback<Unfriend>;
}
























/**
 * BELOW TYPES SHOULD BE DELETED BUT ONLY AFTER FRONTEND REFACTOR
 */
interface GetPrivateKeyHashReq {
  username: string;
}
interface SigninReq {
  username: string;
  publicKey: string;
  signature: string;
}
interface SignupReq {
  username: string;
  publicKey: string;
  privateKeyHash: string;
}
// -------------------- CLIENT --------------------
interface JoinLobbyReq {
  lobbyId: number;
}
interface SaveDeckReq {
  cards: Array<any>;
}
interface SelectDeckReq {
  deckId: number;
}
interface SetDeckKlassReq {
  deckId: number;
  klass: number;
}
interface SetDeckNameReq {
  id: number;
  name: string;
}
interface StartGameReq {
  lobbyId: number;
}
// -------------------- GAME --------------------
interface AttackCardReq {
  attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
  attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}
interface PlayCardReq {
  field: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap";
  gid: number;
  id?: number;
}
interface HoverCardReq {
  field: string;
}
// -------------------- SIDENAV --------------------
interface AcceptFriendReq {
  username: string;
}
interface AddFriendReq {
  username: string;
}
interface BlockReq {
  username: string;
}
interface DeclineFriendReq {
  username: string;
}
interface SetAvatarReq {
  avatarId: number;
}
interface UnblockReq {
  username: string;
}
interface UnfriendReq {
  username: string;
}
// -------------------- GLOBAL --------------------
interface SendChatMsgReq {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}

export type {
  // AUTH
  GetPrivateKeyHashReq,
  SigninReq,
  SignupReq,
  // CLIENT
  JoinLobbyReq,
  SaveDeckReq,
  SelectDeckReq,
  SetDeckKlassReq,
  SetDeckNameReq,
  StartGameReq,
  // GAME
  AttackCardReq,
  PlayCardReq,
  HoverCardReq,
  // SIDENAV
  AcceptFriendReq,
  AddFriendReq,
  BlockReq,
  DeclineFriendReq,
  SetAvatarReq,
  UnblockReq,
  UnfriendReq,
  // GLOBAL
  SendChatMsgReq
};
