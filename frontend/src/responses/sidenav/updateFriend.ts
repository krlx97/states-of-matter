import {socialStore} from "stores/view";

interface UpdateFriend {
  username: string;
  status: number;
}

const updateFriend = (params: UpdateFriend): void => {
  const {username, status} = params;

  socialStore.update((store) => {
    const {friends} = store;
    const friend = friends.find((friend) => friend.username === username);

    friend.status = status;

    return store;
  });
};

export default updateFriend;
