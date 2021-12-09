import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models/index.js";
import type {Signin} from "./signin.models";

const signin: Request<Signin> = async (services, params) => {
  const {blockchainService, chatService, ioService, playerService} = services;
  const {username, publicKey, signature} = params;
  let lobby;
  let game;

  // const transaction = await blockchainService.transact("signin", {publicKey, signature});

  // if (!transaction) { return; }

  const {socketId} = ioService;
  const player = await playerService.findAndUpdate({username}, {
    $set: {
      socketId,
      status: PlayerStatus.ONLINE
    }
  }, {returnDocument: "after"});

  if (!player) { return; }

  const {friends} = player.social;
  const friendsView: Array<any> = [];

  for (const friendname of friends) {
    const [friend, chat] = await Promise.all([
      playerService.find({username: friendname}),
      chatService.find({players: [username, friendname]})
    ]);

    if (!friend || !chat) { return; }

    const {status, avatarId} = friend;
    const {messages} = chat;

    friendsView.push({username: friendname, status, avatarId, messages});
  }

  if (player.lobbyId) {
    // lobby = await blockchainService.findLobby(player.account.lobby_id);

    // if (!lobby) { return; }
  } else if (player.gameId) {
    // game = await mongoService.findGame({id: player.account.game_id});

    // if (!game) { return; }
  }

  ioService.emit("signin", {player, friends: friendsView, lobby, game});
};

export default signin;
