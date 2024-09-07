const database = require("../database/db");
const { requestToKey, readCache, writeCache, deleteCache, handleRequest } = require("../database/redis");

const getBudgetTotals = async (req, res) => {
    const { month, year } = req.query;

    try {
        handleRequest(req, res, database.budget.getBudgetTotals(req.auth.userId, month, year));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting all budget data",
        });
    }
};

const getBudgetTargets = async (req, res) => {
    const { month, year } = req.query;
    const userId = req.auth.userId;

    try {
        const key = requestToKey(req);
        const cachedData = await readCache(key);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        } else {
            const budgetTargets = await database.budget.getBudgetTargets(userId, month, year);
            const targetTotals = await database.budget.getBudgetTargetsTotalAmount(userId, month, year);
            const data = {
                categories: budgetTargets,
                income: targetTotals.find((item) => item.type === "income"),
                expense: targetTotals.find((item) => item.type === "expense"),
            };

            writeCache(key, data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting all budget data",
        });
    }
};

const modifyBudgetData = async (req, res) => {
    const { month, year } = req.query;
    const data = req.body;
    const userId = req.auth.userId;

    try {
        // Convert data values to integers
        Object.keys(data).map((key) => parseInt(data[key]));

        // Get or create budget table for the given month and year
        const budgetId = await database.budget.getBudgetTable(userId, month, year)
            || await database.budget.createBudgetTable(userId, month, year);
        
        await database.budget.updateBudgetItems(userId, budgetId, data);

        deleteCache(userId, "budget");

        res.status(200).json({ message: "Budget data modified" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with creating or updating budget data",
        });
    }
};

module.exports = {
    getBudgetTotals,
    getBudgetTargets,
    modifyBudgetData
};