"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import useSWR from "swr";
import { fetcherWithToken } from "../lib/utils";
import { Select, SelectItem } from "@nextui-org/react";
import Loader from "../components/dashboard/loader";
import { KeyValueProp } from "../types";
import dynamic from "next/dynamic";
import { EXPENSES, INCOME, MONTHS, NET_INCOME } from "../constants";
import StatCard from "../components/ui/stat-card";

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

const MonthlyTransactionsBarChart = dynamic(() => import('./components/monthly-transactions-bar-chart'), { ssr: false });

export default function Overview() {
    const { getToken } = useAuth();
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());

    const {
        data: monthlyTransactions,
        error: monthlyTransactionsError,
        isLoading: isMonthlyTransactionsLoading,
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/overview/monthly-transactions?year=${year}`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    const {
        data: years,
        error: yearsError,
        isLoading: yearsLoading,
    } = useSWR<KeyValueProp<string, string>[], Error, any>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/years`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

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
        <div>
            <div className="flex flex-row w-full">
                <h1 className="text-4xl font-bold mb-4 w-4/5">
                    Overview of {MONTHS[month - 1]} {year}
                </h1>
                <div className="flex flex-row w-1/5 my-auto gap-2">
                    <Select
                        selectedKeys={[String(month)]}
                        placeholder="Select a month"
                        className="w-3/5"
                        variant="faded"
                        onChange={(e) => setMonth(Number(e.target.value))}
                        style={{
                            backgroundColor: "white"
                        }}
                    >
                        {MONTHS.map((month, index) => (
                            <SelectItem key={index + 1} value={month}>
                                {month}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select
                        items={years}
                        selectedKeys={[year]}
                        placeholder="Select a year"
                        className="w-2/5"
                        variant="faded"
                        onChange={(e) => setYear(e.target.value.toString())}
                        disallowEmptySelection
                        style={{
                            backgroundColor: "white"
                        }}
                    >
                        {(year: KeyValueProp<string, string>) => (
                            <SelectItem key={year.value} value={year.value}>
                                {year.label}
                            </SelectItem>
                        )}
                    </Select>
                </div>
            </div>
            <div className="flex flex-row space-x-4 justify-between mb-2">
                {statsRow.map((item) => (
                    <div className="bg-white border border-zinc-200 rounded-lg p-4 w-full">
                        <StatCard item={item} fontSize={["text-2xl", "text-4xl"]} />
                    </div>
                ))}
            </div>
            <div className="flex flex-row gap-4 w-full">
                <div className="border border-zinc-200 bg-white rounded-lg my-2 p-4 w-1/2">
                    <p className="text-2xl pb-8">
                        Top Spending Categories
                    </p>
                    <div className="flex flex-row gap-4">
                        {overview.topSpendingCategories.map(
                            (category: TopSpendingCategory) => (
                                <div
                                    className="rounded-lg p-4 w-1/4"
                                    key={category.name}
                                    style={{ backgroundColor: category.colour }}
                                >
                                    <div className="text-lg font-bold">
                                        {category.name}
                                    </div>
                                    <div className="text-2xl">
                                        ${category.total_spent}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="border border-zinc-200 bg-white rounded-lg my-2 p-4 w-1/2">
                    <p className="text-2xl pb-8">Frequent Spending Categories</p>
                    <div className="flex flex-row items-center gap-4">
                        {overview.frequentSpendingCategories.map(
                            (category: FrequentSpendingCategory) => (
                                <div
                                    className="rounded-lg p-4 w-1/3"
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
                </div>
            </div>
            <div className="border border-zinc-200 bg-white rounded-lg my-2">
                <p className="text-2xl p-4 pb-3">Monthly Transactions</p>
                <MonthlyTransactionsBarChart data={monthlyTransactions} />
            </div>
        </div>
    );
}
