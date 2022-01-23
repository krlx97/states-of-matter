import {miscService} from "shared/services";
import {playerStore} from "stores/data";
import {socialStore} from "stores/view";

import type {UnfriendReceiverRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const unfriendSender: Res<UnfriendReceiverRes> = (params) => {
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

    if (chat.username === username) chat.isOpen = false;

    return store;
  });

  miscService.closeModal();
};

export default unfriendSender;
