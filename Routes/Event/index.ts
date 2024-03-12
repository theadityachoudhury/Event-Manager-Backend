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

router.post("/apply/:id", Auth.verifytoken as any, Events.apply as any);
router.get("/isApplied/:id", Auth.verifytoken as any, Events.isApplied as any);

router.post("/mark/:eventId/:userId", Auth.verifytoken as any, EventValidator.isOwner as any, Events.markAttendance);
router.get("/getAttendance/:id", Auth.verifytoken as any, EventValidator.isOwner as any, Events.getAttendance);
router.post("/mark/:id", Auth.verifytoken as any, EventValidator.isOwner as any, Events.markAttendanceBulk);
router.get("/registeredUsers/:id", Auth.verifytoken as any, EventValidator.isOwner as any, Events.registeredUser);

router.get("/:id", Events.viewEvent);

router.delete("/:id", Auth.verifytoken as any, EventValidator.isOwner as any, Events.deleteEvent);

export default router;
