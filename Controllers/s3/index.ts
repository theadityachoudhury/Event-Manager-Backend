import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextFunction, Request, Response } from "express";
import config from "../../Config";
const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
})

const getObjectURL = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: "evently-data",
        Key: key
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}

const putObject = async (filename: string, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: "evently-data",
        Key: `user/face/${filename}`,
        ContentType: contentType
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}

const faceAdd = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.key) {
        return res.status(404).json({
            message: "Key not found!!"
        });
    }

    if (!req.body.type) {
        return res.status(404).json({
            message: "Key type not found!!"
        });
    }
    const { key, type } = req.body;
    const url = await putObject(key, type);
    return res.status(200).json(url);
}

const faceGet = async (req: Request, res: Response, next: NextFunction) => {
    const url = await getObjectURL('user/face/2.jpg');
    return res.status(200).json(url);
}

export default {
    getObjectURL,
    putObject,
    faceAdd,
    faceGet
}