import mongoose, { model, Schema } from "mongoose";
import { email_pattern } from "../../utilis/core.mjs";

const User = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: email_pattern
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profile_picture: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

export const user_schema = mongoose.model("user", User);
