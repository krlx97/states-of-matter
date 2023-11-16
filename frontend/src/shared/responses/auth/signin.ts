import {ethersService, socketService} from "services";
import {accountStore, lobbyStore, gameStore, playerStore, deckStore} from "stores";

const signin = (): void => {
  const {socket} = socketService;

  socket.on("signin", async (params) => {
    const {accountView, playerView, lobbyView, gameView, token} = params;

    if (token) {
      localStorage.setItem("jsonwebtoken", token);
    }

    playerStore.set(playerView);
    accountStore.set(accountView);

    deckStore.set(
      playerView.decks.find((deck) => deck.id === playerView.deckId)
    );

    if (accountView.address) {
      await ethersService.reloadUser();
    }

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
