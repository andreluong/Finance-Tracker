import { EXPENSES, INCOME } from "@/app/constants";
import { Icon } from "@iconify/react/dist/iconify.js"

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
            icon: <Icon icon="mdi:chart-line" width="3rem" height="3rem" />            
        },
        {
            title: "Total Profit Ratio",
            amount: (netIncome / totalIncome * 100).toFixed(2) + "%",
            icon: <Icon icon="lucide:divide" width="3rem" height="3rem" />
        },
        {
            title: "Total Income",
            amount: totalIncome,
            icon: <Icon icon={INCOME.iconName} width="3rem" height="3rem" />
        },
        {
            title: "Total Expenses",
            amount: totalExpenses,
            icon: <Icon icon={EXPENSES.iconName} width="3rem" height="3rem" />
        },
        {
            title: "Total Transactions",
            amount: numTransactions,
            icon: <Icon icon="lucide:credit-card" width="3rem" height="3rem" />
        }
    ]

    return (
        <div className="flex flex-row justify-between border border-zinc-200 rounded-lg p-4 bg-white">
            {totalStats.map((item, index) => (
                <div key={index} className="flex flex-row space-x-4">
                    <div className="my-auto">
                        {item.icon}
                    </div>
                    <div>
                        <p className="text-lg pb-2">{item.title}</p>
                        <p className="text-2xl font-bold">{item.amount}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
