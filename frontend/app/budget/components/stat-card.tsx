import { BudgetTargetProps, CategoryTotalProps } from "@/app/types";

type TotalBudgetTargetProps = {
    total_target: string | number;
    type: string;
}

export default function StatCard({
    categoryTotals,
    budgetTargets
}: {
    categoryTotals: {
        income: CategoryTotalProps[];
        expense: CategoryTotalProps[];
    }
    budgetTargets: {
        categories: BudgetTargetProps[];
        income: TotalBudgetTargetProps;
        expense: TotalBudgetTargetProps;
    }
}) {
    // Sum of expenses and income totals
    const totalIncome = categoryTotals.income.reduce((acc: number, category: CategoryTotalProps) => acc + parseInt(category.total), 0);
    const totalExpenses = categoryTotals.expense.reduce((acc: number, category: CategoryTotalProps) => acc + parseInt(category.total), 0);

    const totalIncomeTarget = Number(budgetTargets?.income?.total_target) || 0;
    const totalExpenseTarget = Number(budgetTargets?.expense?.total_target) || 0;

    console.log("budgetTargets", budgetTargets, "categoryTotals", categoryTotals);

    return (
        <div className="grid grid-flow-col justify-stretch gap-4">
            <div className="card flex flex-row justify-between p-4">
                <div className="space-y-2">
                    <p>Total Income:</p>
                    <p>Total Expenses:</p>
                    <p>Net Income:</p>
                </div>
                <div className="space-y-2 text-right">
                    <p>$ {totalIncome}</p>
                    <p>$ {totalExpenses}</p>
                    <p>$ {totalIncome-totalExpenses}</p>
                </div>
            </div>
            <div className="card flex flex-row justify-between p-4">
                <div className="space-y-2">
                    <p>Target Income:</p>
                    <p>Target Expenses:</p>
                    <p>Target Net Income:</p>
                </div>
                <div className="space-y-2 text-right">
                    <p>$ {totalIncomeTarget}</p>
                    <p>$ {totalExpenseTarget}</p>
                    <p>$ {totalIncomeTarget-totalExpenseTarget}</p>
                </div>
            </div>
        </div>
    );
}
