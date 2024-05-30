import React from "react";
import DonutChart from "./donut-chart";
import { CategoryStat } from "@/app/types";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import CategoryStatsTable from "./category-stats-table";
import { EXPENSES, INCOME } from "@/app/constants";

export default function CategoryStats({
    type,
    period,
    user_id,
}: {
    type: string;
    period: string;
    user_id: string;
}) {
    const {
        data,
        error,
        isLoading,
    } = useSWR(
        `http://localhost:8080/api/transactions/category/stats/${user_id}?type=${type}&period=${period}`,
        fetcher
    );

    if (error) {
        return <div>Error loading category stats and total</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const { categoryStats, total } = data;
    let series: number[] = [];
    let colours: string[] = [];
    let labels: string[] = [];

    if (type === "all") {
        let income = 0;
        let expenses = 0;

        categoryStats.forEach((category: CategoryStat) => {
            if (category.type === "income") {
                income += Number(category.total);
            } else {
                expenses += Number(category.total);
            }
        });
        series = [income, expenses];
        colours = [INCOME.colour, EXPENSES.colour];
        labels = [INCOME.value, EXPENSES.value];
    } else {
        categoryStats.forEach((category: CategoryStat) => {
            series.push(Number(category.total));
            colours.push(category.colour);
            labels.push(category.name);
        });
    }

    // Unique key based on total to force a re-render when total changes
    const chartKey = `donut-chart-${total}`

    return (
        <>
            <div className="flex items-center justify-center w-1/2">
                <DonutChart
                    key={chartKey}
                    series={series}
                    colours={colours}
                    labels={labels}
                    total={total}
                />
            </div>
            <div className="w-1/2">
                <CategoryStatsTable categoryStats={categoryStats} />
            </div>
        </>
    );
}
