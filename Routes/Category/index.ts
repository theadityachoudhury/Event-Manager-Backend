import express from "express";
import Auth from "../../Controllers/Auth";
import AuthValidator from "../../Validators/Auth";
import Category from "../../Controllers/Category";


const router = express.Router();

/**
 * Route for creating a category for events posting (adding a category).
 * Calls Category.createCategory controller to handle the ticket submission.
 */
router.post("/:categoryName", Category.createCategory);

/**
 * Route for deleting a category only possible by an admin account.
 * Requires token verification using Auth.verifytoken middleware.
 * Calls Category.deleteCategory controller to delete category.
 */
router.delete("/:categoryId", Auth.verifytoken as any, AuthValidator.isAdmin as any, Category.deleteCategory);

/**
 * Route for editing a category only possible by an admin account
 * Requires token verification using Auth.verifytoken middleware.
 * Calls Category.editCategory controller to edit the category.
 */
router.put("/:categoryId", Auth.verifytoken as any, AuthValidator.isAdmin as any, Category.editCategory);

/**
 * Route for getting all category informations
 * Calls Category.getCategory controller to get the category.
 */
router.get("/", Category.getCategory);

export default router;
