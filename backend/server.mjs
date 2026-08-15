import express from "express";
import { postRoutes } from "./routes/index.mjs";
import cors from "cors";
import "dotenv/config";
import { database_connect } from "./libs/mongodb.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.use(
  cors({
    origin: "https://mongodb-todo-arham.vercel.app",
  }),
);

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/api/v1", postRoutes);

app.listen(port, () => {
  console.log("server is running...");
  database_connect();
});
