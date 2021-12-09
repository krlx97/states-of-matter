import {miscService} from "services";
import {playerStore} from "stores/data";
import {socialStore} from "stores/view";

interface Params { friendname: string; }

const blockSender = (params: Params): void => {
  const {friendname} = params;

  playerStore.update((store) => {
    const {friends, blocked} = store.social;
    const i = friends.indexOf(friendname);

    friends.splice(i, 1);
    blocked.push(friendname);

    return store;
  });

  socialStore.update((store) => {
    const {chat, friends} = store;
    const friend = friends.find((friend) => friend.username === friendname);
    const i = friends.indexOf(friend);

    friends.splice(i, 1);

    if (chat.username === friendname) chat.isOpen = false;

    return store;
  });

  miscService.closeModal();
};

export default blockSender;
