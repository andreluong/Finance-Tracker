const database = require('../database/db');

const getIncomeAndExpenseStats = async (req, res) => {
    try {
        const incomeStats = await database.statistics.getCountAndSumOfAmounts(req.auth.userId, "income");
        const expenseStats = await database.statistics.getCountAndSumOfAmounts(req.auth.userId, "expense");

        const incomeCategoryStats = await database.category.getTotalAmountPerCategoryDynamically(req.auth.userId, "income", null);
        const expenseCategoryStats = await database.category.getTotalAmountPerCategoryDynamically(req.auth.userId, "expense", null);

        return res.status(200).json({
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
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong with getting income and expense stats for statistics' });
    }
}

module.exports = {
    getIncomeAndExpenseStats
};