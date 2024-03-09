import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextFunction, Request, Response } from "express";
import config from "../../Config";
import Users from "../../Models/Users";

// Define a custom request interface with additional properties
interface customRequest extends Request {
    user_id: string;
    _id: string;
    token: String;
    email: String;
    role: String;
    verified: Boolean;
}

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
        Key: filename,
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
    const url = await putObject(`profile/${key}`, type);
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
const faceGet = async (req: customRequest, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const user = await Users.findById(req._id);
        if (!user) return res.status(200).json(null);
        const url = await getObjectURL(`profile/${req._id}`);
        return res.status(200).json(url);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error!!", log: err });
    }

};

const eventImagePut = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.key || !req.body.eventId || !req.body.type) {
        return res.status(404).json({
            message: "Key or key type not found!!"
        });
    }

    const { key, type,eventId } = req.body;
    const url = await putObject(`event/${eventId}/${key}`, type);
    return res.status(200).json(url);
}

const eventImageGet = async (req: Request, res: Response, next: NextFunction) => {
    
}

export default {
    getObjectURL,
    putObject,
    faceAdd,
    faceGet
};
