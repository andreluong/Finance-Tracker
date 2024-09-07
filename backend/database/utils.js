function getDateForQuery(period, params) {
    let yearQuery = "";
    let yearPeriod = null;

    if (period && period !== "allTime") {
        if (period.match(/^\d{1,2}-\d{4}$/)) {
            const [month, year] = period.split("-");
            yearQuery =  ` AND DATE_PART('month', date) = ${month} AND DATE_PART('year', date) = ${year}`;
        } else if (period === "last7Days") {
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
    getDateForQuery
};
