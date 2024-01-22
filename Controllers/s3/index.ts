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
});

/**
 * Gets a signed URL for retrieving an object from S3.
 * 
 * @param {string} key - The key of the object in S3.
 * @returns {Promise<string>} - The signed URL.
 */
const getObjectURL = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: "evently-data",
        Key: key
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
};

/**
 * Gets a signed URL for uploading an object to S3.
 * 
 * @param {string} filename - The name of the file to be uploaded.
 * @param {string} contentType - The content type of the file.
 * @returns {Promise<string>} - The signed URL.
 */
const putObject = async (filename: string, contentType: string): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: "evently-data",
        Key: `user/face/${filename}`,
        ContentType: contentType
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
};

/**
 * Handles the addition of a face to S3.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {Response} - JSON response containing the signed URL.
 */
const faceAdd = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    if (!req.body.key || !req.body.type) {
        return res.status(404).json({
            message: "Key or key type not found!!"
        });
    }

    const { key, type } = req.body;
    const url = await putObject(key, type);
    return res.status(200).json(url);
};

/**
 * Handles the retrieval of a face from S3.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {Response} - JSON response containing the signed URL.
 */
const faceGet = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const url = await getObjectURL('user/face/2.jpg');
    return res.status(200).json(url);
};

export default {
    getObjectURL,
    putObject,
    faceAdd,
    faceGet
};
