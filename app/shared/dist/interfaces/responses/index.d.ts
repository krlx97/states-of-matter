interface UpdateFriend {
    username: string;
    status: number;
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
interface GetPrivateKeyHash {
    privateKeyHash: string;
}
interface Signin {
    player: any;
    friends: any[];
    lobby: any | undefined;
    game: any | undefined;
}
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
declare type Callback<Params> = (params: Params) => void;
export interface SocketResponses {
    notification: Callback<string>;
    updateStatus: Callback<UpdateFriend>;
    sendChatMsgReceiver: Callback<SendChatMsgReceiver>;
    sendChatMsgSender: Callback<SendChatMsgSender>;
    getPrivateKeyHash: Callback<GetPrivateKeyHash>;
    signin: Callback<Signin>;
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
    endGame: () => void;
    attackCardReceiver: Callback<AttackCardReceiver>;
    attackCardSender: Callback<AttackCardSender>;
    "attackHero|player": Callback<AttackHeroPlayer>;
    "attackHero|opponent": Callback<AttackHeroOpponent>;
    attackMinionOpponent: Callback<AttackMinionOpponent>;
    attackMinionPlayer: Callback<AttackMinionPlayer>;
    endTurnPlayer: () => void;
    endTurnOpponent: () => void;
    hoverCard: Callback<HoverCard>;
    playCardPlayer: Callback<PlayCardSender>;
    playCardOpponent: Callback<PlayCardReceiver>;
    unhoverCard: () => void;
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
interface GetPrivateKeyHashRes {
    privateKeyHash: string;
}
interface SigninRes {
    player: any;
    friends: any[];
    lobby: any | undefined;
    game: any | undefined;
}
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
interface AttackCardReceiverRes {
    attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
    attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}
interface AttackCardSenderRes {
    attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
    attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}
interface AttackHeroPlayer {
    attacker: "a" | "b" | "c" | "d";
}
interface AttackHeroOpponent {
    attacker: "a" | "b" | "c" | "d";
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
export type { GetPrivateKeyHashRes, SigninRes, JoinLobbyReceiverRes, JoinLobbySenderRes, MakeLobbyRes, SaveDeckRes, SelectDeckRes, SetDeckKlassRes, SetDeckNameRes, StartGameRes, AttackCardReceiverRes, AttackCardSenderRes, HoverCardRes, PlayCardReceiverRes, PlayCardSenderRes, AcceptFriendReceiverRes, AcceptFriendSenderRes, AddFriendRes, BlockReceiverRes, BlockSenderRes, DeclineFriendRes, SetAvatarReceiverRes, SetAvatarSenderRes, UnblockRes, UnfriendReceiverRes, UnfriendSenderRes, UpdateFriendRes, NotificationRes, SendChatMsgReceiverRes, SendChatMsgSenderRes };
