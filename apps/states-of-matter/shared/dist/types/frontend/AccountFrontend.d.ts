interface Message {
    username: string;
    date: Date;
    text: string;
}
interface Friend {
    username: string;
    avatarId: number;
    status: number;
    messages: Array<Message>;
}
interface Chat {
    username: string;
    avatarId: number;
    status: number;
    isOpen: boolean;
    messages: Array<Message>;
}
interface Social {
    friends: Array<Friend>;
    requests: Array<string>;
    blocked: Array<string>;
    chat: Chat;
}
interface WalletFungible {
    symbol: string;
    contract: string;
    total: string;
    liquid: string;
    staked: string;
    unstaking: string;
    claimable: Array<{
        key: number;
        value: string;
    }>;
}
interface WalletNonFungible {
    serial: number;
    tags: any;
    attrs: any;
}
interface Wallet {
    fungible: Array<WalletFungible>;
    nonFungible: Array<WalletNonFungible>;
}
interface Profile {
    name: string;
    publicKey: string;
    privateKey: string;
    privateKeyHash: string;
    nonce: number;
    joinedAt: number;
    avatarId: number;
    isActivated: boolean;
}
interface AccountFrontend {
    profile: Profile;
    social: Social;
    wallet: Wallet;
}
export type { AccountFrontend };
