import "dotenv/config";
import express from "express";
import cors from "cors";
import { postRoutes } from "./routes/index.mjs";
import { database_connect } from "./libs/mongodb.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "https://mongodb-todo-arham.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.use("/api/v1", postRoutes);
app.use((req, res) => {
  res.status(404).json({
    message: `Route '${req.originalUrl}' not found on server.`,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  database_connect();
});