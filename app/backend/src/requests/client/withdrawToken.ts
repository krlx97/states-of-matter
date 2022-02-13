import type {SocketRequest} from "models";

const withdrawToken: SocketRequest<any> = async (services, params) => {
  console.log("withdrawing...");
  const {blockchainService} = services;

  const transaction = await blockchainService.transact("withdraw", params);

  if (!transaction) { return; }
};

export default withdrawToken;
