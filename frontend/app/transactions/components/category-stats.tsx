import React from "react";
import useSWR from "swr";
import { fetcherWithToken } from "@/app/lib/utils";
import CategoryStatsTable from "./category-stats-table";
import { useAuth } from "@clerk/nextjs";
import Loader from "@/app/components/dashboard/loader";
import dynamic from "next/dynamic";

const DonutChart = dynamic(() => import('./donut-chart'), { ssr: false });

export default function CategoryStats({
    type,
    period
}: {
    type: string;
    period: string;
}) {
    const { getToken } = useAuth();

    const {
        data,
        error,
        isLoading,
    } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/category/stats?type=${type}&period=${period}`,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    if (error) throw error || new Error("An error occurred while fetching category stats and total");
    if (isLoading) return <Loader />;

    const { categoryStats, incomeTotal, expenseTotal } = data;

    // Unique key based on total to force a re-render when total changes
    const chartKey = `donut-chart-${incomeTotal}-${expenseTotal}`

    return (
        <div className="flex flex-row">
            <div className="mx-auto">
                <div className="w-3/5">
                    <DonutChart
                        key={chartKey}
                        type={type}
                        categoryStats={categoryStats}
                        incomeTotal={incomeTotal}
                        expenseTotal={expenseTotal}
                    />
                </div>
            </div>
            <div className="w-2/5">
                <CategoryStatsTable categoryStats={categoryStats} />
            </div>
        </div>
    );
}
