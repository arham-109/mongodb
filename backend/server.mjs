import "dotenv/config";
import express from "express";
import cors from "cors";
import { postRoutes } from "./routes/index.mjs";
import { database_connect } from "./libs/mongodb.mjs";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = process.env.port || 4000;

app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: ["https://mongodb-todo-arham.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", postRoutes);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}...`);
  database_connect();
});
