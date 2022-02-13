const requests = [{
  name: "getPrivateKeyHash",
  req: {
    username: "string"
  },
  res: {
    privateKeyHash: "string"
  }
}, {
  name: "signin",
  req: {
    username: "string",
    publicKey: "string",
    signature: "string"
  },
  res: {
    privateKeyHash: "string"
  }
}, ];

export default requests;
