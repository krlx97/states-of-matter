// Global
interface SendChatMsg {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}

// -------------------- AUTH --------------------
interface GetPrivateKeyHash {
  name: string;
}

interface Signin {
  name: string;
  publicKey: string;
  signature: string;
}

interface Signup {
  name: string;
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
interface PlayMagic {
  gid: number;
}
interface PlayTrap {
  gid: number;
}

interface HoverCard {
  field: "a" | "b" | "c" | "d";
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



interface AcceptGame {
  gameId: number;
}

interface DeclineGame {
  gameId: number;
}


interface TransferToken {
  from: string;
  to: string;
  quantity: {
    contract: string;
    quantity: string;
  };
  memo: string;
  signature: string;
  isWithdraw: boolean;
}

interface Stake {
  name: string;
  signature: string;
  token: {
    contract: string;
    quantity: string;
  };
}

interface UnstakeToken {
  name: string;
  signature: string;
  token: {
    contract: string;
    quantity: string;
  };
}

interface Airdrop {
  name: string;
}

interface Mint {
  name: string;
  signature: string;
}



interface HoverHandCard {
  i: number;
}


interface DeselectSkin {
  id: number;
  username: string;
  signature: string;
}
interface SelectSkin {
  serial: number;
  username: string;
  signature: string;
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
  getLeaderboardsByLevel: () => Promise<void>;
  joinLobby: Callback<JoinLobby>;
  joinCasualQueue: () => Promise<void>;
  joinRankedQueue: () => Promise<void>;
  leaveCasualQueue: () => Promise<void>;
  leaveLobby: () => Promise<void>;
  leaveRankedQueue: () => Promise<void>;
  makeLobby: () => Promise<void>;
  saveDeck: Callback<SaveDeck>;
  selectDeck: Callback<SelectDeck>;
  sendToken: Callback<SendToken>;
  setDeckKlass: Callback<SetDeckKlass>;
  setDeckName: Callback<SetDeckName>;
  startGame: Callback<StartGame>;
  // Tokens
  transferToken: Callback<TransferToken>;
  stake: Callback<Stake>;
  airdrop: Callback<Airdrop>;
  mint: Callback<Mint>;
  unstakeToken: Callback<UnstakeToken>;
  // Skins
  deselectSkin: Callback<DeselectSkin>;
  selectSkin: Callback<SelectSkin>;
  // Game
  attackMinion: Callback<AttackMinion>;
  attackHero: Callback<AttackHero>;
  endTurn: () => Promise<void>;
  hoverCard: Callback<HoverCard>;
  hoverHandCard: Callback<HoverHandCard>;
  playMinion: Callback<PlayMinion>;
  playMagic: Callback<PlayMagic>;
  playTrap: Callback<PlayTrap>;
  unhoverCard: () => Promise<void>;
  unhoverHandCard: () => Promise<void>;
  // Sidenav
  acceptFriend: Callback<AcceptFriend>;
  addFriend: Callback<AddFriend>;
  block: Callback<Block>;
  declineFriend: Callback<DeclineFriend>;
  setAvatar: Callback<SetAvatar>;
  unblock: Callback<Unblock>;
  unfriend: Callback<Unfriend>;


  acceptGame: Callback<AcceptGame>;
  declineGame: Callback<DeclineGame>;
}
