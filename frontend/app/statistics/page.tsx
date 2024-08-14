"use client";

import useSWR from "swr";
import { fetcherWithToken } from "../lib/utils";
import Loader from "../components/dashboard/loader";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import TotalStatsBar from "./components/total-stats-bar";
import { MonthlyTransactionsProp } from "../types";
import { EXPENSE, EXPENSES, INCOME, MONTHS_SHORT } from "../constants";
import CategoriesCard from "./components/categories-card";

const MonthlyTransactionsLineChart = dynamic(() => import('./components/monthly-transactions-line-chart'), { ssr: false });
const NetIncomeLineChart = dynamic(() => import('./components/net-income-line-chart'), { ssr: false });

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

    return (
        <div className="space-y-4">
            <h1 className="font-bold text-3xl">Statistics</h1>
            <TotalStatsBar 
                totalIncome={monthlyData.totalIncome.total} 
                totalExpenses={monthlyData.totalExpenses.total}
                numTransactions={monthlyData.numTransactions}
            />
            <div className="border border-zinc-200 rounded-lg bg-white">
                <p className="text-2xl p-4 pb-3">Cumulative Net Income</p>
                <NetIncomeLineChart monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} dates={dates} />
            </div>
            <div className="border border-zinc-200 rounded-lg bg-white">
                <p className="text-2xl p-4 pb-3">Monthly Transactions</p>
                <MonthlyTransactionsLineChart monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} dates={dates} />
            </div>
            <CategoriesCard title={INCOME.title} categories={categories.income} />
            <CategoriesCard title={EXPENSES.title} categories={categories.expense} />
        </div>
    );
}
