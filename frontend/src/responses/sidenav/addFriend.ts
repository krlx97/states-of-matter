import {playerStore} from "stores/data";

interface Params { username: string; }

const addFriend = (params: Params): void => {
  playerStore.update((player) => {
    player.social.requests.push(params.username);
    return player;
  });
};

export default addFriend;
