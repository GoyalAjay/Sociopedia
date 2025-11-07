import S3 from "aws-sdk/clients/s3.js";
import { fileTypeFromBuffer } from "file-type";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new S3({ region, accessKeyId, secretAccessKey });

// uploading a media post
export const mediaPost = async (buffer, key) => {
    const type = await fileTypeFromBuffer(buffer);
    const fileSize = buffer.length;
    console.log(`Size of the file: ${fileSize}`);
    if (type.mime.startsWith("image/") && fileSize > 10 * 1024 * 1024) {
        return { success: false, message: "File too large!!" };
    } else if (
        type.mime.startsWith("video/") &&
        fileSize > 1 * 1024 * 1024 * 1024
    ) {
        return { success: false, message: "File too large!!" };
    } else if (fileSize > 50 * 1024 * 1024) {
        return { success: false, message: "File too large!!" };
    }

    let params = {
        Bucket: bucketName,
        Body: buffer,
        Key: key,
    };

    if (type.ext === "xlsx") {
        params.ContentType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
    return await s3.upload(params).promise();
};

// uploading message media

// uploading profile pic
