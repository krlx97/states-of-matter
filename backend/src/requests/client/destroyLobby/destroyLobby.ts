import type {Request} from "../../../models";

const destroyLobby: Request = async (services) => {
  const {ioService, lobbyService, playerService} = services;
  const {socketId} = ioService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {username, lobbyId} = player;

  if (lobbyId <= 0) {
    ioService.notification("You are not in a lobby.");
    return;
  }

  const lobby = await lobbyService.find({lobbyId});

  if (!lobby) { return; }

  if (username !== lobby.host.username) {
    ioService.notification("You are not the lobby host.");
    return;
  }

  const isDeleted = await lobbyService.delete({lobbyId});

  if (!isDeleted) { return; }

  ioService.emit("destroyLobbySender");

  const challengee = await playerService.find({username: lobby.challengee.username});

  if (!challengee || !challengee.socketId) { return; }

  ioService.emitTo(challengee.socketId, "destroyLobbyReceiver");
};

export default destroyLobby;
