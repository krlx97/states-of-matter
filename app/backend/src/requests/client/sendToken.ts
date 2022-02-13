import type {SocketRequest} from "models";

const sendToken: SocketRequest<any> = async (services, params) => {
  const {blockchainService} = services;

  const transaction = await blockchainService.transact("transfer", params);

  if (!transaction) { return; }
};

export default sendToken;
