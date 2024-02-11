import express from "express";
import Auth from "../../Controllers/Auth";
import EventValidator from "../../Validators/Events";
import Events from "../../Controllers/Events";


const router = express.Router();

/**
 * Route for creating an event for events posting (adding an event).
 * Calls Category.createCategory controller to handle the ticket submission.
 */
router.post("/", Auth.verifytoken as any, Events.addEvents);
router.delete("/", Auth.verifytoken as any, EventValidator.isOwner as any, Events.deleteEvent);
router.get("/", Events.searchEvents);


export default router;
