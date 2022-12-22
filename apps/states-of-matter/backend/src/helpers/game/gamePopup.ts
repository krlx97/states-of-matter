import {playersDb, preGamesDb} from "apis/mongo";
import {ioServer} from "apis/server";
import {randomInt} from "crypto";

const gamePopup = async (playerA: string, playerB: string): Promise<void> => {
  const [a, b] = await Promise.all([
    playersDb.findOne({name: playerA}),
    playersDb.findOne({name: playerB}),
  ]);

  if (!a || !b) { return; }

  const gameId = randomInt(0, 2_147_483_647);

  // const acceptTimeout = setTimeout(async () => {
  //   await preGamesDb.deleteOne({gameId});
  // }, 30_000);

  const preGame = {
    gameId,
    acceptTimeout: 0,
    playerA: {name: playerA, hasAccepted: false},
    playerB: {name: playerB, hasAccepted: false}
  };

  const inserted = await preGamesDb.insertOne(preGame);

  if (!inserted.insertedId) { return; }

  console.log("succ");

  ioServer.to(a.socketId).emit("gamePopup", {...preGame});
  ioServer.to(b.socketId).emit("gamePopup", {...preGame});
};

export {gamePopup};
