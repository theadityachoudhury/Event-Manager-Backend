import { connectToDB } from "./connectToDB";
import Config from "../Config";
import consola from "consola";

/**
 * Starts the Express server by connecting to the database and listening on the specified port.
 *
 * @param app - Express application instance.
 */
export const startServer = async (app: any) => {
    // Connect to the MongoDB database
    await connectToDB();

    // Set the server port
    const port = Config.PORT || 5000;

    // Start listening on the specified port
    app.listen(port, () => {
        consola.success({
            message: `Server is running at http://localhost:${port}`,
            badge: true,
        });
    });
};
