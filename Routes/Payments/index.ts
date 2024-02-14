import express from "express";
import Auth from "../../Controllers/Auth";
import Payments from "../../Controllers/Payments";


const router = express.Router();

/**
 * Route for creating an event for events posting (adding an event).
 * Calls Category.createCategory controller to handle the ticket submission.
 */
router.post("/webhook/eventpayment",Payments.verifyPayment);
router.post("/:eventId", Auth.verifytoken as any, Payments.createOrderEvent as any);


export default router;
