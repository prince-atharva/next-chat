import express from "express";
import { createServer } from "http";
import next from "next";
import dotenv from "dotenv";
import { initializeSocket } from "./utils/socket";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
const httpServer = createServer(server);
initializeSocket(httpServer);

app.prepare().then(() => {
  server.all("*", (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});