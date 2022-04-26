interface SendChatMsg {
    sender: string;
    receiver: string;
    text: string;
    date: Date;
}
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
interface AttackMinion {
    attacker: "a" | "b" | "c" | "d";
    attacked: "a" | "b" | "c" | "d";
}
interface AttackHero {
    attacker: "a" | "b" | "c" | "d";
}
interface PlayMinion {
    field: "a" | "b" | "c" | "d";
    gid: number;
}
interface HoverCard {
    field: "a" | "b" | "c" | "d";
}
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
declare type Callback<Params> = (params: Params) => Promise<void>;
export interface SocketRequests {
    sendChatMsg: Callback<SendChatMsg>;
    updateStatus: () => Promise<void>;
    getPrivateKeyHash: Callback<GetPrivateKeyHash>;
    signin: Callback<Signin>;
    signup: Callback<Signup>;
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
    attackMinion: Callback<AttackMinion>;
    attackHero: Callback<AttackHero>;
    endTurn: () => Promise<void>;
    hoverCard: Callback<HoverCard>;
    playMinion: Callback<PlayMinion>;
    unhoverCard: () => Promise<void>;
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
