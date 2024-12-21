const categoryQueries = require("../database/categoryQueries");
const { requestToKey, readCache, writeCache, handleRequest } = require("../database/redis");

const getAllCategories = async (req, res) => {
    try {
        const key = requestToKey(req);
        const cachedData = await readCache(key);
        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            const income = await categoryQueries.getAll("income");
            const expense = await categoryQueries.getAll("expense");
            const data = { income, expense };
            writeCache(key, data);

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
        handleRequest(req, res, categoryQueries.getAllUnique(type));
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
