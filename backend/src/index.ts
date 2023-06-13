import {mongo, server} from "apis";
import {contracts} from "apis/ethers";
import {BigNumber, utils} from "ethers";
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
  listingId: BigNumber,
  skinId: BigNumber,
  amount: BigNumber,
  price: BigNumber
): Promise<void> => {
  const $account = await mongo.accounts.findOne({
    publicKey: seller.toLowerCase() // wtf is wrong with ethereum addresses?
  });

  if (!$account) {
    console.log("Item seller account not found, listing anyway...");
  }

  await mongo.marketItems.insertOne({
    sellerName: $account ? $account.name : "Not a player",
    sellerAddress: seller.toLowerCase(),
    listingId: utils.formatUnits(listingId, 0),
    skinId: utils.formatUnits(skinId, 0),
    amount: utils.formatUnits(amount, 0),
    price: utils.formatUnits(price, 18) // etheric crystals
  });
});

contracts.game.on("CancelItem", async (listingId: BigNumber): Promise<void> => {
  const $marketItemDelete = await mongo.marketItems.deleteOne({
    listingId: utils.formatUnits(listingId, 0)
  });

  if (!$marketItemDelete) {
    console.log(`Error deleting item ${listingId} from market`);
  }
});

contracts.game.on("BuyItem", async (
  listingId: BigNumber,
  amount: BigNumber
): Promise<void> => {
  const $item = await mongo.marketItems.findOne({
    listingId: utils.formatUnits(listingId, 0)
  });

  if (!$item) { return; }

  const big = utils.parseUnits($item.amount, 0);

  if (big.sub(amount).lte(0)) {
    await mongo.marketItems.deleteOne({
      listingId: utils.formatUnits(listingId, 0)
    });
  } else {
    await mongo.marketItems.replaceOne({
      listingId: utils.formatUnits(listingId, 0)
    }, {
      ...$item,
      amount: utils.formatUnits(big.sub(amount), 0)
    });
  }
});

server.io.on("connection", (socket): void => {
  const error = (msg: string): void => {
    socket.emit("notification", msg);
    console.error(msg);
  };

  socket.on("getMarketItems" as any, async () => {
    const items = await mongo.marketItems.find().limit(100).toArray();
    socket.emit("getMarketItems" as any, {items});
  });

  requests.forEach((request): void => {
    request(socket, error);
  });
});

server.http.listen(process.env.PORT || 4201);
