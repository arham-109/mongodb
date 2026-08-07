import mongoose from "mongoose";

const post = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

export const post_schema = mongoose.model("posts", post)