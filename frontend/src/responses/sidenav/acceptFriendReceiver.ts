import {playerStore} from "stores/data";
import {socialStore} from "stores/view";

interface Params {
  username: string;
  avatarId: number;
  status: number;
}

const acceptFriendReceiver = (params: Params): void => {
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
