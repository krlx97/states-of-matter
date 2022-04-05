import type { Document } from "mongodb";
export interface ChatMessage {
    sender: string;
    date: Date;
    text: string;
}
export declare type ChatMessages = Array<ChatMessage>;
export declare type ChatPlayers = [string, string];
export interface Chat extends Document {
    players: ChatPlayers;
    messages: ChatMessages;
}
