import {ethersService, socketService} from "services";
import {lobbyStore, gameStore, playerStore, snapshotsStore} from "stores";

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
    }

    socket.emit("updateFriend");
  });
};

export {signin};
