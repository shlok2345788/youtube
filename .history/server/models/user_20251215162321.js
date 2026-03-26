import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: { type: String, require: true },
  name: String,
  description: String,
  channelname: String,
  image: String,
  joindate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = 