import S3 from "aws-sdk/clients/s3.js";
import fs from "fs";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

// Upload a file to S3
export function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);

    var params = {
        Bucket: bucketName,
        Body: fileStream,
        Key: `uploads/${file.originalname}`,
    };
    return s3.upload(params, { fileSize: 40 * 1024 * 1024 }).promise();
}
