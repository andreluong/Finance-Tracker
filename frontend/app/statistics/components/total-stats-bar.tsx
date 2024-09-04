import StatCard from "@/app/components/ui/stat-card";
import { EXPENSES, INCOME, NET_INCOME } from "@/app/constants";

export default function TotalStatsBar({
    totalIncome,
    totalExpenses,
    numTransactions
}: {
    totalIncome: number;
    totalExpenses: number;
    numTransactions: number;
}) {
    const netIncome = Number((totalIncome - totalExpenses).toFixed(2));

    const totalStats = [
        {
            title: "Total Net Income",
            amount: netIncome,
            icon: NET_INCOME.iconName          
        },
        {
            title: "Total Profit Ratio",
            amount: (netIncome / totalIncome * 100 || 0).toFixed(2) + "%",
            icon: "lucide:divide"
        },
        {
            title: "Total Income",
            amount: totalIncome,
            icon: INCOME.iconName
        },
        {
            title: "Total Expenses",
            amount: totalExpenses,
            icon: EXPENSES.iconName
        },
        {
            title: "Total Transactions",
            amount: numTransactions,
            icon: "lucide:credit-card"
        }
    ]

    return (
        <div className="flex flex-row justify-between card">
            {totalStats.map((item) => (
                <StatCard item={item} />
            ))}
        </div>
    )
}
