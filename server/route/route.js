import express from "express";
import { login, initiateLogin, verifyOtp, createChannel } from "../controller/auth.js";
import {
  getComments,
  createComment,
  likeComment,
  dislikeComment,
  deleteComment,
} from "../controller/comment.js";

import { createOrder, verifyPayment } from "../controller/payment.js";
import { downloadVideo, removeDownload, updateUserData } from "../controller/user.js";
import { uploadVideo, getAllVideos } from "../controller/video.js";
import { upload } from "../config/backblaze.js";

const routes = express.Router();

// Auth routes
routes.post("/login", login);
routes.post("/initiate-login", initiateLogin);
routes.post("/verify-otp", verifyOtp);
routes.post("/create-channel", createChannel);

// Payment routes
routes.post("/payment/orders", createOrder);
routes.post("/payment/verify", verifyPayment);

// User routes
routes.post("/user/download", downloadVideo);
routes.delete("/user/download/:userId/:videoId", removeDownload);
routes.post("/user/data", updateUserData);

// Comment routes
routes.get("/comments/:videoId", getComments);
routes.post("/comments", createComment);
routes.post("/comments/:commentId/like", likeComment);
routes.post("/comments/:commentId/dislike", dislikeComment);
routes.delete("/comments/:commentId", deleteComment);

// Video routes
routes.post("/video/upload", upload.single("file"), uploadVideo);
routes.get("/videos", getAllVideos);

export default routes;
