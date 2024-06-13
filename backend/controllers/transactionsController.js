const database = require("../database/db");
const csv = require("csv-parser");
const fs = require("fs");
const transactionsService = require("../services/transactionsService");

const createTransaction = (req, res) => {
    const { name, amount, description, type, category, date } = req.body;

    try {
        transactionsService.createTransaction(
            name,
            amount,
            description,
            type,
            category,
            date,
            req.auth.userId
        );
        res.status(201).json({ message: "Transaction created" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with transaction creation",
        });
    }
};

const importTransactions = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).send({ error: "No file uploaded" });

        // Parse CSV file
        const fileData = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (data) => fileData.push(data))
            .on("end", () => {
                // Create transactions from file data
                fileData.map(async (transaction) => {
                    const { Date, Name, Amount, Type, Category, Description } =
                        transaction;
                    const categoryId =
                        await database.category.getIdByNameOrValue(Category);
                    transactionsService.createTransaction(
                        Name,
                        Amount,
                        Description,
                        Type,
                        categoryId,
                        Date,
                        req.auth.userId
                    );
                });
                fs.unlinkSync(req.file.path);
                res.status(201).json({
                    message: "Transaction import completed",
                });
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with transaction import",
        });
    }
};

const getTenRecentTransactions = async (req, res) => {
    try {
        const transactions = await database.transaction.getRecent(
            req.auth.userId
        );
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting recent transactions",
        });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const type = req.query.type;
        const category = req.query.category;
        const period = req.query.period;

        const transactions = await database.transaction.getAllDynamically(
            req.auth.userId,
            type,
            category,
            period
        );
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting all transactions",
        });
    }
};

const updateTransaction = async (req, res) => {
    const { name, amount, description, type, category, date } = req.body;
    const userId = req.auth.userId;
    const id = req.params.id;

    try {
        await database.transaction.update(id, {
            name,
            amount,
            description,
            type,
            category,
            date,
            user_id: userId,
        });
        res.status(200).json({ message: "Transaction updated" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with updating transaction",
        });
    }
};

const getCategoryStats = async (req, res) => {
    const type = req.query.type;
    const period = req.query.period;
    const userId = req.auth.userId;

    let incomeTotal = 0;
    let expenseTotal = 0;

    try {
        // Get total income and expense amounts for the user
        if (type === "all" || type === "income") {
            incomeTotal = await database.transaction.getSumOfAmountsDynamically(
                userId,
                "income",
                period
            );
        }
        if (type === "all" || type === "expense") {
            expenseTotal =
                await database.transaction.getSumOfAmountsDynamically(
                    userId,
                    "expense",
                    period
                );
        }

        const categoryStats =
            await database.category.getTotalAmountPerCategoryDynamically(
                userId,
                type,
                period
            );
        const total = Number(incomeTotal) + Number(expenseTotal);

        // Calculate percentage of transaction amounts for each category
        const stats = categoryStats.map((category) => {
            let percentage = (category.total / total) * 100;
            percentage = percentage.toFixed(2);
            return {
                ...category,
                percentage,
            };
        });
        res.status(200).json({
            categoryStats: stats,
            incomeTotal,
            expenseTotal,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting category stats",
        });
    }
};

const getYears = async (req, res) => {
    try {
        const yearsData = await database.transaction.getYears(req.auth.userId);
        const years = yearsData.map((y) => ({
            label: y.year.toString(),
            value: y.year.toString(),
        }));
        res.status(200).json(years);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with getting transaction years",
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        await database.transaction.deleteById(id, req.auth.userId);
        res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with deleting transaction",
        });
    }
};

const processReceipt = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).send({ error: "No file uploaded" });

        const imageFile = fs.readFileSync(req.file.path);
        const imageBase64 = imageFile.toString('base64');

        await transactionsService.processReceipt(imageBase64, req.auth.userId);

        fs.unlinkSync(req.file.path);
        res.send({ message: "Receipt parsed successfully and a transaction was created" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with processing receipt",
        });
    }
}

module.exports = {
    createTransaction,
    importTransactions,
    getTenRecentTransactions,
    getAllTransactions,
    updateTransaction,
    getCategoryStats,
    getYears,
    deleteTransaction,
    processReceipt
};
