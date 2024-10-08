"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import useSWR from "swr";
import { fetcherWithToken } from "../lib/utils";
import Loader from "../components/dashboard/loader";
import { KeyValueProp } from "../types";
import dynamic from "next/dynamic";
import { EXPENSES, INCOME, MONTHS, NET_INCOME } from "../constants";
import StatCard from "../components/ui/stat-card";
import CategoriesCard from "../components/ui/categories-card";
import DateSelection from "../components/ui/date-selection";

const MonthlyTransactionsBarChart = dynamic(() => import('./components/monthly-transactions-bar-chart'), { ssr: false });

export default function Overview() {
    const { getToken } = useAuth();
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());

    // Fetch all years related to transactions
    const {
        data: years,
        error: yearsError,
        isLoading: yearsLoading,
    } = useSWR<KeyValueProp<string, string>[], Error, any>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/years`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    // Fetch monthly transactions for the selected month and year
    const {
        data: monthlyTransactions,
        error: monthlyTransactionsError,
        isLoading: isMonthlyTransactionsLoading,
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/overview/monthly-transactions?year=${year}`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );
    
    // Fetch overview data for the selected month and year
    const {
        data: overview,
        error: overviewError,
        isLoading: overviewLoading,
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/overview/summary?month=${month}&year=${year}`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );
    
    if (monthlyTransactionsError || yearsError || overviewError) {
        throw monthlyTransactionsError || yearsError || overviewError || new Error("Failed to load overview data");
    }

    if (isMonthlyTransactionsLoading || yearsLoading || overviewLoading) {
        return <Loader />;
    }

    const statsRow = [
        {
            title: NET_INCOME.title,
            amount: overview.finances.netIncome,
            icon: NET_INCOME.iconName
        },
        {
            title: INCOME.title,
            amount: overview.finances.income,
            icon: INCOME.iconName
        },
        {
            title: EXPENSES.title,
            amount: overview.finances.expense,
            icon: EXPENSES.iconName
        }
    ]

    return (
        <div className="space-y-4">
            <div className="flex flex-row w-full">
                <h1 className="text-4xl font-bold w-4/5">
                    Overview of {MONTHS[month - 1]} {year}
                </h1>
                <div className="flex flex-row w-1/5 my-auto gap-2">
                    <DateSelection 
                        years={years} 
                        month={month} 
                        setMonth={setMonth} 
                        year={year} 
                        setYear={setYear}
                    />
                </div>
            </div>
            <div className="flex flex-row space-x-4 justify-between">
                {statsRow.map((item, index) => (
                    <div key={index} className="card w-full">
                        <StatCard item={item} fontSize={["text-2xl", "text-4xl"]} />
                    </div>
                ))}
            </div>
            <div className="flex flex-row space-x-4">
                <CategoriesCard 
                    title="Top Spending Categories" 
                    categories={overview.topSpendingCategories} 
                />
                <CategoriesCard 
                    title="Frequent Spending Categories" 
                    categories={overview.frequentSpendingCategories} 
                />
            </div>
            <div className="card p-0">
                <p className="chart-title">Monthly Transactions</p>
                <MonthlyTransactionsBarChart 
                    incomeData={monthlyTransactions.income} 
                    expenseData={monthlyTransactions.expenses} 
                />
            </div>
        </div>
    );
}
