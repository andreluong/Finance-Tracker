import { INCOME, EXPENSES } from "@/app/constants";
import { CategoryStat } from "@/app/types";
import React from "react";
import ReactApexChart from "react-apexcharts";

export default function DonutChart({
    type,
    categoryStats,
    incomeTotal,
    expenseTotal
}: {
    type: string;
    categoryStats: CategoryStat[];
    incomeTotal: string;
    expenseTotal: string;
}) {
    const calculateNetTotal = (income: any, expense: any) => Number(income - expense).toFixed(2);

    const determineNetTotalLabel = (type: string, netTotal: string) => {
        return type === "all"
            ? "Net Income"
            : Number(netTotal) >= 0
                ? "Income Total"
                : "Expense Total";
    };

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

    const chartState = {
        series: series,
        options: {
            colors: colours,
            labels: labels,
            legend: {
                show: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            value: {
                                show: true,
                                fontFamily: "sans-serif",
                                fontSize: "24px",
                                color: "#000000",
                                formatter: (val: number | string) => `$${val}`,
                            },
                            total: {
                                show: true,
                                fontFamily: "sans-serif",
                                fontWeight: "bold",
                                fontSize: "20px",
                                label: netTotalLabel,
                                color: "#000000",
                                formatter: () => `$${netTotal}`,
                            },
                        },
                        size: "70%"
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 490,
                    options: {
                        chart: {
                            width: 400,
                        },
                    },
                },
            ],
        },
    };

    return (
        <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="donut"
            width="450"
        />
    );
}
