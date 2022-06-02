const production = false;

const settings = {
  mongo: {
    uri: "mongodb://localhost:27017"
  },
  eos: {
    endpoint: "https://testnet.telos.net",
    contractAccount: "somgame11111",
    contractKey: "5K52s5CAKU6tEXE6Rnirsjz5SKtWfKBN4H5634MSqMH6huaUAkx"
  },
  socket: {
    opts: production ? {} : {
      cors: {
        origin: "*"
      }
    }
  },
  server: {
    port: 4200
  }
};

export default settings;
