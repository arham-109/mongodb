import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import postRoutes from "./routes/post/index.mjs";
import { authRoutes, profileRoutes } from "./routes/index.mjs";
import { database_connect } from "./libs/mongodb.mjs";
import { jwtMiddleware } from "./middleware/jwt/index.mjs";

const app = express();
const server = http.createServer(app);
const port = process.env.port || 4000;

const allowedOrigins = [
  "https://mongodb-todo-arham.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", 
authRoutes,
jwtMiddleware,
postRoutes,
profileRoutes
);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}...`);
  database_connect();
});
