"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { fetcherWithToken } from "../lib/utils";
import useSWR from "swr";
import Loader from "../components/dashboard/loader";
import DateSelection from "../components/ui/date-selection";
import { EXPENSE, INCOME, MONTHS } from "../constants";
import { KeyValueProp } from "../types";
import CategoryCard from "./components/category-card";
import StatCard from "./components/stat-card";

export default function Budget() {
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

    // Fetch all category totals for the month and year
    const {
        data: categoryTotals,
        error: categoryTotalsError,
        isLoading: categoryTotalsLoading
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/category/totals?month=${month}&year=${year}`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    // Fetch all budget targets for the month and year
    const {
        data: budgetTargets,
        error: budgetTargetsError,
        isLoading: budgetTargetsLoading
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/budget/targets?month=${month}&year=${year}`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    if (yearsError || categoryTotalsError || budgetTargetsError) {
        throw yearsError || categoryTotalsError || budgetTargetsError || new Error("Failed to load budget data");
    }

    if (yearsLoading || categoryTotalsLoading || budgetTargetsLoading) {
        return <Loader />;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-row w-full">
                <h1 className="text-3xl font-bold w-4/5">
                    Budget of {MONTHS[month - 1]} {year}
                </h1>
                <div className="flex flex-row w-1/5 my-auto gap-2">
                    <DateSelection 
                        years={years} 
                        month={month} 
                        setMonth={setMonth} 
                        year={year} 
                        setYear={setYear}
                        emptyMonth={true}
                    />
                </div>
            </div>
            <div className="flex flex-row space-x-4">
                <div className="w-full space-y-4">
                    <CategoryCard
                        type={INCOME.value}
                        categoryTotals={categoryTotals.income}
                        budgetTargets={budgetTargets.categories} 
                        month={month} 
                        year={year}
                    />
                    <StatCard 
                        categoryTotals={categoryTotals} 
                        budgetTargets={budgetTargets}
                    />
                </div>
                <CategoryCard
                    type={EXPENSE.value}
                    categoryTotals={categoryTotals.expense}
                    budgetTargets={budgetTargets.categories} 
                    month={month} 
                    year={year} 
                />
            </div>
        </div>
    );
}
