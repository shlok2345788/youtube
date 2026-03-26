import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  videoid: String,
  userid: String,
  commentbody: String,
  usercommented: String,
  userimage: String,
  city: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [String],
  dislikedBy: [String],
  commentedon: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("comments", commentSchema);
