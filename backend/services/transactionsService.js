const database = require("../database/db");

async function createTransaction(
    name,
    amount,
    description,
    type,
    category,
    date,
    user_id
) {
    try {
        await database.transaction.create({
            name,
            amount,
            description,
            type,
            category,
            date,
            user_id,
        });
    } catch (error) {
        console.error(error.message);
        throw new Error("Error creating transaction");
    }
}

module.exports = {
    createTransaction,
};
