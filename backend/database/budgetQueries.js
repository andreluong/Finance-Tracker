const pool = require("./pool");

// Create budget table for month and year
const createBudgetTable = async function (user_id, month, year) {
    const q = `
        INSERT INTO budget (year, month, user_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const res = await pool.query(q, [year, month, user_id]);
    return res.rows[0].id;
}

// Get id of budget table for month and year
const getBudgetTable = async function (user_id, month, year) {
    const q = `
        SELECT
            id
        FROM
            budget
        WHERE
            user_id = $1
            AND month = $2
            AND year = $3;
    `;
    const res = await pool.query(q, [user_id, month, year]);
    return res.rows[0]?.id || null;
}

// Get budget targets for each category based on month and year
const getBudgetTargets = async function (user_id, month, year) {
    const q = `
        SELECT
            c.name as category_name,
            c.id as category_id,
            c.type as category_type,
            bi.target as target
        FROM
            category c
            INNER JOIN budget b ON b.user_id = $1
                AND b.month = $2
                AND b.year = $3
            INNER JOIN budget_item bi ON bi.budget_id = b.id
                AND bi.category_id = c.id;
    `;
    const res = await pool.query(q, [user_id, month, year]);
    return res.rows;
}

// Get total amount of budget target for each type based on month and year
const getBudgetTargetsTotalAmount = async function (user_id, month, year) {
    const q = `
        SELECT
            c.type,
            COALESCE(SUM(bi.target), 0) as total_target
        FROM
            category c
            INNER JOIN budget b ON b.user_id = $1
                AND b.month = $2
                AND b.year = $3
            INNER JOIN budget_item bi ON bi.budget_id = b.id
                AND bi.category_id = c.id
        GROUP by
            c.type;
    `;
    const res = await pool.query(q, [user_id, month, year]);
    return res.rows;
}

// Return all categories with optional amount and budget-targets based on month and year
const getBudgetData = async function (user_id, month, year) {
    const q = `
        SELECT
            $3 AS year,
            $2 AS month,
            c.name,
            c.id,
            COALESCE(SUM(t.amount), 0) AS total,
            COALESCE(bi.target, 0) AS target,
            c.type
        FROM
            category c
            LEFT JOIN transaction t ON c.id = t.category_id
                AND t.user_id = $1
                AND DATE_PART('month', t.date) = $2
                AND DATE_PART('year', t.date) = $3
            LEFT JOIN budget b ON b.user_id = $1
                AND b.month = $2
                AND b.year = $3
            LEFT JOIN budget_item bi ON bi.budget_id = b.id
                AND bi.category_id = c.id
        GROUP BY
            c.name,
            c.id,
            bi.target,
            c.type;
    `;
    const res = await pool.query(q, [user_id, month, year]);
    return res.rows;
}

// Update budget items data
const updateBudgetItems = async function (user_id, budget_id, data) {
    const q = `
        INSERT INTO budget_item (budget_id, category_id, target, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (budget_id, category_id, user_id)
        DO UPDATE SET target = EXCLUDED.target;
    `;
    for (const key in data) {
        if (data[key] === 0) continue;
        await pool.query(q, [budget_id, key, data[key], user_id]);
    }
}

module.exports = {
    createBudgetTable,
    getBudgetTable,
    getBudgetTargets,
    getBudgetTargetsTotalAmount,
    getBudgetData,
    updateBudgetItems,
};