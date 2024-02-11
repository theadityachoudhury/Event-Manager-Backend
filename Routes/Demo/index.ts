import express from "express";
import Auth from "../../Controllers/Auth";
import Demo from "../../Controllers/Demo";

const router = express.Router();

router.post("/", Auth.verifytoken as any, Demo.addItem as any);
router.get("/", Auth.verifytoken as any, Demo.getItem as any);

export default router;
