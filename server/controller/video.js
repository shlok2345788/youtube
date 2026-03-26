import Video from "../models/video.js";
import b2, { getB2UploadUrl } from "../config/backblaze.js";
import fs from "fs";

export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { videotitle, videochanel, uploader } = req.body;
        
        // 1. Authorize and get B2 upload URL
        const uploadData = await getB2UploadUrl();
        
        // 2. Upload file content to B2
        const fileBuffer = req.file.buffer;
        const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadData.uploadUrl,
            uploadAuthToken: uploadData.authorizationToken,
            fileName: `videos/${Date.now()}-${req.file.originalname}`,
            data: fileBuffer,
            mime: req.file.mimetype,
        });

        // 3. Create video record in DB
        // The file URL in B2 is usually: 
        // https://f000.backblazeb2.com/file/BUCKET_NAME/FILE_NAME
        // Or via S3 endpoint: https://BUCKET_NAME.s3.REGION.backblazeb2.com/FILE_NAME
        const videoUrl = `https://${process.env.B2_BUCKET_NAME}.${process.env.B2_ENDPOINT}/${uploadResponse.data.fileName}`;

        const newVideo = new Video({
            videoTitle: videotitle,
            videoUrl: videoUrl,
            videoChannel: videochanel,
            uploader: uploader,
        });

        await newVideo.save();

        res.status(201).json({
            message: "Video uploaded successfully",
            video: newVideo
        });
    } catch (error) {
        console.error("Error in uploadVideo controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
