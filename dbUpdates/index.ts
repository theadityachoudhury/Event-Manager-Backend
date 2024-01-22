import consola from "consola";

import mongoose from "mongoose";

import User from "../Models/Users";

/**
 * Updates existing user documents by adding a 'face' field with a default value of false.
 *
 * @returns {Promise<void>} A Promise that resolves when the update operation is complete.
 */
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
        return;
    }
}

/**
 * Initiates database migrations, including updating existing user documents.
 *
 * @returns {Promise<void>} A Promise that resolves when the migration process is complete.
 */
const makeMigrations = async () => {
    await updateExistingUserDocuments();
    consola.info({
        message: `Successfully Migrated User Schema`,
        badge: true
    })
    return;
}

export default makeMigrations;
