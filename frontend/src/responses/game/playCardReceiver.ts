import {get} from "svelte/store";
import {gameStore, playerStore} from "stores/data";

interface Params {
  field: string;
  gid: number;
  id: number;
}

const playCardReceiver = (params: Params): void => {
  const {field, gid, id} = params;
  const {username} = get(playerStore);

  gameStore.update((store) => {
    if (username === store.playerA.username) {
      const {playerB} = store;
      const {hand} = playerB;
      const card = hand.find((card) => card.gid === gid);

      if (!card) { return; }
      if (playerB.fields[field].gid) { return; }

      const i = hand.indexOf(card);

      hand.splice(i, 1);
      playerB.fields[field] = {gid, id};
    } else {
      const {playerA} = store;
      const {hand} = playerA;
      const card = hand.find((card) => card.gid === gid);

      if (!card) { return; }
      if (playerA.fields[field].gid) { return; }

      const i = hand.indexOf(card);

      hand.splice(i, 1);
      playerA.fields[field] = {gid, id};
    }

    return store;
  });
};

export default playCardReceiver;
