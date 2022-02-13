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
