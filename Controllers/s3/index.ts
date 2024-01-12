import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAQ3EGRHZ34RMT3ZFG",
        secretAccessKey: "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"
    }
})


const getObjectURL = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: "evently-data",
        Key: "1.jpg"
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}

const init = async () => {
    console.log(await getObjectURL(""));
}

init();