import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";

const URI = process.env.MONGO_URI;

export const database_connect = async () => {
  if (!URI) {
    console.error("URI is required");
    return;
  }

  try {
    await mongoose.connect(
      URI,
      {
        dbName: "todo-posts",
      },
      console.log("mongodb is connected"),
    );
  } catch (error) {
    console.error(error);
    console.error("mongoose is disconnected");
  }
};
