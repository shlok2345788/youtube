import users from "../models/user.js";

export const downloadVideo = async (req, res) => {
  const { userId, videoId, videoTitle, videoThumbnail, videoChannel } = req.body;

  try {
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is Premium
    if (user.isPremium) {
      // Premium user: Unlimited downloads
      user.downloads.push({
        videoId,
        videoTitle,
        videoThumbnail,
        videoChannel,
        downloadedAt: new Date(),
      });
      await user.save();
      return res.status(200).json({ message: "Video downloaded successfully", user });
    }

    // Free user: Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDownload = user.lastDownloadDate ? new Date(user.lastDownloadDate) : null;

    if (lastDownload) {
      lastDownload.setHours(0, 0, 0, 0);
    }

    if (lastDownload && lastDownload.getTime() === today.getTime()) {
      return res.status(403).json({ message: "Daily download limit reached. Upgrade to Premium for unlimited downloads." });
    }

    // Allow download
    user.downloads.push({
      videoId,
      videoTitle,
      videoThumbnail,
      videoChannel,
      downloadedAt: new Date(),
    });
    user.lastDownloadDate = new Date();
    await user.save();

    res.status(200).json({ message: "Video downloaded successfully", user });
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const removeDownload = async (req, res) => {
  const { userId, videoId } = req.params;

  try {
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.downloads = user.downloads.filter(item => String(item.videoId) !== String(videoId));
    await user.save();

    res.status(200).json({ message: "Download removed", user });
  } catch (error) {
    console.error("Error removing download:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUserData = async (req, res) => {
  const { userId, type, action, videoId } = req.body;
  // type expects: 'history' | 'liked' | 'watchLater'
  // action expects: 'add' | 'remove' | 'clear'

  try {
    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === 'clear' && type === 'history') {
      user.history = [];
    } else if (action === 'add') {
      // Avoid duplicate entires for liked/watchLater
      if (type === 'history') {
        // Option to avoid spamming the same video continuously
        if (!user.history.some(v => v.videoId === videoId)) {
           user.history.push({ videoId });
        } else {
           // update watchedAt time
           const target = user.history.find(v => v.videoId === videoId);
           if (target) target.watchedAt = new Date();
        }
      }
      if (type === 'liked' && !user.likedVideos.some(v => v.videoId === videoId)) {
        user.likedVideos.push({ videoId });
      }
      if (type === 'watchLater' && !user.watchLater.some(v => v.videoId === videoId)) {
        user.watchLater.push({ videoId });
      }
    } else if (action === 'remove') {
      if (type === 'liked') user.likedVideos = user.likedVideos.filter(v => v.videoId !== videoId);
      if (type === 'watchLater') user.watchLater = user.watchLater.filter(v => v.videoId !== videoId);
      if (type === 'history') user.history = user.history.filter(v => v.videoId !== videoId);
    }
    
    await user.save();
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
