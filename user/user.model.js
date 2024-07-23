import mongoose from "mongoose";

// set schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 55,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 55,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    gender: {
      type: String,
      enum: ["male", "female", "preferNotToSay"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// create table
export const User = mongoose.model("User", userSchema);
