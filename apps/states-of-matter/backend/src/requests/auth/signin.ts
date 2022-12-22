import {PlayerStatus} from "@som/shared/enums";
import {eosApi, findNFT, findAccount} from "apis/eos";
import {accountsDb, chatsDb, gamesDb, lobbiesDb, playersDb} from "apis/mongo";
import type {AccountFrontend, GameFrontend, LobbyFrontend, PlayerFrontend} from "@som/shared/types/frontend";
import type {SocketEvent} from "models";
import { generateFungible } from "helpers/player";
import { generateGameFrontend } from "helpers/game/generateGameFe";

const signin: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("signin", async (params) => {
    const {name} = params;
    let lobby, game: any;

    const $player = await playersDb.findOneAndUpdate({name}, [{
      $set: {
        socketId,
        status: {
          $switch: {
            branches: [{
              case: {
                $gt: ["$lobbyId", 0]
              },
              then: PlayerStatus.INLOBBY
            }, {
              case: {
                $gt: ["$gameId", 0]
              },
              then: PlayerStatus.INGAME
            }],
            default: PlayerStatus.ONLINE
          }
        }
      }
    }], {
      returnDocument: "after"
    });

    const playerChain = await findAccount(name);

    if (!$player.value || !playerChain) { return; }

    const acc = await accountsDb.findOne({name});

    if (!acc) { return; }

    const {friends} = acc.social;
    const friendsView: Array<any> = [];

    for (const friendname of friends) {
      const [friend, chat] = await Promise.all([
        playersDb.findOne({
          name: friendname
        }),
        chatsDb.findOne({
          players: {
            $all: [name, friendname]
          }
        })
      ]);

      if (!friend || !chat) { return; }

      const {status} = friend;
      const {messages} = chat;

      friendsView.push({username: friendname, status, avatarId: 1, messages});
    }

    const social = {
      friends: friendsView,
      requests: acc.social.requests,
      blocked: acc.social.blocked,
      chat: {
        username: "",
        avatarId: 0,
        status: 0,
        isOpen: false,
        messages: []
      }
    };

    const {lobbyId, gameId} = $player.value;
    let gameFrontend: GameFrontend | undefined;

    if (lobbyId) {
      lobby = await lobbiesDb.findOne({lobbyId});

      if (!lobby) {
        socket.emit("notification", "You are currently in a lobby that cannot be found. (Contact dev)");
        return;
      }
    } else if (gameId) {
      game = await gamesDb.findOne({gameId});

      console.log(name);

      if (!game) {
        socket.emit("notification", "You are currently in a game that cannot be found. (Contact dev)");
        return;
      }

      gameFrontend = generateGameFrontend(game, name);
    }

    const nftss: any[] = [];

    for (const serial of playerChain.tokens.nonFungible.serials) {
      nftss.push(await findNFT(serial));
    }

    const table = await eosApi.rpc.get_table_rows({
      code: "eternisom141",
      scope: "eternisom141",
      table: "players",
      lower_bound: name,
      upper_bound: name,
      limit: 1
    });

    const accountFrontend: AccountFrontend = {
      profile: {
        name: playerChain.profile.name,
        publicKey: "",
        privateKey: "",
        privateKeyHash: acc.privateKeyHash,
        nonce: playerChain.profile.nonce,
        joinedAt: playerChain.profile.joinedAt,
        avatarId: playerChain.profile.avatarId,
        isActivated: playerChain.profile.isActivated ? true : false
      },
      social,
      wallet: {
        fungible: generateFungible(playerChain.tokens.fungible),
        nonFungible: nftss
      }
    };

    const playerFrontend: PlayerFrontend = {
      name: $player.value.name,
      status: $player.value.status,
      xp: $player.value.xp,
      lv: $player.value.lv,
      deckId: $player.value.deckId,
      lobbyId: $player.value.lobbyId,
      gameId: $player.value.gameId,
      games: $player.value.games,
      decks: $player.value.decks,
      selectedSkins: table.rows[0].selectedSkins
    };

    socket.emit("signin", {
      accountFrontend,
      playerFrontend,
      lobbyFrontend: lobby as any,
      gameFrontend
    });
  });
};

export {signin};
