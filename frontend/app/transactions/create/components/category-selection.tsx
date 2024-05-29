import React, { ChangeEvent, FC } from 'react'
import { Category } from '@/app/types';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';

interface CategorySelectionProps {
    onCategoryChange: (category: string) => void;
    type : string;
}

const CategorySelection: FC<CategorySelectionProps> = ({onCategoryChange, type}) => {
    const url = type === 'all'
        ? 'http://localhost:8080/api/categories'
        : `http://localhost:8080/api/categories/${type}`;

    const { data: categories, error, isLoading } = useSWR(url, fetcher);
    
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onCategoryChange(event.target.value);
    }

    return (
        <select 
            name='category' 
            id='category' 
            className='w-full border border-gray-200 bg-white rounded p-2' 
            onChange={handleSelectChange}
        >
            {isLoading && <option disabled>Loading...</option>}
            {error && <option disabled>Error loading categories</option>}
            {categories && categories.map((category: Category) => (
                <option key={category.id} value={category.value} className='font-sans'>{category.name}</option>
            ))}
        </select>
    )
}

export default CategorySelection;