import consola from "consola";
import mongoose from "mongoose";
import Config from "../Config";
import makeMigrations from "../dbUpdates";

export async function connectToDB() {
    try {
        consola.start({
            message: "Connecting to" + Config.DB,
            badge: true,
        });
        await mongoose.connect(Config.DB, {
            serverSelectionTimeoutMS: Config.REQUEST_TIMEOUT,
            writeConcern: { w: "majority" },
        });
        consola.success({
            message: `Suceessfully connected to the DB`,
            badge: true,
        });
        consola.info({
            message: `Starting Migrations`,
            badge: true
        })
        await makeMigrations();

    } catch (err) {
        console.error({
            message: `Error connecting to the DB ${err}`,
            badge: true,
        });
        await connectToDB();
    }
}