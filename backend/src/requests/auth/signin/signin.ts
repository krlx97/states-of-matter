import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models/index.js";
import type {Signin} from "./signin.models";

const signin: Request<Signin> = async (services, params) => {
  const {
    blockchainService,
    chatService,
    gameService,
    ioService,
    lobbyService,
    playerService
  } = services;

  const {username, publicKey, signature} = params;
  let lobby;
  let game;

  // const transaction = await blockchainService.transact("signin", {publicKey, signature});

  // if (!transaction) { return; }

  const {socketId} = ioService;
  const player = await playerService.findAndUpdate({username}, [{
    $set: {
      socketId,
      status: {
        $switch: {
          branches: [{
            case: {$gt: ["$lobbyId", 0]},
            then: PlayerStatus.INLOBBY
          }, {
            case: {$gt: ["$gameId", 0]},
            then: PlayerStatus.INGAME
          }],
          default: PlayerStatus.ONLINE
        }
      }
    }
  }], {returnDocument: "after"});

  if (!player) { return; }

  const {friends} = player.social;
  const friendsView: Array<any> = [];

  for (const friendname of friends) {
    const [friend, chat] = await Promise.all([
      playerService.find({username: friendname}),
      chatService.find({players: {$all: [username, friendname]}})
    ]);

    if (!friend || !chat) { return; }

    const {status, avatarId} = friend;
    const {messages} = chat;

    friendsView.push({username: friendname, status, avatarId, messages});
  }

  const {lobbyId, gameId} = player;

  if (lobbyId) {
    lobby = await lobbyService.find({lobbyId});

    if (!lobby) { return; }
  } else if (gameId) {
    game = await gameService.find({gameId});

    if (!game) { return; }
  }

  ioService.emit("signin", {player, friends: friendsView, lobby, game});
};

export default signin;
