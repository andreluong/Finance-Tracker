
import Loader from '@/app/components/dashboard/loader';
import { fetcher } from '@/app/lib/utils';
import { Category } from '@/app/types';
import { Select, SelectItem } from '@nextui-org/react'
import React from 'react'
import { ControllerRenderProps } from 'react-hook-form';
import useSWR from 'swr';

export default function CategorySelection({ 
    field, 
    type
}: { 
    field: ControllerRenderProps<any, "category">,
    type: string
}) {
    const {
        data: categories,
        error,
        isLoading
    } = useSWR("http://localhost:8080/api/categories/all", fetcher);

    const renderCategories = (categories: Category[]) => {
        return categories.map((category) => 
            <SelectItem key={category.id} value={category.id}>
                {category.name}
            </SelectItem>
        );
    };

    if (error) throw error || new Error("Failed to load categories");
    if (isLoading) return <Loader />;

    return (
        <Select
            {...field}
            selectedKeys={[field.value]}
            label="Category"
            id="category"
            className="w-full"
            variant="faded"
            isRequired
        >
            {type === "income" ? renderCategories(categories.income)
            : type === "expense" ? renderCategories(categories.expense)
            : []}
        </Select>
    )
}
