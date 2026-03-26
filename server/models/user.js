import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: { type: String, require: true },
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, default: null },
  description: String,
  channelname: String,
  image: String,
  isPremium: {
    type: Boolean,
    default: false,
  },
  plan: {
    type: String,
    enum: ['free', 'bronze', 'silver', 'gold'],
    default: 'free'
  },
  downloads: [
    {
      videoId: String,
      videoTitle: String,
      videoThumbnail: String,
      videoChannel: String,
      downloadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  history: [{
    videoId: String,
    watchedAt: { type: Date, default: Date.now }
  }],
  likedVideos: [{
    videoId: String,
    likedAt: { type: Date, default: Date.now }
  }],
  watchLater: [{
    videoId: String,
    addedAt: { type: Date, default: Date.now }
  }],
  lastDownloadDate: {
    type: Date,
    default: null,
  },
  joindate: {
    type: Date,
    default: Date.now,
  },
});

const users = mongoose.model("users", userSchema);
export default users;
