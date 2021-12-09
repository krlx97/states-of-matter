import {playerStore} from "stores/data";

interface Params { username: string; }

const declineFriend = (params: Params): void => {
  playerStore.update((player) => {
    const {requests} = player.social;
    const i = requests.indexOf(params.username);

    requests.splice(i, 1);

    return player;
  });
};

export default declineFriend;
