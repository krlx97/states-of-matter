import {createServer} from "http";
import express from "express";
import {readFileSync} from "fs";
import path from "path";

// const key = readFileSync("./cert/private.key.pem");
// const cert = readFileSync("./cert/domain.cert.pem");
const app = express();
const server = createServer(app)

// app.use((req, res, next) => {
//   if (req.header("x-forwarded-proto") !== "https") {
//     res.redirect(`https://${req.header("host")}${req.url}`);
//   } else {
//     next();
//   }
// });

app.use(express.static(path.join(process.cwd(), "app")));
app.get("/", (req, res) => res.sendFile(`${process.cwd()}/app/index.html`));
app.get("*", (req, res) => res.sendFile(`${process.cwd()}/app/index.html`));

process.on("uncaughtException", (err, origin) => {
  console.error(`Error: ${err}\nOrigin: ${origin}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (error, origin) => {
  console.log(`Uncaught Exception: ${error}`);
});

server.listen(1337);
