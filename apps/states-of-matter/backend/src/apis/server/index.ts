import {createServer} from "http";
import {Server} from "socket.io";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

const httpServer = createServer(async (req, res) => {
  //set the request route
  if (req.url === "/api" && req.method === "GET") {
      //response headers
      res.writeHead(200, { "Content-Type": "application/json" });
      //set the response
      res.write("Hi there, This is a Vanilla Node.js API");
      //end the response
      res.end();
  }

  // If no route present
  else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
  }
});
const ioServer = new Server<SocketRequests, SocketResponses>(httpServer, {
  cors: {
    origin: "*"
  },
  serveClient: false,
  transports: ["websocket"],
  allowUpgrades: false
});

export {httpServer, ioServer};
