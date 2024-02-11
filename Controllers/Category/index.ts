import { NextFunction, Request, Response } from "express";
import Category from "../../Models/Category";

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryName } = req.params;
        if (!categoryName) {
            return res.status(404).json();
        }

        const category = new Category({
            categoryName: categoryName
        });
        await category.save();
        return res.status(200).json();
    } catch (err) {
        return res.status(500).json({ messgae: "Internal Server Error" });
    }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(404).json();
        }

        const category = await Category.findByIdAndDelete(categoryId);
        return res.status(200).json();
    } catch (err) {
        return res.status(500).json({ messgae: "Internal Server Error" });
    }
};

const editCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        const { categoryName } = req.body;
        if (!categoryId) {
            return res.status(404).json();
        }

        if (!categoryName) {
            return res.status(500).json();
        }

        const category = await Category.findByIdAndUpdate(categoryId, { categoryName: categoryName });
        return res.status(200).json();
    } catch (err) {
        return res.status(500).json({ messgae: "Internal Server Error" });
    }

};
const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Category.find().select("categoryName");
        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({ messgae: "Internal Server Error" });
    }

};

export default {
    createCategory,
    deleteCategory,
    editCategory,
    getCategory
}