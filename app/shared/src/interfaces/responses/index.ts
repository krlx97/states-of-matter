import { GameFE } from "interfaces/client";

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
  attacker: "hero" | "minionA" | "minionB" | "minionC" | "minionD" | "minionE" | "minionF";
  attacked: "hero" | "minionA" | "minionB" | "minionC" | "minionD" | "minionE" | "minionF";
}

interface AttackCardSender {
  attacker: "hero" | "minionA" | "minionB" | "minionC" | "minionD" | "minionE" | "minionF";
  attacked: "hero" | "minionA" | "minionB" | "minionC" | "minionD" | "minionE" | "minionF";
}
interface AttackHeroPlayer {
  attacker: "a" | "b" | "c" | "d";
}
interface AttackHeroOpponent {
  attacker: "a" | "b" | "c" | "d";
}
interface AttackMinionPlayer {
  attacker: "a" | "b" | "c" | "d";
  attacked: "a" | "b" | "c" | "d";
}
interface AttackMinionOpponent {
  attacker: "a" | "b" | "c" | "d";
  attacked: "a" | "b" | "c" | "d";
}

interface HoverCard {
  field: "a" | "b" | "c" | "d";
}

interface PlayCardReceiver {
  field: string;
  card: any;
}

interface ReloadGameState {
  game: GameFE;
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

type Callback<Params> = (params: Params) => void;
interface LevelUp {xp: number, lv: number}

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
  destroyLobby: () => void;
  joinLobbyReceiver: Callback<JoinLobbyReceiver>;
  joinLobbySender: Callback<JoinLobbySender>;
  leaveLobbyReceiver: () => void;
  leaveLobbySender: () => void;
  makeLobby: Callback<MakeLobby>;
  saveDeck: Callback<SaveDeck>;
  selectDeck: Callback<SelectDeck>;
  setDeckKlass: Callback<SetDeckKlass>;
  setDeckName: Callback<SetDeckName>;
  startGame: Callback<StartGame>;
  // Game
  endGame: () => void;
  attackHeroOpponent:    Callback<AttackHeroOpponent>;
  attackHeroPlayer:      Callback<AttackHeroPlayer>;
  attackMinionOpponent:  Callback<AttackMinionOpponent>;
  attackMinionPlayer:    Callback<AttackMinionPlayer>;
  endTurnPlayer:         () => void;
  endTurnOpponent:       () => void;
  hoverCard:                Callback<HoverCard>;
  playMinionPlayer:      Callback<PlayCardSender>;
  playMinionOpponent:    Callback<PlayCardReceiver>;
  unhoverCard:               () => void;

  levelUp: Callback<LevelUp>;


  reloadGameState: Callback<ReloadGameState>;
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
