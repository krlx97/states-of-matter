import {ethersService, socketService} from "services";
import {lobbyStore, gameStore, playerStore, snapshotsStore, nodeStore, intervals, deckCache, leaderboardsStore, ethersStore} from "stores";
import { get } from "svelte/store";

const TURN_DURATION_MS = 90000;

const signin = (): void => {
  const {socket} = socketService;

  socket.on("signin", async (params) => {
    const {playerView, lobbyView, gameView, snapshots, leaderboards, token} = params;

    if (token) {
      localStorage.setItem("jsonwebtoken", token);
    }

    snapshotsStore.set(snapshots);
    leaderboardsStore.set(leaderboards);
    playerStore.set(playerView);

    const deepCopy = JSON.parse(JSON.stringify(playerView.decks[playerView.deckId]));
    deckCache.set(deepCopy);

    const $ethersStore = get(ethersStore);

    if ($ethersStore.chainId === 41n && $ethersStore.accounts.length) {
      ethersService.init(playerView.address);
    }

    await ethersService.reloadUser();

    if (lobbyView) {
      lobbyStore.set(lobbyView);
    }

    if (gameView) {
      gameStore.set(gameView);

      cancelAnimationFrame(intervals[0]);

      const barAnimation: FrameRequestCallback = (): void => {
        const currentTime = Date.now();
        const remaining = gameView.endTurnTime - currentTime;
        const height = (remaining / TURN_DURATION_MS) * 100;

        nodeStore.update((store) => {
          store.barHeight = `${height}%`;
          return store;
        });

        intervals[0] = requestAnimationFrame(barAnimation);
      };

      intervals[0] = requestAnimationFrame(barAnimation);
    }
  });
};

export {signin};
