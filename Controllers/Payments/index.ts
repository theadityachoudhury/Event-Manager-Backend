import { NextFunction, Request, Response } from "express";
import Razorpay from "razorpay";
import config from "../../Config";
import EventRegistered from "../../Models/EventRegistered";
import Payments from "../../Models/Payments";
import Events from "../../Models/Events";


// Define a custom request interface with additional properties
interface customRequest extends Request {
    user_id: string;
    _id: string;
    token: String;
    email: String;
    role: String;
    verified: Boolean;
}


const paymentInstance = new Razorpay({
    key_id: config.RZRPAY_ID,
    key_secret: config.RZRPAY_SECRET
})

const createOrderEvent = async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const { amountToBePaid } = req.body;
        const { eventId } = req.params;
        if (!amountToBePaid || !eventId) {
            return res.status(404).json();
        }

        //Checking if the event even exist
        const event = await Events.findById(eventId);
        if (!event) {
            return res.status(400).json({ message: 'No associated event found' });
        }

        const applied = await EventRegistered.findOne({ eventId: eventId, userId: req._id });
        if (applied) {
            return res.status(409).json();
        }
        //Registering the user temporarily to the event
        const apply = new EventRegistered({ eventId: eventId, userId: req._id });

        //Creating an order to pay
        const options = {
            amount: Number(amountToBePaid * 100),
            currency: "INR",
            receipt: String(req.email)
        };

        const { id, amount, amount_paid, currency, receipt, status, attempts } = await paymentInstance.orders.create(options);

        // await apply.save();

        //Making a payment and connecting it to the user, event and registration Id

        const payment = new Payments({
            userId: req._id,
            eventId: eventId,
            registrationId: apply._id,
            amount: amount,
            amountPaid: amount_paid,
            status: status,
            paymentMethod: null,
            referenceNumber: id,
            currency: currency,
            receipt: receipt,
            attempts: attempts
        });
        // await payment.save();
        return res.status(200).json({ order_id: id, currency: currency, amount: amount });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            err: err
        })
    }

}



const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect("http://localhost:5173/success");
}

export default {
    createOrderEvent,
    verifyPayment,
}