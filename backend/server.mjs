import express from "express";
import { postRoutes } from "./routes/index.mjs";
import cors from "cors";
import "dotenv/config";
import { database_connect } from "./libs/mongodb.mjs";

const app = express();
process.env.PORT || 4000

app.use(cors());
app.use(express.json());


app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/api/v1", postRoutes);

app.listen(Port, () => {
  console.log("server is running...");
  database_connect();
});
