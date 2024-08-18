"use client";

import useSWR from "swr";
import { fetcherWithToken } from "../lib/utils";
import Loader from "../components/dashboard/loader";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import TotalStatsBar from "./components/total-stats-bar";
import { MonthlyTransactionsProp } from "../types";
import { EXPENSE, EXPENSES, INCOME, MONTHS_SHORT } from "../constants";
import CategoriesCard from "../components/ui/categories-card";

const LineChart = dynamic(() => import('./components/line-chart'), { ssr: false });

export default function Statistics() {
    const { getToken } = useAuth();

    const {
        data: monthlyData,
        error: monthlyDataError,
        isLoading: monthlyDataIsLoading,
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/statistics/monthly-transactions`,
        async (url: string) => fetcherWithToken(url, await getToken())
    )

    const {
        data: categories,
        error: categoriesError,
        isLoading: categoriesIsLoading,
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/statistics/categories`,
        async (url: string) => fetcherWithToken(url, await getToken())
    )

    if (monthlyDataError || categoriesError) 
        throw monthlyDataError || categoriesError || new Error("Failed to load statistics");
    if (monthlyDataIsLoading || categoriesIsLoading) return <Loader />;

    // Monthly income
    const monthlyIncome = monthlyData.monthlyTransactions
        .filter((transaction: MonthlyTransactionsProp) => transaction.type === INCOME.value)
        .map((transaction: MonthlyTransactionsProp) => transaction.total_amount);

    // Monthly Expenses
    const monthlyExpenses = monthlyData.monthlyTransactions
        .filter((transaction: MonthlyTransactionsProp) => transaction.type === EXPENSE.value)
        .map((transaction: MonthlyTransactionsProp) => transaction.total_amount);

    // Get unique dates from monthly transactions
    const dates: string[] = Array.from(new Set(monthlyData.monthlyTransactions.map((transaction: MonthlyTransactionsProp) => {
        const month = MONTHS_SHORT[transaction.month - 1];
        return `${month} ${transaction.year}`;
    })));

    // Calculate cumulative net income
    const cumulativeNetIncome = [];
    let totalNetIncome = 0;
    const maxLength = Math.max(monthlyIncome.length, monthlyExpenses.length);

    for (let i = 0; i < maxLength; i++) {
        const incomeValue = monthlyIncome[i] || 0;
        const expenseValue = monthlyExpenses[i] || 0;
        const netIncome = incomeValue - expenseValue;
        totalNetIncome += netIncome;
        cumulativeNetIncome.push(Number(totalNetIncome.toFixed(2)));
    }

    return (
        <div className="space-y-4">
            <h1 className="font-bold text-3xl">Statistics</h1>
            <TotalStatsBar 
                totalIncome={monthlyData.totalIncome.total} 
                totalExpenses={monthlyData.totalExpenses.total}
                numTransactions={monthlyData.numTransactions}
            />
            <div className="card p-0">
                <p className="chart-title">Cumulative Net Income</p>
                <LineChart 
                    series={[{ name: "Net Income", data: cumulativeNetIncome }]} 
                    colors={["#00b0ff"]} 
                    dates={dates} 
                />
            </div>
            <div className="card p-0">
                <p className="chart-title">Monthly Transactions</p>
                <LineChart
                    series={[
                        { name: "Monthly Income", data: monthlyIncome },
                        { name: "Monthly Expenses", data: monthlyExpenses }
                    ]}
                    colors={[INCOME.colour, EXPENSE.colour]}
                    dates={dates}
                />
            </div>
            <CategoriesCard 
                title={INCOME.title} 
                categories={categories.income} 
                columns={4}
            />
            <CategoriesCard 
                title={EXPENSES.title} 
                categories={categories.expense} 
                columns={4}
            />
        </div>
    );
}
