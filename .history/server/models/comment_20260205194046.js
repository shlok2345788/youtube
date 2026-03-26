import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  videoid: { type: String, required: true },
  userid: { type: String, required: true },
  commentbody: { type: String, required: true },
  usercommented: { type: String, required: true },
  userimage: String,
  city: String, // User's city name
  language: String, // Detected language of the comment
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of user IDs who liked
  dislikedBy: [{ type: String }], // Array of user IDs who disliked
  commentedon: {
    type: Date,
    default: Date.now,
  },
  isDeleted: { type: Boolean, default: false }, // Soft delete flag
});

const comments = mongoose.model("comments", commentSchema);
export default comments;
