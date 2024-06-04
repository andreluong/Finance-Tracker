const database = require('../database/db');

const getMonthlyTransactionData = async (req, res) => {
    try {
        const data = await database.overview.getMonthlyTransactionData(req.auth.userId);
        res.status(200).json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Something went wrong with getting monthly transaction data"});
    }
};

const getMonthlyTopSpendingCategories = async (req, res) => {
    try {
        const data = await database.overview.getMonthlyTopSpendingCategories(req.auth.userId);
        res.status(200).json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Something went wrong with getting monthly top spending categories"});
    }
};

const getMonthlyFrequentSpendingCategories = async (req, res) => {
    try {
        const data = await database.overview.getMonthlyFrequentSpendingCategories(req.auth.userId);
        res.status(200).json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Something went wrong with getting monthly frequent spending categories"});
    }
};

const getMonthlyIncomeAndExpense = async (req, res) => {
    try {
        const data = await database.overview.getMonthlyIncomeAndExpense(req.auth.userId);
        
        let income = data.find((item) => item.type === 'income')?.total || 0;
        let expense = data.find((item) => item.type === 'expense')?.total || 0;
        income = Number(income).toFixed(2);
        expense = Number(expense).toFixed(2);
        const netIncome = (income - expense).toFixed(2);

        res.status(200).json({income, expense, netIncome});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Something went wrong with getting monthly income and expense"});
    }
};


module.exports = {
    getMonthlyTransactionData,
    getMonthlyTopSpendingCategories,
    getMonthlyFrequentSpendingCategories,
    getMonthlyIncomeAndExpense
};