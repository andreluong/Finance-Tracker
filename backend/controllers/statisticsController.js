const database = require("../database/db");
const { requestToKey, readCache, writeCache } = require("../database/redis");

const getIncomeAndExpenseStats = async (req, res) => {
    try {
        const key = requestToKey(req);
        const cachedData = await readCache(key);

        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            const incomeStats = await database.statistics.getCountAndSumOfAmounts(
                req.auth.userId,
                "income"
            );
            const expenseStats = await database.statistics.getCountAndSumOfAmounts(
                req.auth.userId,
                "expense"
            );
    
            const incomeCategoryStats =
                await database.category.getTotalAmountPerCategoryDynamically(
                    req.auth.userId,
                    "income",
                    null
                );
            const expenseCategoryStats =
                await database.category.getTotalAmountPerCategoryDynamically(
                    req.auth.userId,
                    "expense",
                    null
                );
    
            const data = {
                income: {
                    count: incomeStats.count,
                    total: incomeStats.total,
                    categories: incomeCategoryStats,
                },
                expense: {
                    count: expenseStats.count,
                    total: expenseStats.total,
                    categories: expenseCategoryStats,
                }
            };
            writeCache(key, data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong with getting income and expense stats for statistics",
        });
    }
};

const getPerMonthData = async (req, res) => {
    try {
        const key = requestToKey(req);
        const cachedData = await readCache(key);

        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            const userId = req.auth.userId;

            const monthlyTransactions = await database.statistics.getMonthlyTransactions(
                userId
            );

            // Total income and expenses
            const totalIncomeAndExpenses = await database.statistics.getTotalIncomeAndExpenses(
                userId
            );
            const totalIncome = totalIncomeAndExpenses[0];
            const totalExpenses = totalIncomeAndExpenses[1];

            // Number of transactions
            const numTransactions = await database.statistics.getNumberOfTransactions(
                userId
            );

            const data = {
                monthlyTransactions, 
                totalIncome, 
                totalExpenses, 
                numTransactions
            };
            writeCache(key, data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong with getting monthly transactions for statistics",
        });
    }
}

const getCategoryData = async (req, res) => {
    try {
        const key = requestToKey(req);
        const cachedData = await readCache(key);

        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            const userId = req.auth.userId;

            const incomeCategoryStats =
                await database.category.getTotalAmountPerCategoryDynamically(
                    userId,
                    "income",
                    null
                );
            const expenseCategoryStats =
                await database.category.getTotalAmountPerCategoryDynamically(
                    userId,
                    "expense",
                    null
                );
    
            const data = {
                income: incomeCategoryStats,
                expense: expenseCategoryStats
            };
            writeCache(key, data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong with getting category data for statistics",
        });
    }
}

module.exports = {
    getIncomeAndExpenseStats,
    getPerMonthData,
    getCategoryData
};
