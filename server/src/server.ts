import "dotenv/config.js";
import http from "http";
import app from "./app";
import connect from "./db/db";
import UserModel from "./models/User.model";
import { initSocket } from "./socket";
import { messageConsumer } from "./services/consumer";

async function startApp() {
  connect();
  await UserModel.collection.createIndex({ username: "text" });
  await UserModel.init();
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;

  initSocket(server);
  await messageConsumer();

  server.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}
startApp();
