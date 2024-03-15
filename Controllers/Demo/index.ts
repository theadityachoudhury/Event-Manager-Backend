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
        const demo = await Demo.find({ employeeId: req._id }).populate("employeeId");
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

const getSocials = async (req: Request, res: Response) => {
    const { social } = req.query;
    const facebook = ["https://www.facebook.com/people/Bang-All/pfbid02VVLsGveuJQojF2iv4Jfsz6f8qT1dkUGwjQQqmByte3B3jMbdMD9iDGYk6ayaiSQrl/", "https://www.facebook.com/people/Momyy-All/pfbid0xTn9RN8bd7xFKgB6R75Kk4bao4RHsxyg6oEPBR9aYVqhPZaJDgHgshEN2UasCQcLl/", "https://www.facebook.com/people/All-Thin/pfbid0xtMLYxwtWYMSPGwnK7bat75ps7ML9zoQfyLH8NcyYcLN51hkDmhrtgFKTFwMMs5Gl/"];
    const instagram = ["https://www.instagram.com/the_aditya27/", "https://www.instagram.com/the_aditya27/", "https://www.instagram.com/the_aditya27/"];
    const youtube = ["https://www.youtube.com/watch?v=6Lt0VFP23cU&t=29s", "https://www.youtube.com/watch?v=6Lt0VFP23cU&t=29s", "https://www.youtube.com/watch?v=SMk5_ujn4xI&t=1s"];

    if (!social) {
        return res.status(200).json({ facebook, instagram, youtube });
    }

    if (social == "facebook") {
        return res.status(200).json({facebook});
    } else if (social == "instagram") {
        return res.status(200).json({instagram});
    } else if (social == "youtube") {
        return res.status(200).json({youtube});
    }

    return res.status(200).json();
}

export default {
    addItem,
    getItem,
    getSocials
}