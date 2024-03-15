import { Request, Response } from "express";
import DemoValidator from "../../Validators/Demo";
import Demo from "../../Models/Demo";

// Define a custom request interface with additional properties
interface customRequest extends Request {
    user_id: string;
    _id: string;
    token: String;
    email: String;
    role: String;
    verified: Boolean;
}

const addItem = async (req: customRequest, res: Response) => {
    try {
        const validatedData = await DemoValidator.demoSchema.validateAsync(req.body);
        const itemData = new Demo({
            ...validatedData,
            employeeId: req._id
        });
        await itemData.save();
        return res.status(201).json({
            message: "Data created Successfully!!",
            success: true
        });
    } catch (err: any) {
        console.log(err)
        let errorMsg = "Internal Server Error";
        if (err.isJoi === true) {
            err.status = 404;
            errorMsg = err.message;
        }
        return res.status(err.status || 500).json({
            reason: "server",
            message: errorMsg,
            success: false,
        });
    }
}

const getItem = async (req: customRequest, res: Response) => {
    try {
        const demo = await Demo.find({employeeId:req._id}).populate("employeeId");
        console.log(demo);
        return res.status(200).json(demo);
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error!!",
            err: err,
            success: false
        });
    }
}

export default {
    addItem,
    getItem
}