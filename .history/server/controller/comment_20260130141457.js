import comments from "../models/comment.js";
import mongoose from "mongoose";

// Validation: Check if comment contains special characters (excluding basic punctuation)
const hasSpecialCharacters = (text) => {
  // Allow letters, numbers, spaces, and basic punctuation: . , ! ? ' " - ( )
  // Block other special characters
  const allowedPattern = /^[a-zA-Z0-9\s.,!?'"\-()]+$/;
  return !allowedPattern.test(text);
};

// Get all comments for a video
export const getComments = async (req, res) => {
  const { videoId } = req.params;

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection not available.",
      error: "Database not connected"
    });
  }

  try {
    const videoComments = await comments.find({
      videoid: videoId,
      isDeleted: false
    }).sort({ commentedon: -1 });

    res.status(200).json({ comments: videoComments });
  } catch (err) {
    console.error(`Error fetching comments: ${err.message}`);
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  const { videoid, userid, commentbody, usercommented, userimage, city, language } = req.body;

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection not available.",
      error: "Database not connected"
    });
  }

  // Validate required fields
  if (!videoid || !userid || !commentbody || !usercommented) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for special characters
  if (hasSpecialCharacters(commentbody)) {
    return res.status(400).json({
      message: "Comments with special characters are not allowed. Please use only letters, numbers, and basic punctuation.",
      error: "Invalid characters"
    });
  }

  try {
    const newComment = await comments.create({
      videoid,
      userid,
      commentbody: commentbody.trim(),
      usercommented,
      userimage: userimage || "",
      city: city || "Unknown",
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
    });

    res.status(201).json({ comment: newComment });
  } catch (err) {
    console.error(`Error creating comment: ${err.message}`);
    res.status(500).json({ message: "Error creating comment", error: err.message });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection not available.",
      error: "Database not connected"
    });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const comment = await comments.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user already liked
    const alreadyLiked = comment.likedBy.includes(userId);
    // Check if user already disliked
    const alreadyDisliked = comment.dislikedBy.includes(userId);

    if (alreadyLiked) {
      // Remove like
      comment.likes -= 1;
      comment.likedBy = comment.likedBy.filter(id => id !== userId);
    } else {
      // Add like
      comment.likes += 1;
      comment.likedBy.push(userId);

      // If user had disliked before, remove dislike
      if (alreadyDisliked) {
        comment.dislikes -= 1;
        comment.dislikedBy = comment.dislikedBy.filter(id => id !== userId);
      }
    }

    await comment.save();

    // Check if dislikes reached 2, auto-delete
    if (comment.dislikes >= 2 && !comment.isDeleted) {
      comment.isDeleted = true;
      await comment.save();
      return res.status(200).json({
        comment,
        message: "Comment deleted due to excessive dislikes"
      });
    }

    res.status(200).json({ comment });
  } catch (err) {
    console.error(`Error liking comment: ${err.message}`);
    res.status(500).json({ message: "Error liking comment", error: err.message });
  }
};

// Dislike a comment
export const dislikeComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection not available.",
      error: "Database not connected"
    });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const comment = await comments.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user already disliked
    const alreadyDisliked = comment.dislikedBy.includes(userId);
    // Check if user already liked
    const alreadyLiked = comment.likedBy.includes(userId);

    if (alreadyDisliked) {
      // Remove dislike
      comment.dislikes -= 1;
      comment.dislikedBy = comment.dislikedBy.filter(id => id !== userId);
    } else {
      // Add dislike
      comment.dislikes += 1;
      comment.dislikedBy.push(userId);

      // If user had liked before, remove like
      if (alreadyLiked) {
        comment.likes -= 1;
        comment.likedBy = comment.likedBy.filter(id => id !== userId);
      }
    }

    await comment.save();

    // Check if dislikes reached 2, auto-delete
    if (comment.dislikes >= 2 && !comment.isDeleted) {
      comment.isDeleted = true;
      await comment.save();
      return res.status(200).json({
        comment,
        message: "Comment deleted due to excessive dislikes"
      });
    }

    res.status(200).json({ comment });
  } catch (err) {
    console.error(`Error disliking comment: ${err.message}`);
    res.status(500).json({ message: "Error disliking comment", error: err.message });
  }
};

// Delete a comment (by owner)
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection not available.",
      error: "Database not connected"
    });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const comment = await comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only allow owner to delete
    if (comment.userid !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    comment.isDeleted = true;
    await comment.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(`Error deleting comment: ${err.message}`);
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};
