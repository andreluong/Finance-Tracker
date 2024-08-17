const database = require("../database/db");
const { requestToKey, readCache, writeCache } = require("../database/redis");

const getMonthlyTransactionData = async (req, res) => {
    const { year } = req.query;

    try {
        const key = requestToKey(req);
        const cachedData = await readCache(key);

        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            const userId = req.auth.userId;

            const incomeData = await database.overview.getMonthlyTransactionData(userId, year, "income");
            const expensesData = await database.overview.getMonthlyTransactionData(userId, year, "expense");
            const incomeAvg = await incomeData.reduce((acc, curr) => acc + Number(curr.amount), 0) / incomeData.length;
            const expensesAvg = await expensesData.reduce((acc, curr) => acc + Number(curr.amount), 0) / expensesData.length;

            const data = { 
                income: {
                    monthlyTransactions: incomeData,
                    avg: incomeAvg.toFixed(2)
                },
                expenses: {
                    monthlyTransactions: expensesData,
                    avg: expensesAvg.toFixed(2)
                }
            };
            writeCache(key, data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Something went wrong with getting monthly transaction data",
        });
    }
};

const getSummary = async (req, res) => {
    const { month, year } = req.query;

    try {
        if (!month || !year) throw new Error("Month and year are required");

        const key = requestToKey(req);
        const cachedData = await readCache(key);

        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            // Get income and expense totals for the month and year
            const totals = await database.overview.getIncomeAndExpenseTotals(
                req.auth.userId,
                month,
                year
            );

            let income = totals.find((item) => item.type === "income")?.total || 0;
            let expense = totals.find((item) => item.type === "expense")?.total || 0;
            income = Number(income).toFixed(2);
            expense = Number(expense).toFixed(2);
            const netIncome = (income - expense).toFixed(2);

            const finances = { income, expense, netIncome };

            // Get top spending categories
            const topSpendingCategories =
                await database.overview.getTopSpendingCategories(
                    req.auth.userId,
                    month,
                    year
                );

            // Get frequent spending categories
            const frequentSpendingCategories =
                await database.overview.getFrequentSpendingCategories(
                    req.auth.userId,
                    month,
                    year
                );

            const data = { finances, topSpendingCategories, frequentSpendingCategories };
            writeCache(key, data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Something went wrong with getting financial summary",
        });
    }
};

module.exports = {
    getMonthlyTransactionData,
    getSummary,
};
