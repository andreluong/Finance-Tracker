function getDateForQuery(period, params) {
    let yearQuery = "";
    let yearPeriod = null;

    if (period && period !== "allTime") {
        if (period === "last7Days") {
            yearQuery = ` AND date >= current_date - INTERVAL '7 day' AND date <= current_date`;
        } else if (period === "last30Days") {
            yearQuery = ` AND date >= current_date - INTERVAL '30 day' AND date <= current_date`;
        } else {
            yearQuery = ` AND date_trunc('year', date) = $${params.length + 1}`;
            yearPeriod = new Date(period).toISOString();
        }
    }

    return { yearQuery, yearPeriod };
}

module.exports = {
    getDateForQuery,
};
