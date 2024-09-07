import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CardHeader from "./card-header";
import CategoryBar from "./category-bar";
import { BudgetTargetProps, CategoryTotalProps } from "@/app/types";

export default function CategoryCard({
    type,
    categoryTotals,
    budgetTargets,
    month,
    year
}: {
    type: string;
    categoryTotals: CategoryTotalProps[];
    budgetTargets: BudgetTargetProps[];
    month: number;
    year: string;
}) {
    const [editMode, setEditMode] = useState(false);
    const methods = useForm();

    return (
        <div className="card w-full">
            <FormProvider {...methods}>
                <form>
                    <CardHeader 
                        type={type}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        methods={methods}
                        month={month}
                        year={year}
                    />
                    {categoryTotals.map((c: CategoryTotalProps) => 
                        <CategoryBar
                            key={c.id}
                            categoryTotal={c}
                            budgetTarget={budgetTargets.find((b: BudgetTargetProps) => b.category_id === c.id) || undefined}
                            editMode={editMode}
                        />
                    )}
                </form>
            </FormProvider>
        </div>
    );
};
