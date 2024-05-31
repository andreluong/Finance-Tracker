import React from "react";
import DonutChart from "./donut-chart";
import { CategoryStat } from "@/app/types";
import useSWR from "swr";
import { fetcherWithToken } from "@/app/lib/utils";
import CategoryStatsTable from "./category-stats-table";
import { EXPENSES, INCOME } from "@/app/constants";
import { useAuth } from "@clerk/nextjs";

export default function CategoryStats({
    type,
    period
}: {
    type: string;
    period: string;
}) {
    const { getToken } = useAuth();

    const {
        data,
        error,
        isLoading,
    } = useSWR(
        `http://localhost:8080/api/transactions/category/stats?type=${type}&period=${period}`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    if (error) {
        return <div>Error loading category stats and total</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log(data)
    const { categoryStats, incomeTotal, expenseTotal } = data;
    let series: number[] = [];
    let colours: string[] = [];
    let labels: string[] = [];
    let netTotal = Number(incomeTotal - expenseTotal).toFixed(2);
    let netTotalLabel = "";

    if (type === "all") {
        series = [Number(incomeTotal), Number(expenseTotal)];
        colours = [INCOME.colour, EXPENSES.colour];
        labels = [INCOME.value, EXPENSES.value];
        netTotalLabel = netTotal >= "0" ? "Net Income" : "Net Loss";
    } else {
        categoryStats.forEach((category: CategoryStat) => {
            series.push(Number(category.total));
            colours.push(category.colour);
            labels.push(category.name);
        });
        netTotal = type === "expense" ? expenseTotal : incomeTotal;
        netTotalLabel = netTotal >= "0" ? "Income Total" : "Expense Total";
    }

    // Unique key based on total to force a re-render when total changes
    const chartKey = `donut-chart-${netTotal}`

    return (
        <>
            <div className="flex items-center justify-center w-1/2">
                <DonutChart
                    key={chartKey}
                    series={series}
                    colours={colours}
                    labels={labels}
                    total={netTotal}
                    totalLabel={netTotalLabel}
                />
            </div>
            <div className="w-1/2">
                <CategoryStatsTable categoryStats={categoryStats} />
            </div>
        </>
    );
}
