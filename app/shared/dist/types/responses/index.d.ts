import type { GameFE } from "../client";
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
interface LevelUp {
    xp: number;
}
interface HoverHandCard {
    i: number;
}
interface GetLeaderboardsByLevel {
    byLevel: Array<{
        username: string;
        lv: number;
        avatarId: number;
    }>;
    byElo: Array<{
        username: string;
        elo: number;
        avatarId: number;
    }>;
    byDMT: Array<{
        username: string;
        dmt: number;
    }>;
}
export interface SocketResponses {
    notification: Callback<string>;
    updateStatus: Callback<UpdateFriend>;
    sendChatMsgReceiver: Callback<SendChatMsgReceiver>;
    sendChatMsgSender: Callback<SendChatMsgSender>;
    getPrivateKeyHash: Callback<GetPrivateKeyHash>;
    signin: Callback<Signin>;
    destroyLobby: () => void;
    getLeaderboardsByLevel: Callback<GetLeaderboardsByLevel>;
    joinCasualQueue: () => void;
    joinLobbyReceiver: Callback<JoinLobbyReceiver>;
    joinLobbySender: Callback<JoinLobbySender>;
    joinRankedQueue: () => void;
    leaveCasualQueue: () => void;
    leaveLobbyReceiver: () => void;
    leaveLobbySender: () => void;
    leaveRankedQueue: () => void;
    makeLobby: Callback<MakeLobby>;
    saveDeck: Callback<SaveDeck>;
    selectDeck: Callback<SelectDeck>;
    setDeckKlass: Callback<SetDeckKlass>;
    setDeckName: Callback<SetDeckName>;
    startGame: Callback<StartGame>;
    endGame: () => void;
    attackHeroOpponent: Callback<AttackHeroOpponent>;
    attackHeroPlayer: Callback<AttackHeroPlayer>;
    attackMinionOpponent: Callback<AttackMinionOpponent>;
    attackMinionPlayer: Callback<AttackMinionPlayer>;
    endTurnPlayer: () => void;
    endTurnOpponent: () => void;
    hoverCard: Callback<HoverCard>;
    hoverHandCard: Callback<HoverHandCard>;
    playMinionPlayer: Callback<PlayCardSender>;
    playMinionOpponent: Callback<PlayCardReceiver>;
    unhoverCard: () => void;
    unhoverHandCard: () => void;
    levelUp: Callback<LevelUp>;
    reloadGameState: Callback<ReloadGameState>;
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
export {};
