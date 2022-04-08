import type {App} from "models";

export const endTurn = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("endTurn", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {opponent} = gameController.getPlayers($game, username);
    const {hand, deck, hero} = opponent;
    const card = deck.pop();

    if (!card) {
      await gameController.endGame(gameId, "B");
      return;
    }

    hand.push(card);
    hero.mana = 100;

    const savedGame = await gameController.saveGame($game);

    if (!savedGame) { return; }

    socket.emit("endTurn|player");

    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("endTurn|opponent");
  });
};
