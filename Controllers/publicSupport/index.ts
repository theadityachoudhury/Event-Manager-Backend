import { NextFunction, Request, Response } from "express";
import contactSchema from "../../Validators/Contact";
import ContactLogs from "../../Models/ContactLogs";

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

const getUserTickets = async (req: Request, res: Response, next: NextFunction) => {

};

const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tickets = await ContactLogs.find();
        return res.json(tickets);
    } catch (error: any) {
        return res.status(500).json({ message: "Something unexpected happened!!" })
    }
};

const getEmailLogs = async (req: Request, res: Response, next: NextFunction) => {

};

export default {
    addTicket,
    getUserTickets,
    getTickets,
    getEmailLogs
}