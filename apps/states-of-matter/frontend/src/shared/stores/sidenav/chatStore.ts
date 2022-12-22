import {writable} from "svelte/store";

interface ChatMessage {
  text: string;
  date: string;
}

interface Chat {
  username: string;
  messages: Array<ChatMessage>;
}

const chatStore = writable<Array<Chat>>([]);

export {chatStore};
