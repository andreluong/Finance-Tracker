const pool = require("./pool");

const getCountAndSumOfAmounts = async function (user_id, type) {
    const q = `
        SELECT
            COUNT(id) AS count,
            SUM(amount) AS total
        FROM
            transaction
        WHERE
            user_id = $1
            AND type = $2;    
    `;
    const res = await pool.query(q, [user_id, type]);
    return res.rows[0];
}

const getMonthlyTransactions = async function (user_id) {
    const q = `
        SELECT
            DATE_PART('month', date) AS month,
            DATE_PART('year', date) AS year,
            SUM(amount) AS total_amount,
            type
        FROM
            transaction
        WHERE
            user_id = $1
        GROUP BY
            DATE_PART('month', date),
            DATE_PART('year', date),
            type
        ORDER BY
            year,
            month;
    `;
    const res = await pool.query(q, [user_id]);
    return res.rows;
}

const getTotalIncomeAndExpenses = async function (user_id) {
    const q = `
        SELECT
            SUM(amount) AS total,
            type
        FROM
            transaction
        WHERE
            user_id = $1
        GROUP BY
            type;
    `;
    const res = await pool.query(q, [user_id]);
    return res.rows;
}

const getNumberOfTransactions = async function (user_id) {
    const q = `
        SELECT
            COUNT(id) AS count
        FROM
            transaction
        WHERE
            user_id = $1;
    `;
    const res = await pool.query(q, [user_id]);
    return res.rows[0].count;
}

module.exports = {
    getCountAndSumOfAmounts,
    getMonthlyTransactions,
    getTotalIncomeAndExpenses,
    getNumberOfTransactions,
};