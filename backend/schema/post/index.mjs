import mongoose from "mongoose";

const post = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const post_schema = mongoose.model("posts", post)