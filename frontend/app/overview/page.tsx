"use client";

import { useAuth } from "@clerk/nextjs";
import React from "react";
import useSWR from "swr";
import { fetcherWithToken } from "../lib/utils";
import MonthlyTransactionsChart from "./components/monthly-transactions-chart";

type TopSpendingCategory = {
    name: string;
    total_spent: number;
    colour: string;
    icon: string;
};

type FrequentSpendingCategory = {
    name: string;
    count: number;
    colour: string;
    icon: string;
};

export default function Overview() {
    const { getToken } = useAuth();

    const {
        data: monthlyTransactions,
        error: monthlyTransactionsError,
        isLoading: isMonthlyTransactionsLoading,
    } = useSWR(
        "http://localhost:8080/api/overview/monthly-transactions",
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    const {
        data: topSpendingCategories,
        error: topSpendingCategoriesError,
        isLoading: isTopSpendingCategoriesLoading,
    } = useSWR(
        "http://localhost:8080/api/overview/monthly-top-spending-categories",
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    const {
        data: frequentSpendingCategories,
        error: frequentSpendingCategoriesError,
        isLoading: isFrequentSpendingCategoriesLoading,
    } = useSWR(
        "http://localhost:8080/api/overview/monthly-frequent-spending-categories",
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    const {
        data: finances,
        error: financesError,
        isLoading: financesLoading,
    } = useSWR(
        "http://localhost:8080/api/overview/monthly-finances",
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    return (
        <div>
            <h1 className="font-bold text-4xl mb-4">This Month's Overview</h1>
            {financesLoading && (
                <div>Loading finance data...</div>
            )}
            {financesError && (
                <div>Failed to load finance data</div>
            )}
            {finances && (
                <div className="flex flex-nowrap gap-4">
                    <div className="border border-zinc-200 bg-white rounded-lg my-2 p-4 w-1/3">
                        <p className="text-2xl pb-8">Net Income</p>
                        <div className="text-4xl font-bold">
                            {finances.netIncome}
                        </div>
                    </div>
                    <div className="border border-zinc-200 bg-white rounded-lg my-2 p-4 w-1/3">
                        <p className="text-2xl pb-8">Income</p>
                        <div className="text-4xl font-bold">
                            {finances.income}
                        </div>
                    </div>
                    <div className="border border-zinc-200 bg-white rounded-lg my-2 p-4 w-1/3">
                        <p className="text-2xl pb-8">Expenses</p>
                        <div className="text-4xl font-bold">
                            {finances.expense}
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-nowrap gap-4">
                <div className="border border-zinc-200 bg-white rounded-lg my-2 p-4 w-1/2">
                    <p className="text-2xl pb-8">
                        Top Spending Categories
                    </p>
                    {isTopSpendingCategoriesLoading && (
                        <div>Loading top spending categories data...</div>
                    )}
                    {topSpendingCategoriesError && (
                        <div>Failed to load top spending categories data</div>
                    )}
                    {topSpendingCategories && (
                        <div className="flex flex-nowrap gap-4">
                            {topSpendingCategories.map(
                                (category: TopSpendingCategory) => (
                                    <div
                                        className="rounded-lg p-4 w-52"
                                        key={category.name}
                                        style={{ backgroundColor: category.colour }}
                                    >
                                        <div className="text-lg font-bold">
                                            {category.name}
                                        </div>
                                        <div className="text-2xl">
                                            {category.total_spent}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
                <div className="border border-zinc-200 bg-white rounded-lg my-2 p-4 w-1/2">
                    <p className="text-2xl pb-8">
                        Frequent Spending Categories
                    </p>
                    {isFrequentSpendingCategoriesLoading && (
                        <div>Loading frequent spending categories data...</div>
                    )}
                    {frequentSpendingCategoriesError && (
                        <div>Failed to load frequent spending categories data</div>
                    )}
                    {frequentSpendingCategories && (
                        <div className="flex flex-row items-center gap-4">
                            {frequentSpendingCategories.map(
                                (category: FrequentSpendingCategory) => (
                                    <div
                                        className="rounded-lg p-4 w-52"
                                        key={category.name}
                                        style={{
                                            backgroundColor: category.colour,
                                        }}
                                    >
                                        <div className="text-lg font-bold">
                                            {category.name}
                                        </div>
                                        <div className="text-2xl">
                                            {category.count}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="border border-zinc-200 bg-white rounded-lg my-2">
                <p className="text-2xl p-4 pb-3">Monthly Transactions</p>
                {isMonthlyTransactionsLoading && (
                    <div>Loading monthly transactions data...</div>
                )}
                {monthlyTransactionsError && (
                    <div>Failed to load monthly transactions data</div>
                )}
                {monthlyTransactions && (
                    <MonthlyTransactionsChart data={monthlyTransactions} />
                )}
            </div>
        </div>
    );
}
