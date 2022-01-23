import {playerStore} from "stores/data";
import {socialStore} from "stores/view";

import type {AcceptFriendReceiverRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const acceptFriendReceiver: Res<AcceptFriendReceiverRes> = (params) => {
  const {username, avatarId, status} = params;

  playerStore.update((store) => {
    store.social.friends.push(username);
    return store;
  });

  socialStore.update((store) => {
    store.friends.push({username, status, avatarId, messages: []});
    return store;
  });
};

export default acceptFriendReceiver;
