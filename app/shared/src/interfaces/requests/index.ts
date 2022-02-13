import type {PlayerDeckCard} from "@som/backend/src/services/PlayerService/PlayerService.models";
// -------------------- AUTH --------------------
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
  cards: Array<PlayerDeckCard>;
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
