import {randomInt} from "crypto";
import {GameType, PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "app";

const gamePopup = async (type: GameType, playerA: string, playerB: string) => {
  const {$gamePopups, $players} = mongo;
  const {io} = server;
  const id = randomInt(1, 1000000001);

  const [a, b] = await Promise.all([
    $players.findOneAndUpdate({
      name: playerA
    }, {
      $set: {
        gamePopupId: id
      }
    }, {
      returnDocument: "after"
    }),
    $players.findOneAndUpdate({
      name: playerB
    }, {
      $set: {
        gamePopupId: id
      }
    }, {
      returnDocument: "after"
    })
  ]);

  if (!a || !b) {
    return;
  }

  const gamePopupp = {
    id,
    type,
    playerA: {
      name: a.name,
      hasAccepted: false
    },
    playerB: {
      name: b.name,
      hasAccepted: false
    }
  };

  const inserted = await $gamePopups.insertOne(gamePopupp);

  if (!inserted.insertedId) {
    return;
  }

  const acceptTimeout = setTimeout(async () => {
    const $gamePopup = await $gamePopups.findOne({id});
    if (!$gamePopup) { return; }
    if (!$gamePopup.playerA.hasAccepted || !$gamePopup.playerB.hasAccepted) {

      const pa = await $players.findOneAndUpdate({
        name: $gamePopup.playerA.name
      }, {
        $set: {
          status: PlayerStatus.ONLINE,
          gamePopupId: 0
        }
      });
      const pb = await $players.findOneAndUpdate({
        name: $gamePopup.playerB.name
      }, {
        $set: {
          status: PlayerStatus.ONLINE,
          gamePopupId: 0
        }
      });

      if (!pa || !pb) { return; }

      await $gamePopups.deleteOne({id});

      io.to(pa.socketId).emit("declineGame");
      io.to(pb.socketId).emit("declineGame");
    }
  }, 10_000);

  io.to(a.socketId).emit("gamePopup", {gamePopup: gamePopupp});
  io.to(b.socketId).emit("gamePopup", {gamePopup: gamePopupp});
};

export {gamePopup};
