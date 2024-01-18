import consola from "consola";

import mongoose from "mongoose";

import User from "../Models/Users";
async function updateExistingUserDocuments() {
    try {
        const result: any = await User.updateMany(
            { face: { $exists: false } }, // Update only documents that don't have the 'face' field
            { $set: { face: false } } // Set the default value for the 'face' field
        );

        console.log(`${result.nModified} documents updated`);
    } catch (error) {
        console.error('Error updating documents:', error);
    } finally {
        mongoose.connection.close();
    }
}


const makeMigrations = async () => {
    await updateExistingUserDocuments();
    consola.info({
        message: `Successfully Migrated User Schema`,
        badge: true
    })
}

export default makeMigrations;