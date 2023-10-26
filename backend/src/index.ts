import {mongo, server, contracts} from "app";
// import {BigInt, utils} from "ethers";
import {requests} from "requests";

process.on("unhandledRejection", (reason, promise): void => {
  console.log(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (error, origin): void => {
  console.log(`Uncaught Exception: ${error}`);
});

// maybe remove all rankedQueuePlayers, casualQueuePlayers, and gamePopups
// when restarting the server?


// put these ethereum events in separate files?
contracts.game.on("ListItem", async (
  seller: string,
  listingId: bigint,
  skinId: BigInt,
  amount: BigInt,
  price: BigInt
): Promise<void> => {
  const $account = await mongo.$accounts.findOne({
    publicKey: seller.toLowerCase()
  });

  if (!$account) {
    console.log("Item seller account not found, listing anyway...");
  }

  await mongo.$marketItems.insertOne({
    sellerName: $account ? $account.name : "Not a player",
    sellerAddress: seller.toLowerCase(),
    listingId: listingId.toString(),
    skinId: skinId.toString(),
    amount: amount.toString(),
    price: price.toString()
  });
});

contracts.game.on("CancelItem", async (listingId: BigInt): Promise<void> => {
  const $marketItemDelete = await mongo.$marketItems.deleteOne({
    listingId: listingId.toString()
  });

  if (!$marketItemDelete) {
    console.log(`Error deleting item ${listingId} from market`);
  }
});

// contracts.game.on("stake", async () => {
//   const accounts = await mongo.accounts.find().toArray();

//   for (const account of accounts) {
//     if (!account.publicKey) {
//       return "Metamask account not binded, can't receive rewards.";
//     }

//     const total = await contracts.game.total();
//     const playerChain = await contracts.game.players(account.publicKey);

//     const rewardPerStaked = (total.rewards.pool * (10 ** 18)) / total.staked(1);
//     const playerReward = (player.staked / (10 ** DECIMALS)) * rewardPerStaked;

//     await contracts.game.distributeRewards(account.publicKey);
//   }
// });

contracts.game.on("BuyItem", async (
  listingId: BigInt,
  amount: BigInt
): Promise<void> => {
  const $item = await mongo.$marketItems.findOne({
    listingId: listingId.toString()
  });

  if (!$item) { return; }

  // if (BigInt($item.amount) - amount < 0n) {
  //   await mongo.marketItems.deleteOne({
  //     listingId: listingId.toString()
  //   });
  // } else {
  //   await mongo.marketItems.replaceOne({
  //     listingId: listingId.toString()
  //   }, {
  //     ...$item,
  //     amount: utils.formatUnits($item.amount.sub(amount), 0)
  //   });
  // }
});

server.io.on("connection", (socket): void => {
  const error = (message: string): void => {
    socket.emit("notification", message);
    console.error(message);
  };

  // put this in separate request file.
  socket.on("getMarketItems" as any, async () => {
    const items = await mongo.$marketItems.find().limit(100).toArray();
    socket.emit("getMarketItems" as any, {items});
  });

  requests.forEach((request): void => {
    request(socket, error);
  });
});

server.http.listen(process.env.PORT || 4201);
