const database = require("../database/db");
const transactionsService = require("../services/transactionsService");
const fastCsv = require("@fast-csv/parse");
const { isEmpty } = require("../services/utils");

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

const processCsv = async (req, res) => {
    if (!req.file)
        return res.status(400).send({ error: "No file uploaded" });

    const fileName = await transactionsService.uploadToBucket(req.file);

    try {
        const csvData = req.file.buffer.toString("utf8");
        
        // Check headers are formatted correctly
        const expectedHeaders = ["Date", "Name", "Amount", "Type", "Category", "Description"];
        if (!expectedHeaders.every((header) => csvData.includes(header))) {
            throw new Error("Invalid CSV file");
        }
        
        const parsedData = fastCsv.parseString(csvData, { headers: true });
        await parsedData.forEach(async (transactionRow) => {
            const { Date, Name, Amount, Type, Category, Description } = transactionRow;

            if (isEmpty(Date) || isEmpty(Name) || isEmpty(Amount) || isEmpty(Type) || isEmpty(Category)) {
                throw new Error("Invalid data from CSV file");
            }

            const categoryId = await database.category.getIdByNameOrValue(Category);
            await transactionsService.createTransaction(
                Name,
                Amount,
                Description,
                Type,
                categoryId,
                Date,
                req.auth.userId
            );
        });

        await transactionsService.deleteFromBucket(fileName);

        res.status(201).json({ message: "Transaction import completed" });
    } catch (error) {
        await transactionsService.deleteFromBucket(fileName);
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with transaction import",
        });
    }
};

const getRecentTransactions = async (req, res) => {
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
        const transactions = await database.transaction.getAllDynamically(
            req.auth.userId,
            req.query.period
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
    if (!req.file)
        return res.status(400).send({ error: "No file uploaded" });

    const fileName = await transactionsService.uploadToBucket(req.file);

    try {
        const imageBase64 = req.file.buffer.toString('base64');
        await transactionsService.processReceipt(imageBase64, req.auth.userId);

        await transactionsService.deleteFromBucket(fileName);

        res.status(201).json({ message: "Receipt parsed successfully and a transaction was created" });
    } catch (error) {
        await transactionsService.deleteFromBucket(fileName);
        console.error(error.message);
        res.status(500).json({
            error: "Something went wrong with processing receipt",
        });
    }
}

module.exports = {
    createTransaction,
    processCsv,
    getRecentTransactions,
    getAllTransactions,
    updateTransaction,
    getCategoryStats,
    getYears,
    deleteTransaction,
    processReceipt
};
