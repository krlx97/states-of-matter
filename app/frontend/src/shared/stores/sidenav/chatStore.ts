import {writable, type Writable} from "svelte/store";

interface ChatMessage {
  text: string;
  date: string;
}

interface Chat {
  username: string;
  messages: Array<ChatMessage>;
}

export const chatStore: Writable<Array<Chat>> = writable([]);
