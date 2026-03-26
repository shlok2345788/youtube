import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { ThumbsUp, ThumbsDown, Languages, X } from "lucide-react";
import { toast } from "sonner";

// Define error type for better TypeScript support
interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  userimage?: string;
  city?: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  commentedon: string;
  isDeleted?: boolean;
}

interface CommentsProps {
  videoId: string;
}

// Translation function using LibreTranslate (free API)
const translateText = async (text: string, targetLang: string = "en"): Promise<string> => {
  try {
    // Using LibreTranslate public API (free, no API key needed)
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    // Fallback: return original text if translation fails
    return text;
  }
};

// Get user's city using geolocation API
const getUserCity = async (): Promise<string> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data.city || "Unknown";
  } catch (error) {
    console.error("Error fetching city:", error);
    return "Unknown";
  }
};

// Validate special characters (client-side check before sending)
const hasSpecialCharacters = (text: string): boolean => {
  const allowedPattern = /^[a-zA-Z0-9\s.,!?'"\-()]+$/;
  return !allowedPattern.test(text);
};

const Comments = ({ videoId }: CommentsProps) => {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCity, setUserCity] = useState<string>("");
  const [translatingCommentId, setTranslatingCommentId] = useState<string | null>(null);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [targetLanguage, setTargetLanguage] = useState<string>("en");

  // Fetch user's city on component mount
  useEffect(() => {
    getUserCity().then(setUserCity);
  }, []);

  // Fetch comments from backend
  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/user/comments/${videoId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    // Check for special characters
    if (hasSpecialCharacters(newComment)) {
      toast.error("Comments with special characters are not allowed. Please use only letters, numbers, and basic punctuation.");
      return;
    }

    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    setLoading(true);
    try {
      const userId = user._id || user.id || String(user._id || user.id);
      const response = await axiosInstance.post("/user/comments", {
        videoid: videoId,
        userid: userId,
        commentbody: newComment,
        usercommented: user.name || user.username,
        userimage: user.image,
        city: userCity,
      });

      setComments([response.data.comment, ...comments]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error: any) {
      console.error("Error creating comment:", error);
      const errorMessage = error?.response?.data?.message || "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) {
      toast.error("Please sign in to like comments");
      return;
    }

    const userId = user._id || user.id || String(user._id || user.id);
    try {
      const response = await axiosInstance.post(`/user/comments/${commentId}/like`, {
        userId: userId,
      });

      // If comment was auto-deleted, remove it from the list
      if (response.data.comment.isDeleted) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.info("Comment removed due to excessive dislikes");
        return;
      }

      // Update the comment in the list
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? response.data.comment : c))
      );
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment");
    }
  };

  const handleDislike = async (commentId: string) => {
    if (!user) {
      toast.error("Please sign in to dislike comments");
      return;
    }

    const userId = user._id || user.id || String(user._id || user.id);
    try {
      const response = await axiosInstance.post(`/user/comments/${commentId}/dislike`, {
        userId: userId,
      });

      // If comment was auto-deleted, remove it from the list
      if (response.data.comment.isDeleted) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.info("Comment removed due to excessive dislikes");
        return;
      }

      // Update the comment in the list
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? response.data.comment : c))
      );
    } catch (error) {
      console.error("Error disliking comment:", error);
      toast.error("Failed to dislike comment");
    }
  };

  const handleTranslate = async (comment: Comment) => {
    if (translatedTexts[comment._id]) {
      // If already translated, remove translation
      const newTranslatedTexts = { ...translatedTexts };
      delete newTranslatedTexts[comment._id];
      setTranslatedTexts(newTranslatedTexts);
      return;
    }

    setTranslatingCommentId(comment._id);
    try {
      const translated = await translateText(comment.commentbody, targetLanguage);
      setTranslatedTexts((prev) => ({
        ...prev,
        [comment._id]: translated,
      }));
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate comment");
    } finally {
      setTranslatingCommentId(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;

    const userId = user._id || user.id || String(user._id || user.id);
    try {
      await axiosInstance.delete(`/user/comments/${commentId}`, {
        data: { userId: userId },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting comment:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete comment";
      toast.error(errorMessage);
    }
  };

  const isLiked = (comment: Comment) => {
    if (!user) return false;
    const userId = String(user._id || user.id);
    return comment.likedBy.some(id => String(id) === userId);
  };

  const isDisliked = (comment: Comment) => {
    if (!user) return false;
    const userId = String(user._id || user.id);
    return comment.dislikedBy.some(id => String(id) === userId);
  };

  return (
    <div className="space-y-6 mt-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{comments.length} Comments</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Translate to:</label>
          <select
            value={targetLanguage}
            onChange={(e) => {
              setTargetLanguage(e.target.value);
              setTranslatedTexts({}); // Clear existing translations
            }}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="ar">Arabic</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="it">Italian</option>
            <option value="tr">Turkish</option>
          </select>
        </div>
      </div>

      {/* Comment Input */}
      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image} />
            <AvatarFallback>{(user.name || user.username)?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
              className="min-h-20 resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setNewComment("")}
                disabled={!newComment.trim() || loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || loading}
              >
                {loading ? "Posting..." : "Comment"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="text-center py-4 text-gray-500">
          Please sign in to comment
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.userimage} />
                <AvatarFallback>{comment.usercommented[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-sm">
                    {comment.usercommented}
                  </span>
                  {comment.city && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      📍 {comment.city}
                    </span>
                  )}
                  <span className="text-xs text-gray-600">
                    {formatDistanceToNow(new Date(comment.commentedon))} ago
                  </span>
                </div>

                <div className="mb-2">
                  {translatedTexts[comment._id] ? (
                    <div>
                      <p className="text-sm text-gray-600 italic mb-1">
                        {comment.commentbody}
                      </p>
                      <p className="text-sm font-medium">
                        {translatedTexts[comment._id]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm">{comment.commentbody}</p>
                  )}
                </div>

                {/* Like/Dislike and Translate buttons */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className={`flex items-center gap-1 text-sm ${isLiked(comment)
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                      }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleDislike(comment._id)}
                    className={`flex items-center gap-1 text-sm ${isDisliked(comment)
                        ? "text-red-600 font-semibold"
                        : "text-gray-600 hover:text-red-600"
                      }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{comment.dislikes}</span>
                  </button>

                  <button
                    onClick={() => handleTranslate(comment)}
                    disabled={translatingCommentId === comment._id}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"
                  >
                    <Languages className="w-4 h-4" />
                    <span>
                      {translatingCommentId === comment._id
                        ? "Translating..."
                        : translatedTexts[comment._id]
                          ? "Show Original"
                          : "Translate"}
                    </span>
                  </button>

                  {/* Delete button (only for comment owner) */}
                  {user && (String(comment.userid) === String(user._id || user.id)) && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 ml-auto"
                    >
                      <X className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
