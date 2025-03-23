import "dotenv/config.js";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import connect from "./db/db";

connect();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
