import {ethersService, socketService} from "services";
import {accountStore, lobbyStore, gameStore, playerStore, deckStore} from "stores";

const signin = (): void => {
  const {socket} = socketService;

  socket.on("signin", async (params): Promise<void> => {
    const {
      accountFrontend,
      playerFrontend,
      lobbyFrontend,
      gameFrontend
    } = params;

    playerStore.set(playerFrontend);
    accountStore.set(accountFrontend);

    deckStore.set(
      playerFrontend.decks.find((deck) => deck.id === playerFrontend.deckId)
    );

    if (accountFrontend.publicKey) {
      ethersService.key = accountFrontend.publicKey;
      await ethersService.loadUser();
    }

    if (lobbyFrontend) {
      lobbyStore.set(lobbyFrontend);
    }

    if (gameFrontend) {
      gameStore.set(gameFrontend);
    }

    socket.emit("updateFriend");
  });
};

export {signin};
