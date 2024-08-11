const database = require("../database/db");
const { requestToKey, readCache, writeCache, handleRequest } = require("../database/redis");

const getAllCategories = async (req, res) => {
    try {
        const key = requestToKey(req);
        const cachedData = await readCache(key);
        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            const income = await database.category.getAllDynamically("income");
            const expense = await database.category.getAllDynamically("expense");
            const categories = { income, expense };
            writeCache(key, categories);

            res.status(200).json(data);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting all categories",
        });
    }
};

const getAllUniqueCategories = async (req, res) => {
    const type = req.query.type;

    try {
        handleRequest(req, res, database.category.getAllUniqueDynamically(type));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting all unique categories",
        });
    }
};

module.exports = {
    getAllCategories,
    getAllUniqueCategories,
};
