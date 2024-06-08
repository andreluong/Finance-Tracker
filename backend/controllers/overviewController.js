const database = require("../database/db");

const getMonthlyTransactionData = async (req, res) => {
    const { year } = req.query;

    try {
        const data = await database.overview.getMonthlyTransactionData(
            req.auth.userId,
            year
        );
        res.status(200).json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message:
                "Something went wrong with getting monthly transaction data",
        });
    }
};

const getSummary = async (req, res) => {
    const { month, year } = req.query;

    try {
        // Get income and expense totals for the month and year
        const data = await database.overview.getIncomeAndExpenseTotals(
            req.auth.userId,
            month,
            year
        );

        let income = data.find((item) => item.type === "income")?.total || 0;
        let expense = data.find((item) => item.type === "expense")?.total || 0;
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

        res.status(200).json({
            finances,
            topSpendingCategories,
            frequentSpendingCategories,
        });
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
