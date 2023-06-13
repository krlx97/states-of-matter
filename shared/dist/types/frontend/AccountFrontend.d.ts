interface Message {
    name: string;
    date: Date;
    text: string;
}
type Messages = Array<Message>;
interface Friend {
    name: string;
    status: number;
    avatarId: number;
    messages: Messages;
}
type Friends = Array<Friend>;
interface Chat {
    name: string;
    status: number;
    avatarId: number;
    messages: Messages;
    isOpen: boolean;
}
interface Social {
    friends: Friends;
    requests: Array<string>;
    blocked: Array<string>;
    chat: Chat;
}
interface AccountFrontend {
    name: string;
    publicKey: string;
    avatarId: number;
    bannerId: number;
    social: Social;
}
export type { AccountFrontend, Friend, Message };
