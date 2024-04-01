import {join} from "path";
import express from "express";
import {schedule} from "node-cron";
import {flush} from "flush";
import {server, settings} from "app";
import {requests} from "requests";

process.on("unhandledRejection", (reason, promise): void => {
  console.log(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (error, origin): void => {
  console.log(`Uncaught Exception: ${error}`);
});

// const cleanup = async (): Promise<void> => {
  // remove all rankedQueuePlayers, casualQueuePlayers, and gamePopups when
  // restarting the server?
  // also restart all games timers here as well...
// };

// await cleanup();

const {app, http, io} = server;
const dir = process.cwd();
const file = `${dir}/frontend/dist/index.html`;

app.use(express.static(join(dir, "frontend/dist")));
app.get("/", (request, response): void => response.sendFile(file));
app.get("*", (request, response): void => response.sendFile(file));

io.on("connection", (socket): void => {
  const error = (message: string): void => {
    const color = "warn";
    socket.emit("notification", {color, message});
    console.error(message);
  };

  requests.forEach((request): void => request(socket, error));
});

http.listen(settings.port);

schedule("0 */12 * * *", flush);
