import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    videoTitle: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoChannel: { type: String, required: true },
    uploader: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date() },
});

export default mongoose.model("Video", videoSchema);
