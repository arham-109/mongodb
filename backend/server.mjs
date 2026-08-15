import "dotenv/config";
import express from "express";
import cors from "cors";
import { postRoutes } from "./routes/index.mjs";
import { database_connect } from "./libs/mongodb.mjs";

const app = express();
const port = process.env.port || 4000; 

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", postRoutes);

app.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on port ${port}...`);
  database_connect();
});