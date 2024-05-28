"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import CategoryStats from "../components/category-stats";
import Transactions from "../components/transactions";
import { Category } from "@/app/types";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import { IsLoadingResponse } from "swr/_internal";

export default function AllTransactions() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [type, setType] = useState<string>("all");
    const [category, setCategory] = useState<string>("all");

    const {
        data: transactions,
        error: fetchTransactionsError,
        isLoading: fetchTransactionsLoading
    } = useSWR(
        `http://localhost:8080/api/transactions/all/${user?.id}?type=${type}&category=${category}`, // TODO: On load, user is not defined, so this runs once as an error
        fetcher,
        { refreshInterval: 1000}
    );

    const {
        data: categories,
        error: fetchCategoriesError,
        isLoading: fetchCategoriesLoading
    } = useSWR<Category[], Error, any>(
        `http://localhost:8080/api/categories?type=${type}`,
        fetcher
    );

    // User
    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="font-bold text-3xl pb-4">Transactions</h1>
            <div className="border border-zinc-300 mb-4">
                <ul className="flex flex-nowrap">
                    <li className="pr-8">
                        <div className="flex flex-nowrap">
                            <p>Period:&nbsp;</p>
                            <select>
                                <option>All Time</option>
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>This Year</option>
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
                                {fetchCategoriesLoading && <option disabled>Loading...</option>}
                                {fetchCategoriesError && <option disabled>Error loading categories</option>}
                                {categories && (
                                    <>
                                        <option value="all">All</option>
                                        {categories.map((category: Category) => (
                                            <option key={category.id} value={category.value}>{category.name}</option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="flex flex-wrap mb-4">
                <CategoryStats type={type} user_id={user.id} />
            </div>
            {fetchTransactionsError && <div>Error loading transactions</div>}
            {fetchTransactionsLoading && <div>Loading...</div>}
            {transactions && (
                <Transactions transactions={transactions} />
            )}
        </div>
    );
}
