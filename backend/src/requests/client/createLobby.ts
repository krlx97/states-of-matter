import {randomInt} from "crypto";
import {PlayerStatus} from "@som/shared/enums";
import {mongo} from "apis";
import {isDeckValid} from "helpers/player";
import type {SocketRequest} from "@som/shared/types/backend";
import type {LobbyView} from "@som/shared/types/frontend";

const createLobby: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {accounts, players, lobbies} = mongo;

  socket.on("createLobby", async () => {
    const $player = await players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }
    if ($player.lobbyId) {
      return error("Already in a lobby.");
    }
    if ($player.gameId) {
      return error("Can't make a lobby while in game.");
    }
    if ($player.queueId) {
      return error("Can't make a lobby while in queue.");
    }
    if (!isDeckValid($player.decks[$player.deckId])) {
      return error("Invalid deck.");
    }

    const {name} = $player;
    const $account = await accounts.findOne({name});

    if (!$account) {
      return error("Account not found, try relogging.");
    }

    const {avatarId} = $account;
    const id = randomInt(1, 1000000001);
    const lobby: LobbyView = {
      id,
      host: {name, avatarId},
      challengee: {
        name: "",
        avatarId: 0
      }
    }

    const [$lobbyInsert, $playerUpdate] = await Promise.all([
      lobbies.insertOne(lobby),
      players.updateOne({socketId}, {
        $set: {
          lobbyId: id,
          status: PlayerStatus.IN_LOBBY
        }
      })
    ]);

    if (!$lobbyInsert.insertedId) {
      return error("Error inserting lobby.");
    }
    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("createLobby", {lobby});
  });
};

export {createLobby};
