import { Tooltip, Progress, Input } from "@nextui-org/react";
import { useFormContext, Controller } from "react-hook-form";
import { BudgetTargetProps, CategoryTotalProps } from "@/app/types";

// CategoryBar component to display the amount progress bar for each category
export default function CategoryBar({
    categoryTotal,
    budgetTarget,
    editMode
}: {
    categoryTotal: CategoryTotalProps;
    budgetTarget?: BudgetTargetProps;
    editMode: boolean;
}) {
    const { control } = useFormContext();
    const total = Number(categoryTotal.total);
    let target = Number(budgetTarget?.target || 0);

    let percentage = Number(((total / target) * 100).toFixed(2));
    if (isNaN(percentage) || !isFinite(percentage)) percentage = 0;

    const colour = categoryTotal.type === "income"
        // Income colour scheme
        ? percentage >= 95
            ? "success"
            : percentage > 70
                ? "warning"
                : percentage > 0
                    ? "danger"
                    : "default"
        // Expense colour scheme
        : percentage >= 95
            ? "danger"
            : percentage > 60
                ? "warning"
                : percentage > 0
                    ? "success"
                    : "default";

    return (
        <div className="py-2">
            <div className="flex flex-row space-x-4">
                <Tooltip 
                    placement="bottom"
                    content={`${percentage}%`}
                >
                    <Progress
                        label={categoryTotal.name}
                        size="md"
                        value={total}
                        maxValue={target}
                        valueLabel={`$ ${total} / ${target}`}
                        color={colour}
                        showValueLabel={true}
                        className={editMode ? "w-4/5" : "w-full"}
                    />
                </Tooltip>
                <Controller
                    name={categoryTotal.id}
                    control={control}
                    defaultValue={target | 0}
                    rules={{ min: 0 }}
                    render={({ field: { onChange, onBlur, ref, value } }) => 
                        <Input
                            ref={ref}
                            type="number"
                            placeholder="0.00"
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value).toString())}
                            onBlur={onBlur}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                </div>
                            }
                            className={editMode ? "w-1/5" : "hidden"}
                        />
                    }
                />
            </div>
        </div>
    );
};
