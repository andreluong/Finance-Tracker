"use client";

import React from "react";
import useSWR from "swr";
import { fetcherWithToken } from "../lib/utils";
import Loader from "../components/dashboard/loader";
import { useAuth } from "@clerk/nextjs";
import CategoriesColumnChart from "./components/categories-column-chart";

export default function Statistics() {
    const { getToken } = useAuth();

    const {
        data: statistics,
        error: statisticsError,
        isLoading: statisticsIsLoading,
    } = useSWR(
        'http://localhost:8080/api/statistics/income-expense-stats',
        async (url: string) => fetcherWithToken(url, await getToken())
    )

    if (statisticsError) throw statisticsError || new Error("Failed to load statistics");
    if (statisticsIsLoading) return <Loader />;

    return (
        <div>
            <h1 className="font-bold text-3xl pb-4">Statistics</h1>
            <div className="flex flex-row justify-between gap-4">
                <div className="border border-zinc-200 rounded-lg p-4 w-1/2 bg-white">
                    <h2 className="font-bold text-2xl pb-4">Income</h2>
                    <div className="flex flex-row justify-between gap-4">
                        <div className="rounded-lg p-4 w-1/2 bg-emerald-100 space-y-2">
                            <p>Total Amount</p>
                            <p>${statistics.income.total}</p>
                        </div>
                        <div className="rounded-lg p-4 w-1/2 bg-emerald-100 space-y-2">
                            <p>Total Transactions</p>
                            <p>{statistics.income.count}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-2xl mt-8">Categories</p>
                        <div>
                            <p className="text-xl p-4 pb-3">Earned</p>
                            <CategoriesColumnChart categoryData={statistics.income.categories} dataKey="total" />
                        </div>
                        <div>
                            <p className="text-xl p-4 pb-3">Frequency</p>
                            <CategoriesColumnChart categoryData={statistics.income.categories} dataKey="count" />
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-200 rounded-lg p-4 w-1/2 bg-white">
                    <h2 className="font-bold text-2xl pb-4">Expenses</h2>

                    <div className="flex flex-row justify-between gap-4">
                        <div className="rounded-lg p-4 w-1/2 bg-emerald-100 space-y-2">
                            <p>Total Amount</p>
                            <p>${statistics.expense.total}</p>
                        </div>
                        <div className="rounded-lg p-4 w-1/2 bg-emerald-100 space-y-2">
                            <p>Total Transactions</p>
                            <p>{statistics.expense.count}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-2xl mt-8">Categories</p>
                        <div>
                            <p className="text-xl p-4 pb-3">Spent</p>
                            <CategoriesColumnChart categoryData={statistics.expense.categories} dataKey="total" />
                        </div>
                        <div>
                            <p className="text-xl p-4 pb-3">Frequency</p>
                            <CategoriesColumnChart categoryData={statistics.expense.categories} dataKey="count" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
