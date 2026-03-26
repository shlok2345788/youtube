import B2 from "backblaze-b2";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY,
});

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

export const getB2UploadUrl = async () => {
    await b2.authorize();
    const response = await b2.getUploadUrl({
        bucketId: process.env.B2_BUCKET_ID,
    });
    return response.data;
};

export default b2;
