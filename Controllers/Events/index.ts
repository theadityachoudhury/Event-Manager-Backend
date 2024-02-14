import { NextFunction, Request, Response } from "express";
import eventValidator from "../../Validators/Events";
import Events from "../../Models/Events";
import Fuse from "fuse.js";
import EventRegistered from "../../Models/EventRegistered";

// Define a custom request interface with additional properties
interface customRequest extends Request {
    user_id: string;
    _id: string;
    token: String;
    email: String;
    role: String;
    verified: Boolean;
}


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

// const searchEvents = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const filters: any = {
//             eventType: "open"
//         };

//         const query = req.query.query as string;

//         const page = parseInt(req.query.page as string, 10) || 1;
//         const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

//         const queryResults = Events.find(filters).skip((page - 1) * pageSize).limit(pageSize).populate("eventCategory");
//         const totalCount = await Events.countDocuments(filters);

//         const totalPages = Math.ceil(totalCount / pageSize);

//         const metadata: any = { currentPage: page, perPage: pageSize, totalPages };
//         if (page > 1) metadata.prevPage = page - 1;
//         if (page < totalPages) metadata.nextPage = page + 1;

//         const results: any = await queryResults;
//         if (!query) {
//             return res.status(200).json({ success: true, results, metadata });

//         }
//         // Set up Fuse options
//         const fuseOptions = {
//             keys: ["eventName", "eventDescription", "eventCategory.categoryName", "eventLocation", "price", "free"], // Fields to search
//             threshold: 0.4, // Adjust as needed
//         };

//         const fuse = new Fuse(results, fuseOptions);
//         const result = fuse.search(query);



//         return res.status(200).json({ success: true, result, metadata });

//     } catch (err) {
//         res.status(500).json({ success: false, error: 'Internal Server Error', err: err });

//     }
// };


const search = async (query: any, page = 1, perPage = 10) => {
    try {
        // Fetch events from the database and populate the eventCategory field
        const events = await Events.find({ eventType: "open" }).populate('eventCategory');
        if (!query) query = " ";

        // Set up Fuse options for searching
        const fuseOptions = {
            keys: ["eventName", "eventCategory", "categoryName", "eventDescription", "eventLocation", "price"],
            includeScore: true,
            threshold: 0.6 // Adjust this threshold based on your needs
        };

        // Initialize Fuse with the events and options
        const fuse = new Fuse(events, fuseOptions);

        // Perform the search
        const searchResult = fuse.search(query);

        // Calculate pagination parameters
        const totalResults = searchResult.length;
        const totalPages = Math.ceil(totalResults / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = Math.min(startIndex + perPage, totalResults);

        // Slice the search result based on pagination parameters
        const paginatedResult = searchResult.slice(startIndex, endIndex);

        // Format the result to remove Fuse.js score and return only the item
        const formattedResult = paginatedResult.map(({ item }) => item);

        // Metadata about the page
        const metadata = {
            currentPage: page,
            perPage,
            totalResults,
            totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        };

        return { results: formattedResult, metadata };
    } catch (error) {
        console.error("Error searching events:", error);
        throw error;
    }
};

const searchEvents = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query.query || "";
    const page = parseInt(req.query.page as string) | 1;
    const perPage = parseInt(req.query.perPage as string) | 10;

    try {
        const result = await search(query, page, perPage);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json();
    }


}

const markAttendance = async (req: Request, res: Response, next: NextFunction) => {

};

const getAttendance = async (req: Request, res: Response, next: NextFunction) => {

};

const isApplied = async (req: Request, res: Response, next: NextFunction) => {

};

const apply = async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json();
        }
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json();
        }
        const applied = await EventRegistered.findOne({ userId: req._id, eventId: id });
        if (applied) {
            return res.status(409).json();
        }
        if (event.participantsCount >= event.eventParticipationLimit) {
            return res.status(406).json();
        }

        const apply = new EventRegistered({
            userId: req._id,
            eventId: id,
        });
        await apply.save();

        return res.status(200).json();
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error", success: false,
            err: err
        });
    }
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