import React from "react";
import DonutChart from "./donut-chart";
import { CategoryStat } from "@/app/types";
import useSWR from "swr";
import { fetcherWithToken } from "@/app/lib/utils";
import CategoryStatsTable from "./category-stats-table";
import { EXPENSES, INCOME } from "@/app/constants";
import { useAuth } from "@clerk/nextjs";
import Loader from "@/app/components/loader";

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

    if (error) throw error || new Error("An error occurred while fetching category stats and total");
    if (isLoading) return <Loader />;

    const calculateNetTotal = (income: number, expense: number) => Number(income - expense).toFixed(2);

    const determineNetTotalLabel = (type: string, netTotal: string) => {
        return type === "all"
            ? "Net Income"
            : Number(netTotal) >= 0
                ? "Income Total"
                : "Expense Total";
    };

    const { categoryStats, incomeTotal, expenseTotal } = data;

    let series: number[] = [];
    let colours: string[] = [];
    let labels: string[] = [];
    let netTotal = calculateNetTotal(incomeTotal, expenseTotal);
    let netTotalLabel = determineNetTotalLabel(type, netTotal);

    if (type === "all") {
        // Show only income and expenses
        series = [Number(incomeTotal), Number(expenseTotal)];
        colours = [INCOME.colour, EXPENSES.colour];
        labels = [INCOME.value, EXPENSES.value];
    } else {
        // Show all categories
        categoryStats.forEach((category: CategoryStat) => {
            series.push(Number(category.total));
            colours.push(category.colour);
            labels.push(category.name);
        });
        netTotal = type === "expense" ? expenseTotal : incomeTotal;
    }

    // Unique key based on total to force a re-render when total changes
    const chartKey = `donut-chart-${netTotal}`

    return (
        <>
            <div className="flex items-center justify-center w-3/5">
                <DonutChart
                    key={chartKey}
                    series={series}
                    colours={colours}
                    labels={labels}
                    total={netTotal}
                    totalLabel={netTotalLabel}
                />
            </div>
            <div className="w-2/5">
                <CategoryStatsTable categoryStats={categoryStats} />
            </div>
        </>
    );
}
