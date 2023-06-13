import {compare} from "bcrypt"
import {PlayerStatus} from "@som/shared/enums";
import {mongo} from "apis";
import {generatePlayerView} from "helpers/player";
import {generateGameView} from "helpers/game/generateGameFe";
import type {AccountFrontend, GameView} from "@som/shared/types/frontend";
import type {SocketRequest} from "@som/shared/types/backend";

const signin: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {accounts, chats, games, lobbies, players} = mongo;

  socket.on("signin", async (params) => {
    const {name, password} = params;
    let lobby, game: any;

    const acc = await accounts.findOne({name});

    if (!acc) {
      return error(`Account ${name} not found.`);
    }

    const isCorrectPassword = await compare(password, acc.passwordHash);

    if (!isCorrectPassword) {
      return error("Invalid password.");
    }

    const $player = await players.findOneAndUpdate({name}, [{
      $set: {
        socketId,
        status: {
          $switch: {
            branches: [{
              case: {
                $gt: ["$lobbyId", 0]
              },
              then: PlayerStatus.IN_LOBBY
            }, {
              case: {
                $gt: ["$gameId", 0]
              },
              then: PlayerStatus.IN_GAME
            }],
            default: PlayerStatus.ONLINE
          }
        }
      }
    }], {
      returnDocument: "after"
    });

    if (!$player.value) {
      return error("Error updating player.");
    }

    const friendsView: Array<any> = [];

    for (const friendname of acc.social.friends) {
      const [friend, friendAcc, chat] = await Promise.all([
        players.findOne({
          name: friendname
        }),
        accounts.findOne({
          name: friendname
        }),
        chats.findOne({
          players: {
            $all: [$player.value.name, friendname]
          }
        })
      ]);

      if (!friend || !friendAcc || !chat) { return; }

      const {status} = friend;
      const {messages} = chat;

      friendsView.push({name: friendname, status, avatarId: friendAcc?.avatarId, messages});
    }

    const social = {
      friends: friendsView,
      requests: acc.social.requests,
      blocked: acc.social.blocked,
      chat: {
        name: "",
        status: 0,
        avatarId: 0,
        messages: [],
        isOpen: false
      }
    };

    const {lobbyId, gameId} = $player.value;
    let gameFrontend: GameView | undefined;

    if (lobbyId) {
      lobby = await lobbies.findOne({id: lobbyId});

      if (!lobby) {
        return error("You are currently in a lobby that cannot be found. (Contact dev)");
      }
    } else if (gameId) {
      game = await games.findOne({id: gameId});

      if (!game) {
        return error("You are currently in a game that cannot be found. (Contact dev)");
      }

      gameFrontend = generateGameView(game, $player.value.name);
    }

    const accountFrontend: AccountFrontend = {
      name,
      publicKey: acc.publicKey,
      avatarId: acc.avatarId,
      bannerId: acc.bannerId,
      social
    };

    const playerFrontend = generatePlayerView($player.value);

    socket.emit("signin", {
      accountFrontend,
      playerFrontend,
      lobbyFrontend: lobby as any,
      gameFrontend
    });
  });
};

export {signin};
