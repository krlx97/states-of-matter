import {playerStore} from "stores/data";
import {socialStore} from "stores/view";

interface Params { username: string; }

const blockReceiver = (params: Params): void => {
  const {username} = params;

  playerStore.update((store) => {
    const {friends} = store.social;
    const i = friends.indexOf(username);

    friends.splice(i, 1);

    return store;
  });

  socialStore.update((store) => {
    const {chat, friends} = store;
    const friend = friends.find((friend) => friend.username === username);
    const i = friends.indexOf(friend);

    friends.splice(i, 1);

    if (chat.username === username) { chat.isOpen = false; }

    return store;
  });
};

export default blockReceiver;
