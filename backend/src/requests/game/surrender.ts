import {CardType, EffectId} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Animations} from "@som/shared/types/game";
import { mongo } from "app";
import { endTurnTimeouts } from "helpers/gameHelpers/endTurnTimeouts";

const surrender: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("surrender", async () => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
    const animations: Animations = [];

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player, opponent} = getGameData;

    await gameHelpers.endGame($game.id, opponent.name, animations);

    clearTimeout(endTurnTimeouts[$game.id]);
  });
};

export {surrender};
