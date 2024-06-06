const database = require('../database/db');

const getAllCategories = (async (req, res) => {
    try {
        const income = await database.category.getAllDynamically("income");
        const expense = await database.category.getAllDynamically("expense");
        res.status(200).json({income, expense});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with getting all categories"});
    }
});

const getAllUniqueCategories = (async (req, res) => {
    const type = req.query.type;

    try {
        const categories = await database.category.getAllUniqueDynamically(type);
        res.status(200).json(categories);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with getting all unique categories"});
    }
});

module.exports = {
    getAllCategories,
    getAllUniqueCategories
};