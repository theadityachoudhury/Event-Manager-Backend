import { NextFunction, Request, Response } from "express";
import eventValidator from "../../Validators/Events";
import Events from "../../Models/Events";
const addEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventValidated = await eventValidator.eventsSchema.validateAsync(req.body);
        const event = new Events({
            ...eventValidated
        });
        await event.save();
        return res.status(201).json();
    } catch (err: any) {
        console.log(err);
        let errorMsg = "Internal Server Error";
        if (err.isJoi === true) {
            err.status = 403;
            errorMsg = err.message;
        }
        return res.status(err.status || 500).json({
            reason: "server",
            message: errorMsg,
            success: false,
        });
    }
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(404).json({
                message: "Event Id not found",
                success: false
            });
        }

        const event = await Events.findByIdAndDelete(eventId);
        return res.status(200).json();
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {

};

const viewEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const event = await Events.findById(id).populate("eventCategory");
        return res.status(200).json(event);
    } catch (err) {
        return res.status(500).json();
    }
};

const searchEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters: any = {
            eventType: "open"
        };
        if (req.query.free === 'string') {
            filters['free'] = req.query.free
        }

        if (req.query.eventCategory === 'string') {
            filters['eventCategory'] = req.query.eventCategory
        }

        if (req.query.price === 'string') {
            filters['price'] = parseInt(req.query.price, 10);
        }

        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

        const queryResults = Events.find(filters).skip((page - 1) * pageSize).limit(pageSize).populate("eventCategory");
        const totalCount = await Events.countDocuments(filters);

        const totalPages = Math.ceil(totalCount / pageSize);

        const metadata: any = { currentPage: page, perPage: pageSize, totalPages };
        if (page > 1) metadata.prevPage = page - 1;
        if (page < totalPages) metadata.nextPage = page + 1;

        const results = await queryResults;
        res.status(200).json({ success: true, results, metadata });

    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal Server Error', err: err });

    }
};

const markAttendance = async (req: Request, res: Response, next: NextFunction) => {

};

const getAttendance = async (req: Request, res: Response, next: NextFunction) => {

};

const isApplied = async (req: Request, res: Response, next: NextFunction) => {

};

const apply = async (req: Request, res: Response, next: NextFunction) => {

};

const registeredUser = async (req: Request, res: Response, next: NextFunction) => {

};

const userRegisteredEvents = async (req: Request, res: Response, next: NextFunction) => {

};

const userAttendedEvents = async (req: Request, res: Response, next: NextFunction) => {

};

const getApplications = async (req: Request, res: Response, next: NextFunction) => {

};
export default {
    addEvents,
    deleteEvent,
    updateEvent,
    viewEvent,
    searchEvents,
    markAttendance,
    getAttendance,
    isApplied,
    apply,
    registeredUser,
    userRegisteredEvents,
    userAttendedEvents,
    getApplications
}