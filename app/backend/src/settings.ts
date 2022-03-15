const production = false;

const settings = {
  mongo: {
    uri: "mongodb://localhost:27017"
  },
  eos: {
    endpoint: "https://testnet.telos.net",
    contractAccount: "telosgamesbp",
    contractKey: process.env.EOS_CONTRACT_KEY || "5K2rKojEWKC1UmmiyWKvvXcVeS1Devq2LQEgDyKejyFNJAX2AX2"
  },
  socket: {
    opts: production ? {} : {
      cors: {
        origin: "*"
      }
    }
  },
  server: {
    port: process.env.PORT || 4200
  }
};

export default settings;
