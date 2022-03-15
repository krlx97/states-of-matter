interface UpdateFriend {
  username: string;
  status: number;
}

interface Notification {
  msg: string;
}

interface SendChatMsgReceiver {
  sender: string;
  text: string;
  date: Date;
}

interface SendChatMsgSender {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}
// -------------------- AUTH --------------------
interface GetPrivateKeyHash {
  privateKeyHash: string;
}

interface Signin {
  player: any;
  friends: any[];
  lobby: any | undefined;
  game: any | undefined;
}
// -------------------- CLIENT --------------------
interface JoinLobbyReceiver {
  challengee: any;
}

interface JoinLobbySender {
  lobby: any;
}

interface MakeLobby {
  lobby: any;
}

interface SaveDeck {
  cards: Array<any>;
}

interface SelectDeck {
  deckId: number;
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
  game: any;
}
//
interface AttackCardReceiver {
  attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
  attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}

interface AttackCardSender {
  attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
  attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}

interface HoverCard {
  field: string;
}

interface PlayCardReceiver {
  field: string;
  card: any;
}

interface PlayCardSender {
  field: string;
  gid: number;
}
// -------------------- SIDENAV --------------------
interface AcceptFriendReceiver {
  username: string;
  avatarId: number;
  status: number;
}

interface AcceptFriendSender {
  username: string;
  avatarId: number;
  status: number;
}

interface AddFriend {
  username: string;
}

interface BlockReceiver {
  username: string;
}

interface BlockSender {
  username: string;
}

interface DeclineFriend {
  username: string;
}

interface SetAvatarReceiver {
  username: string;
  avatarId: number;
}

interface SetAvatarSender {
  avatarId: number;
}

interface Unblock {
  friendname: string;
}

interface UnfriendReceiver {
  username: string;
}

interface UnfriendSender {
  username: string;
}

interface UpdateFriend {
  username: string;
  status: number;
}

type Callback<Params> = (params: Params) => Promise<void>;

export interface SocketResponses {
  // Global
  notification: Callback<string>;
  updateStatus: Callback<UpdateFriend>;
  sendChatMsgReceiver: Callback<SendChatMsgReceiver>;
  sendChatMsgSender: Callback<SendChatMsgSender>;
  // Auth
  getPrivateKeyHash: Callback<GetPrivateKeyHash>;
  signin: Callback<Signin>;
  // Client
  destroyLobby: () => Promise<void>;
  joinLobbyReceiver: Callback<JoinLobbyReceiver>;
  joinLobbySender: Callback<JoinLobbySender>;
  leaveLobbyReceiver: () => Promise<void>;
  leaveLobbySender: () => Promise<void>;
  makeLobby: Callback<MakeLobby>;
  saveDeck: Callback<SaveDeck>;
  selectDeck: Callback<SelectDeck>;
  setDeckKlass: Callback<SetDeckKlass>;
  setDeckName: Callback<SetDeckName>;
  startGame: Callback<StartGame>;
  // Game
  endGame: () => Promise<void>;
  attackCardReceiver: Callback<AttackCardReceiver>;
  attackCardSender: Callback<AttackCardSender>;
  endTurnPlayer: () => Promise<void>;
  endTurnOpponent: () => Promise<void>;
  hoverCard: Callback<HoverCard>;
  playCardPlayer: Callback<PlayCardSender>;
  playCardOpponent: Callback<PlayCardReceiver>;
  unhoverCard: () => Promise<void>;
  // Sidenav
  acceptFriendReceiver: Callback<AcceptFriendReceiver>;
  acceptFriendSender: Callback<AcceptFriendSender>;
  addFriend: Callback<AddFriend>;
  blockReceiver: Callback<BlockReceiver>;
  blockSender: Callback<BlockSender>;
  declineFriend: Callback<DeclineFriend>;
  setAvatarReceiver: Callback<SetAvatarReceiver>;
  setAvatarSender: Callback<SetAvatarSender>;
  unblock: Callback<Unblock>;
  unfriendReceiver: Callback<UnfriendReceiver>;
  unfriendSender: Callback<UnfriendSender>;
}
























/**
 * BELOW TYPES SHOULD BE DELETED BUT ONLY AFTER FRONTEND REFACTOR
 */
// -------------------- AUTH --------------------
interface GetPrivateKeyHashRes {
  privateKeyHash: string;
}
interface SigninRes {
  player: any;
  friends: any[];
  lobby: any | undefined;
  game: any | undefined;
}
// -------------------- CLIENT --------------------
interface JoinLobbyReceiverRes {
  challengee: any;
}
interface JoinLobbySenderRes {
  lobby: any;
}
interface MakeLobbyRes {
  lobby: any;
}
interface SaveDeckRes {
  cards: Array<any>;
}
interface SelectDeckRes {
  deckId: number;
}
interface SetDeckKlassRes {
  deckId: number;
  klass: number;
}
interface SetDeckNameRes {
  id: number;
  name: string;
}
interface StartGameRes {
  game: any;
}
// -------------------- GAME --------------------
interface AttackCardReceiverRes {
  attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
  attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}
interface AttackCardSenderRes {
  attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
  attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}
interface HoverCardRes {
  field: string;
}
interface PlayCardReceiverRes {
  field: string;
  card: any;
}
interface PlayCardSenderRes {
  field: string;
  gid: number;
}
// -------------------- SIDENAV --------------------
interface AcceptFriendReceiverRes {
  username: string;
  avatarId: number;
  status: number;
}
interface AcceptFriendSenderRes {
  username: string;
  avatarId: number;
  status: number;
}
interface AddFriendRes {
  username: string;
}
interface BlockReceiverRes {
  username: string;
}
interface BlockSenderRes {
  username: string;
}
interface DeclineFriendRes {
  username: string;
}
interface SetAvatarReceiverRes {
  username: string;
  avatarId: number;
}
interface SetAvatarSenderRes {
  avatarId: number;
}
interface UnblockRes {
  friendname: string;
}
interface UnfriendReceiverRes {
  username: string;
}
interface UnfriendSenderRes {
  username: string;
}
interface UpdateFriendRes {
  username: string;
  status: number;
}



interface NotificationRes {
  msg: string;
}

interface SendChatMsgReceiverRes {
  sender: string;
  text: string;
  date: Date;
}
interface SendChatMsgSenderRes {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}

export type {
  // AUTH
  GetPrivateKeyHashRes,
  SigninRes,
  // CLIENT
  JoinLobbyReceiverRes,
  JoinLobbySenderRes,
  MakeLobbyRes,
  SaveDeckRes,
  SelectDeckRes,
  SetDeckKlassRes,
  SetDeckNameRes,
  StartGameRes,
  // GAME
  AttackCardReceiverRes,
  AttackCardSenderRes,
  HoverCardRes,
  PlayCardReceiverRes,
  PlayCardSenderRes,
  // SIDENAV
  AcceptFriendReceiverRes,
  AcceptFriendSenderRes,
  AddFriendRes,
  BlockReceiverRes,
  BlockSenderRes,
  DeclineFriendRes,
  SetAvatarReceiverRes,
  SetAvatarSenderRes,
  UnblockRes,
  UnfriendReceiverRes,
  UnfriendSenderRes,
  UpdateFriendRes,
  // GLOBAL
  NotificationRes,
  SendChatMsgReceiverRes,
  SendChatMsgSenderRes
};
