"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import CategoryStats from "../components/category-stats";
import Transactions from "../components/transactions";
import { Category } from "@/app/types";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";

export default function AllTransactions() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [type, setType] = useState<string>("all");
    const [category, setCategory] = useState<string>("all");
    const [period, setPeriod] = useState<string>("allTime");

    const {
        data: transactions,
        error: fetchTransactionsError,
        isLoading: fetchTransactionsLoading,
    } = useSWR(
        `http://localhost:8080/api/transactions/all/${user?.id}?type=${type}&category=${category}&period=${period}`, // TODO: On load, user is not defined, so this runs once as an error
        fetcher
    );

    const {
        data: categories,
        error: fetchCategoriesError,
        isLoading: fetchCategoriesLoading,
    } = useSWR<Category[], Error, any>(
        `http://localhost:8080/api/categories/unique?type=${type}`,
        fetcher
    );

    const {
        data: years,
        error: fetchYearsError,
        isLoading: fetchYearsLoading,
    } = useSWR<string[], Error, any>(
        `http://localhost:8080/api/transactions/years/${user?.id}`,
        fetcher
    );

    // User
    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="font-bold text-3xl pb-4">Transaction History</h1>
            <div className="border border-zinc-300 mb-4">
                <ul className="flex flex-nowrap font-sans">
                    <li className="pr-8">
                        <div className="flex flex-nowrap">
                            <p>Period:&nbsp;</p>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                {fetchYearsError && <option>Error loading periods</option>}
                                {fetchYearsLoading && <option>Loading periods...</option>}
                                {years && (
                                    <>
                                        <option value="allTime">All Time</option>
                                        <option value="last7Days">Last 7 days</option>
                                        <option value="last30Days">Last 30 days</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                    </li>
                    <li className="pr-8">
                        <div className="flex flex-nowrap">
                            <p>Type:&nbsp;</p>
                            <select
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setCategory("all");
                                }}
                            >
                                <option value="all">All</option>
                                <option value="income">Income</option>
                                <option value="expense">Expenses</option>
                            </select>
                        </div>
                    </li>
                    <li className="pr-8">
                        <div className="flex flex-nowrap">
                            <p>Category:&nbsp;</p>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {fetchCategoriesLoading && (
                                    <option disabled>Loading...</option>
                                )}
                                {fetchCategoriesError && (
                                    <option disabled>
                                        Error loading categories
                                    </option>
                                )}
                                {categories && (
                                    <>
                                        <option value="all">All</option>
                                        {categories.map(
                                            (category: Category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.value}
                                                >
                                                    {category.name}
                                                </option>
                                            )
                                        )}
                                    </>
                                )}
                            </select>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="flex flex-wrap mb-4">
                <CategoryStats type={type} period={period} user_id={user.id} />
            </div>
            {fetchTransactionsError && <div>Error loading transactions</div>}
            {fetchTransactionsLoading && <div>Loading...</div>}
            {transactions && <Transactions transactions={transactions} />}
        </div>
    );
}
