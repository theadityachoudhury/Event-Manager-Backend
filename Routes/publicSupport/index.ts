import express from "express";
import Auth from "../../Controllers/Auth";
import AuthValidator from "../../Validators/Auth";
import publicSupport from "../../Controllers/publicSupport";

const router = express.Router();

router.post("/contact", publicSupport.addTicket);
router.get("/contact", Auth.verifytoken as any, publicSupport.getTickets);
router.get("contact/:id",);




export default router;
