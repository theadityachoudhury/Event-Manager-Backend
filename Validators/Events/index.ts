import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import Events from "../../Models/Events";
interface customRequest extends Request {
  user_id: string;
  _id: string;
  token: String;
  email: String;
  role: String;
  verified: Boolean;
}

/**
 * Defines a Joi schema for validating event data. This schema is used to ensure
 * that new events adhere to specific requirements before being stored in the database.
 *
 * @property {string} eventName       Required - The name of the event.
 * @property {string} eventDescription Required - A description of the event.
 * @property {string} eventCategory   Required - The category of the event.
 * @property {string} eventLocation   Required - The location of the event.
 * @property {Date}   eventStartDate  Required - The starting date of the event.
 * @property {Date}   eventEndDate    Required - The ending date of the event.
 * @property {string} eventURL        Optional - The URL of the event website.
 * @property {boolean} eventImageUploaded Optional - Indicates if an event image is uploaded.
 * @property {string} eventOwner       Required - The owner of the event.
 * @property {string} ownerId         Required - The ID of the event owner.
 * @property {number} price           Required - The price of the event (0 for free).
 * @property {boolean} free           Required - Indicates if the event is free.
 * @property {string} eventType       Required - The type of the event (open or closed).
 * @property {number} eventParticipationLimit Required - The maximum number of participants.
 * @property {boolean} eventAttendanceRequired Required - Indicates if attendance is required.
 */
const eventsSchema = Joi.object({
  eventName: Joi.string().required(),
  eventDescription: Joi.string().required(),
  eventCategory: Joi.string().required(),
  eventLocation: Joi.string().required(),
  eventStartDate: Joi.date().required(),
  eventEndDate: Joi.date().required(),
  eventURL: Joi.string().allow(''), // Allow empty string for optional field
  eventImageUploaded: Joi.boolean(),
  eventOwner: Joi.string().required(),
  ownerId: Joi.string().required(), // Assuming ObjectId is stored as a string
  price: Joi.number().required(),
  free: Joi.boolean().required(),
  eventType: Joi.string().valid('open', 'closed').required(), // Enforce enum values
  eventParticipationLimit: Joi.number().required().default(100),
  eventAttendanceRequired: Joi.boolean().required().default(false),
});

const isOwner = async (req: customRequest, res: Response, next: NextFunction) => {
  try {
    if (req.role === "admin") {
      next();
    }
    else {
      const event = await Events.findById(req.params.id).select("ownerId");
      if (!event) {
        return res.status(404).json({ message: "No event found with this ID!!" });
      }
      if (event.ownerId.toString() === req._id) {
        next();
      } else {
        return res.status(403).json({ message: "You are not authorized to manage this event!! If this is a mistake please contact the administrator or contact tech support!!" });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error!!" });
  }
}

export default {
  /**
* The Joi schema for validating event data.
*
* Refer to the {@link eventsSchema} documentation for detailed field descriptions.
*/
  eventsSchema,
  isOwner
}