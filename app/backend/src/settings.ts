const production = false;

const settings = {
  mongo: {
    uri: "mongodb://localhost:27017"
  },
  eos: {
    endpoint: process.env.EOS_ENDPOINT || "https://testnet.telos.net",
    contractAccount: process.env.EOS_CONTRACT_ACCOUNT || "telosgamesbp",
    contractKey: process.env.EOS_CONTRACT_KEY || "5K2rKojEWKC1UmmiyWKvvXcVeS1Devq2LQEgDyKejyFNJAX2AX2"
  },
  socket: {
    opts: production ? {} : {
      cors: {origin: "*"}
    }
  },
  server: {
    port: process.env.PORT || 4200
  }
};

export default settings;
