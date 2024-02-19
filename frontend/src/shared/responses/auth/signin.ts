import {ethersService, socketService} from "services";
import {lobbyStore, gameStore, playerStore, snapshotsStore, intervalsStore, nodeStore, intervals} from "stores";
import { get } from "svelte/store";

const TURN_DURATION_MS = 30000;

const signin = (): void => {
  const {socket} = socketService;

  socket.on("signin", async (params) => {
    const {playerView, lobbyView, gameView, snapshots, token} = params;

    if (token) {
      localStorage.setItem("jsonwebtoken", token);
    }

    snapshotsStore.set(snapshots);
    playerStore.set(playerView);

    await ethersService.init(playerView.address);
    await ethersService.reloadUser();

    if (lobbyView) {
      lobbyStore.set(lobbyView);
    }

    if (gameView) {
      gameStore.set(gameView);

      const endTurnTime = gameView.endTurnTime;

      clearInterval(intervals[0]);

      intervals[0] = setInterval(() => {
        const time = Date.now();
        let rem = endTurnTime - time;
        let x = (rem / TURN_DURATION_MS) * 100;

        if (time <= endTurnTime) {
          nodeStore.update((store) => {
            store.barHeight = `${x}%`;
            return store;
          });
        }
      }, 1000 / 60);
    }

    socket.emit("updateFriend");
  });
};

export {signin};
