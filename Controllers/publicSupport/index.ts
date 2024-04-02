import { NextFunction, Request, Response } from "express";
import contactSchema from "../../Validators/Contact";
import ContactLogs from "../../Models/ContactLogs";
import EmailLogs from "../../Models/EmailLogs";

/**
 * Adds a new ticket.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {Response} - JSON response indicating success (200) or failure (500).
 */
const addTicket = async (req: Request, res: Response, next: NextFunction) => {
    const contactRequest = await contactSchema.validateAsync(req.body);
    try {
        const contact = new ContactLogs({
            ...contactRequest
        });
        await contact.save();
        return res.json();
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!! Please try again later!!" });
    }
};

/**
 * Retrieves tickets for a specific user.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */

const getUserTickets = async (req: Request, res: Response, next: NextFunction) => {

};

/**
 * Retrieves all tickets.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {Response} - JSON response containing tickets or an error message.
 */
const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tickets = await ContactLogs.find();
        return res.json(tickets);
    } catch (error: any) {
        return res.status(500).json({ message: "Something unexpected happened!!" })
    }
};

/**
 * Retrieves email logs.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
const getEmailLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const emailLogs = await EmailLogs.find();
        return res.status(200).json(emailLogs);
    } catch (error: any) {
        return res.status(500).json({ message: "Something unexpected happened!!" })
    }
};

export default {
    addTicket,
    getUserTickets,
    getTickets,
    getEmailLogs
}