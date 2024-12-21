const pool = require("./pool");

// Get monthly transaction data for user based on year and type
// If no transaction data is found, returns 0 and a null type
const getMonthlyTransactionData = async function (user_id, year, type) {
    const q = `
        WITH months AS (
            SELECT generate_series(1, 12) AS month
        )
        SELECT
            months.month,
            COALESCE(SUM(amount), 0) AS amount,
            type
        FROM
            months
        LEFT JOIN transaction ON months.month = DATE_PART('month', date)
            AND user_id = $1
            AND DATE_PART('year', date) = $2
            AND type = $3
        GROUP BY
            months.month,
            type
        ORDER BY
            months.month ASC;
    `;
    const res = await pool.query(q, [user_id, year, type]);
    return res.rows;
}

// Return total income and expense for user based on month and year
const getIncomeAndExpenseTotals = async function (user_id, month, year) {
    let q = `
        SELECT
            SUM(amount) AS total,
            type
        FROM
            transaction
        WHERE
            user_id = $1
            AND DATE_PART('year', date) = $2
    `;
    let params = [user_id, year];

    if (month !== "0") {
        q += ` AND DATE_PART('month', date) = $${params.length + 1}`;
        params.push(month);
    }

    q += ` GROUP BY type;`;

    const res = await pool.query(q, params);
    return res.rows;
}

// Returns the top 3 spending categories for user based on month and year
const getTopSpendingCategories = async function (user_id, month, year) {
    let q = `
        SELECT
            c.name,
            c.icon,
            c.colour,
            SUM(amount) AS total,
            COUNT(t.id) AS count
        FROM
            transaction t, category c
        WHERE
            t.category_id = c.id
            AND t.type = 'expense'
            AND user_id = $1
            AND DATE_PART('year', date) = $2
    `;
    let params = [user_id, year];

    if (month !== "0") {
        q += ` AND DATE_PART('month', date) = $${params.length + 1}`;
        params.push(month);
    }

    q += ` 
        GROUP BY
            c.name,
            c.icon,
            c.colour
        ORDER BY
            total DESC
        LIMIT 3;
    `;

    const res = await pool.query(q, params);
    return res.rows;
}

// Returns the top 3 spending categories for user based on month and year
const getFrequentSpendingCategories = async function (user_id, month, year) {
    let q = `
        SELECT
            c.name,
            c.icon,
            c.colour,
            SUM(amount) AS total,
            COUNT(t.id) AS count
        FROM
            transaction t, category c
        WHERE
            t.category_id = c.id
            AND t.type = 'expense'
            AND user_id = $1
            AND DATE_PART('year', date) = $2
    `;
    let params = [user_id, year];

    if (month !== "0") {
        q += ` AND DATE_PART('month', date) = $${params.length + 1}`;
        params.push(month);
    }

    q += ` 
        GROUP BY
            c.name,
            c.icon,
            c.colour
        ORDER BY
            count DESC,
            total DESC
        LIMIT 3;
    `;

    const res = await pool.query(q, params);
    return res.rows;
}

module.exports = {
    getMonthlyTransactionData,
    getIncomeAndExpenseTotals,
    getTopSpendingCategories,
    getFrequentSpendingCategories,
};