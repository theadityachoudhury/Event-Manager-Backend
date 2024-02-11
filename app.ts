import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { startServer } from "./Utils";
import Auth from "./Routes/Auth";
import publicSupport from "./Routes/publicSupport";
import Event from "./Routes/Event";
import Category from "./Routes/Category";
import cookieParser from "cookie-parser";
import Config from "./Config";
import path from "path";

// Server Initialization
const app = express();

const corsOrigin: string = Config.ORIGIN as string;

/**
 * Configure and initialize the Express server.
 */
app.use(
    cors({
        credentials: true,
        origin: [corsOrigin],
    })
);
app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve the 'public' folder under the '/public' endpoint
const publicFolderPath = path.join(__dirname, "public");
app.use("/public", express.static("./public"));

// API routes start here

/**
 * Default middleware for handling CORS headers.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", corsOrigin);
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Default route providing information about the server.
 */
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send({
        data: {
            appName: "Starter Pack | Backend",
            developedBy: "Aditya Choudhury",
            maintainedBy: "Aditya Choudhury",
            version: "1.0.0.0",
        },
        success: true,
    });
});

/**
 * Health check API endpoint to verify if the server is up and running.
 */
app.get("/health", (req: Request, res: Response) => {
    return res.status(200).json({
        status: 200,
        message: "Server is up and running"
    });
});

// App Routes
/**
 * Authentication API routes.
 */
app.use("/api/auth", Auth);

/**
 * Public support API routes.
 */
app.use("/api/pr", publicSupport);


/**
 * Events API routes.
 */
app.use("/api/event", Event);


/**
 * Category API routes.
 */
app.use("/api/category", Category);

// Default not-found route
/**
 * Default middleware for handling not-found routes.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    res.send({
        reason: "invalid-request",
        message:
            "The endpoint you want to reach is not available! Please check the endpoint again",
        success: false,
    });
});

/**
 * Start the Express server.
 */
startServer(app);
