import type { Field } from "../backend/Game/index.js";
import type { PlayerDeck } from "../backend/Player/index.js";
import type { QueueId } from "../../enums/index.js";
interface Signin {
    name: string;
    password: string;
}
interface Signup {
    name: string;
    password: string;
}
interface DefaultSkin {
    cardId: number;
}
interface FinishTutorial {
    tutorial: "deckBuilder" | "wallet" | "play";
}
interface JoinLobby {
    id: number;
}
interface JoinQueue {
    queueId: QueueId;
}
interface SaveDeck {
    deck: PlayerDeck;
}
interface SelectDeck {
    deckId: number;
}
interface SelectSkin {
    id: number;
}
interface AttackHero {
    attacker: Field;
}
interface AttackMinion {
    attacker: Field;
    attacked: Field;
}
interface PlayMagic {
    gid: number;
    target?: number;
    field?: Field;
}
interface PlayMinion {
    field: Field;
    gid: number;
}
interface PlayTrap {
    gid: number;
}
interface AcceptFriend {
    name: string;
}
interface AddFriend {
    name: string;
}
interface BlockFriend {
    name: string;
}
interface DeclineFriend {
    name: string;
}
interface RemoveFriend {
    name: string;
}
interface SendChatMsg {
    receiver: string;
    text: string;
}
interface SetAvatar {
    avatarId: number;
}
interface UnblockFriend {
    name: string;
}
type Callback<Params = undefined> = (params: Params) => Promise<void>;
interface SocketRequests {
    signin: Callback<Signin>;
    signup: Callback<Signup>;
    acceptGame: Callback;
    closeLobby: Callback;
    createLobby: Callback;
    declineGame: Callback;
    defaultSkin: Callback<DefaultSkin>;
    finishTutorial: Callback<FinishTutorial>;
    getLeaderboards: Callback;
    joinLobby: Callback<JoinLobby>;
    joinQueue: Callback<JoinQueue>;
    leaveLobby: Callback;
    leaveQueue: Callback;
    saveDeck: Callback<SaveDeck>;
    selectDeck: Callback<SelectDeck>;
    selectSkin: Callback<SelectSkin>;
    startCustomGame: Callback;
    attackHero: Callback<AttackHero>;
    attackMinion: Callback<AttackMinion>;
    endTurn: () => Promise<void>;
    playMagic: Callback<PlayMagic>;
    playMinion: Callback<PlayMinion>;
    playTrap: Callback<PlayTrap>;
    acceptFriend: Callback<AcceptFriend>;
    addFriend: Callback<AddFriend>;
    blockFriend: Callback<BlockFriend>;
    declineFriend: Callback<DeclineFriend>;
    removeFriend: Callback<RemoveFriend>;
    sendChatMsg: Callback<SendChatMsg>;
    setAvatar: Callback<SetAvatar>;
    unblockFriend: Callback<UnblockFriend>;
    updateFriend: () => Promise<void>;
}
export type { SocketRequests };
