const production = false;

const settings = {
  mongo: {
    uri: "mongodb://127.0.0.1:27017"
  },
  eos: {
    endpoint: "https://testnet.telos.net",
    contractAccount: "eternisvm131",
    contractKey: "5J9QDGDDjK7H4tUdChmfANqWGrXvKDRK1KXB5dXcjActcs5E9wD"
  },
  socket: {
    opts: production ? {} : {
      cors: {
        origin: "*"
      }
    }
  },
  server: {
    port: 4201
  }
};

export default settings;
