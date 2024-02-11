import express from "express";
import Auth from "../../Controllers/Auth";
import AuthValidator from "../../Validators/Auth";
import publicSupport from "../../Controllers/publicSupport";

const router = express.Router();

/**
 * Route for submitting a contact form (adding a ticket).
 * Calls publicSupport.addTicket controller to handle the ticket submission.
 */
router.post("/contact", publicSupport.addTicket);

/**
 * Route for retrieving contact form submissions (tickets).
 * Requires token verification using Auth.verifytoken middleware.
 * Calls publicSupport.getTickets controller to retrieve tickets.
 */
router.get("/contact", Auth.verifytoken as any, AuthValidator.isAdmin as any, publicSupport.getTickets);

/**
 * Placeholder route for retrieving a specific contact form submission (ticket) by its ID.
 * Needs to be implemented with a corresponding controller function.
 */
router.get("/contact/:id", /* controller function to be added */);

export default router;
