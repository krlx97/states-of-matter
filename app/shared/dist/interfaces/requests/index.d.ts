import type { PlayerDeckCard } from "@som/backend/src/services/PlayerService/PlayerService.models";
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
interface SendChatMsgReq {
    sender: string;
    receiver: string;
    text: string;
    date: Date;
}
export type { GetPrivateKeyHashReq, SigninReq, SignupReq, JoinLobbyReq, SaveDeckReq, SelectDeckReq, SetDeckKlassReq, SetDeckNameReq, StartGameReq, AttackCardReq, PlayCardReq, HoverCardReq, AcceptFriendReq, AddFriendReq, BlockReq, DeclineFriendReq, SetAvatarReq, UnblockReq, UnfriendReq, SendChatMsgReq };
